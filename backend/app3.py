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
CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})

# Load the dataset
crop_data = pd.read_csv("Plant_Locality_Nutrient_RotationCrop.csv")

# Preprocess the dataset
crop_data['Locality'] = crop_data['Locality'].str.strip().str.lower()
crop_data['Plant'] = crop_data['Plant'].str.strip().str.lower()
crop_data['RotationCrop'] = crop_data['RotationCrop'].str.strip().str.lower()
nutrient_mapping = {'low': 1, 'medium': 2, 'high': 3}
crop_data['Nutrient Requirement'] = crop_data['Nutrient Requirement'].str.strip().str.lower().map(nutrient_mapping)
crop_data['RotationCrop'] = crop_data['RotationCrop'].astype(str)
label_encoder = LabelEncoder()
crop_data['RotationCrop_encoded'] = label_encoder.fit_transform(crop_data['RotationCrop'])

# Features and target
X = crop_data[['Locality', 'Plant', 'Nutrient Requirement']]
y = crop_data['RotationCrop_encoded']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessing pipeline
categorical_features = ['Locality', 'Plant']
numeric_features = ['Nutrient Requirement']

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean'))
])
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', categorical_transformer, categorical_features),
        ('num', numeric_transformer, numeric_features)
    ]
)
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])
pipeline.fit(X_train, y_train)

@app.route('/rotate', methods=['POST'])
def crop_rotation():
    input_data = request.json
    location = input_data.get('location', "").strip().lower()
    plant = input_data.get('plant', "").strip().lower()
    primary_crop_match = crop_data[
        (crop_data['Locality'] == location) & (crop_data['Plant'] == plant)
    ]
    if not primary_crop_match.empty:
        inferred_nutrient = primary_crop_match['Nutrient Requirement'].iloc[0]
        input_df = pd.DataFrame([{
            'Locality': location,
            'Plant': plant,
            'Nutrient Requirement': inferred_nutrient
        }])
        prediction = pipeline.predict(input_df)
        recommended_crop = label_encoder.inverse_transform(prediction)[0]
        return jsonify({
            "location": location,
            "current_plant": plant,
            "recommended_rotation_crop": recommended_crop
        })
    else:
        return jsonify({"message": "No matching data found for the given input."}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5003)
