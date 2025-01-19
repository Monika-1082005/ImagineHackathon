from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:5174"]}})

# Load the dataset for plant disease treatment data
#treatment_data = pd.read_csv("Treatment.csv")


try:
    treatment_data = pd.read_csv("Treatment.csv", encoding="latin1")
    print("Data loaded successfully!")
except UnicodeDecodeError as e:
    print(f"Encoding error: {e}")
    print("Trying a different encoding...")
    treatment_data = pd.read_csv("Treatment.csv", encoding="utf-8", errors="replace")
    print("Loaded with fallback encoding.")

# Preprocess the dataset
treatment_data['Plant'] = treatment_data['Plant'].str.strip().str.lower()
treatment_data['Disease'] = treatment_data['Disease'].str.strip().str.lower()
treatment_data['Treatment_1'] = treatment_data['Treatment_1'].fillna('').str.strip()
treatment_data['Treatment_2'] = treatment_data['Treatment_2'].fillna('').str.strip()

# Encode labels for categorical variables
label_encoder = LabelEncoder()
treatment_data['Disease_encoded'] = label_encoder.fit_transform(treatment_data['Disease'])

# Features and target
X = treatment_data[['Plant', 'Disease']]
y = treatment_data['Disease_encoded']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessing pipeline
categorical_features = ['Plant', 'Disease']
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='unknown')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[('cat', categorical_transformer, categorical_features)]
)

pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

pipeline.fit(X_train, y_train)

@app.route('/predict', methods=['POST'])
def predict_treatment():
    try:
        input_data = request.get_json()
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400
            
        plant = input_data.get('plant', "").strip().lower()
        disease = input_data.get('disease', "").strip().lower()

        if not plant or not disease:
            return jsonify({"error": "Both plant and disease are required"}), 400

        # Check if the input data exists in the treatment data
        treatment_match = treatment_data[
            (treatment_data['Plant'] == plant) & 
            (treatment_data['Disease'] == disease)
        ]

        if treatment_match.empty:
            return jsonify({
                "error": "No treatment found for the given plant and disease combination"
            }), 404

        # Get the treatments
        treatment_1 = treatment_match['Treatment_1'].iloc[0]
        treatment_2 = treatment_match['Treatment_2'].iloc[0]

        return jsonify({
            "plant": plant,
            "disease": disease,
            "treatment_1": treatment_1,
            "treatment_2": treatment_2
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5004)