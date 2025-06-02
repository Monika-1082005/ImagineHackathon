from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import traceback
import numpy as np
import pandas as pd
from PIL import Image

# ML/Deep Learning
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True, methods=["GET", "POST", "OPTIONS"])

# ----------- CHATBOT SETUP ----------- #
with open("chat_responses.json", "r") as file:
    chat_responses = json.load(file)

@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return '', 200  # CORS preflight
    user_message = request.json.get("message", "").lower()
    response_data = handle_message(user_message)
    return jsonify(response_data)

def handle_message(message):
    for response in chat_responses:
        if any(keyword in message for keyword in response["keywords"]):
            return {"response": response["answer"]}
    return {
        "question": "No relevant question found.",
        "answer": "I'm sorry, I don't have information on that topic right now."
    }

# ---------------- IMAGE PREDICTION SETUP ---------------- #
try:
    model_path = os.path.join(os.path.dirname(__file__), "tf_model.h5")
    class_indices_path = os.path.join(os.path.dirname(__file__), "class_indices.json")
    model = tf.keras.models.load_model(model_path)
    with open(class_indices_path, 'r') as f:
        class_indices = json.load(f)
    print("Image model loaded successfully.")
except Exception as e:
    model = None
    class_indices = None
    print(f"Error loading image model: {e}")

@app.route('/predict-image', methods=['POST'])
def predict_image():
    if model is None or class_indices is None:
        return jsonify({'error': 'Model not loaded'}), 500
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    try:
        file = request.files['image']
        image = Image.open(file).resize((224, 224))
        image_array = np.expand_dims(np.array(image) / 255.0, axis=0)
        predictions = model.predict(image_array)
        predicted_index = np.argmax(predictions, axis=1)[0]
        predicted_class = class_indices[str(predicted_index)]
        return jsonify({'prediction': predicted_class})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
# ---------------- TREATMENT SETUP ---------------- #
try:
    treatment_data = pd.read_csv("Treatment.csv", encoding="latin1")
    print("Treatment data loaded successfully!")
except UnicodeDecodeError as e:
    print(f"Encoding error: {e}")
    print("Trying a different encoding...")
    treatment_data = pd.read_csv("Treatment.csv", encoding="utf-8", errors="replace")
    print("Treatment data loaded with fallback encoding.")

# Preprocess treatment dataset
treatment_data['Plant'] = treatment_data['Plant'].str.strip().str.lower()
treatment_data['Disease'] = treatment_data['Disease'].str.strip().str.lower()
treatment_data['Treatment_1'] = treatment_data['Treatment_1'].fillna('').str.strip()
treatment_data['Treatment_2'] = treatment_data['Treatment_2'].fillna('').str.strip()

label_encoder = LabelEncoder()
treatment_data['Disease_encoded'] = label_encoder.fit_transform(treatment_data['Disease'])

X_treat = treatment_data[['Plant', 'Disease']]
y_treat = treatment_data['Disease_encoded']

X_train_treat, X_test_treat, y_train_treat, y_test_treat = train_test_split(X_treat, y_treat, test_size=0.2, random_state=42)

categorical_features = ['Plant', 'Disease']
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='unknown')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor_treat = ColumnTransformer(
    transformers=[('cat', categorical_transformer, categorical_features)]
)

pipeline_treat = Pipeline(steps=[
    ('preprocessor', preprocessor_treat),
    ('classifier', RandomForestClassifier(random_state=42))
])

pipeline_treat.fit(X_train_treat, y_train_treat)
print("Treatment model trained.")

@app.route('/predict-treatment', methods=['POST'])
def predict_treatment():
    try:
        input_data = request.get_json()
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400

        plant = input_data.get('plant', "").strip().lower()
        disease = input_data.get('disease', "").strip().lower()

        if not plant or not disease:
            return jsonify({"error": "Both plant and disease are required"}), 400

        # Lookup treatment from data
        treatment_match = treatment_data[
            (treatment_data['Plant'] == plant) & 
            (treatment_data['Disease'] == disease)
        ]

        if treatment_match.empty:
            return jsonify({
                "error": "No treatment found for the given plant and disease combination"
            }), 404

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


# ---------------- YIELD ANALYSIS SETUP ---------------- #
@app.route('/analyze', methods=['GET'])
def analyze():
    try:
        df = pd.read_csv("crop_yield.csv")
        yearly_trends = df.groupby('Crop_Year').agg({'Yield': 'mean'}).reset_index()
        yearly_trends.columns = ['year', 'yield']
        crop_distribution = df.groupby('Crop').agg({'Area': 'sum'}).reset_index()
        crop_distribution.columns = ['crop', 'value']
        correlation_data = [
            {'factor': 'Area', 'correlation': df['Yield'].corr(df['Area'])},
            {'factor': 'Production', 'correlation': df['Yield'].corr(df['Production'])},
            {'factor': 'Annual_Rainfall', 'correlation': df['Yield'].corr(df['Annual_Rainfall'])},
            {'factor': 'Fertilizer', 'correlation': df['Yield'].corr(df['Fertilizer'])},
            {'factor': 'Pesticide', 'correlation': df['Yield'].corr(df['Pesticide'])},
        ]
        return jsonify({
            'yearly_trends': yearly_trends.to_dict(orient='records'),
            'crop_distribution': crop_distribution.to_dict(orient='records'),
            'correlation_data': correlation_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------------- CROP RECOMMENDATION SETUP ---------------- #
try:
    df_crop = pd.read_csv("Crop_recommendation.csv")
    X_crop = df_crop.drop(columns=["label"])
    y_crop = df_crop["label"]
    X_train_crop, _, y_train_crop, _ = train_test_split(X_crop, y_crop, test_size=0.2, random_state=42)
    crop_model = RandomForestClassifier(random_state=42)
    crop_model.fit(X_train_crop, y_train_crop)
    print("Crop recommendation model trained.")
except Exception as e:
    crop_model = None
    print(f"Crop recommendation model error: {e}")

@app.route('/predict-crop', methods=['POST'])
def predict_crop():
    if not request.is_json:
        return jsonify({"error": "Send JSON data."}), 400
    try:
        data = request.get_json()
        fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        if any(field not in data for field in fields):
            return jsonify({"error": "Missing required fields"}), 400
        features = np.array([[data[f] for f in fields]])
        prediction = crop_model.predict(features)[0]
        return jsonify({"recommended_crop": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- CROP ROTATION SETUP ---------------- #
try:
    crop_rotation_df = pd.read_csv("Plant_Locality_Nutrient_RotationCrop.csv")
    crop_rotation_df['Locality'] = crop_rotation_df['Locality'].str.strip().str.lower()
    crop_rotation_df['Plant'] = crop_rotation_df['Plant'].str.strip().str.lower()
    crop_rotation_df['RotationCrop'] = crop_rotation_df['RotationCrop'].astype(str).str.strip().str.lower()
    crop_rotation_df['Nutrient Requirement'] = crop_rotation_df['Nutrient Requirement'].str.strip().str.lower().map({'low': 1, 'medium': 2, 'high': 3})
    le_rotation = LabelEncoder()
    crop_rotation_df['RotationCrop_encoded'] = le_rotation.fit_transform(crop_rotation_df['RotationCrop'])

    X_rot = crop_rotation_df[['Locality', 'Plant', 'Nutrient Requirement']]
    y_rot = crop_rotation_df['RotationCrop_encoded']

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
        ])
    rot_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42))
    ])
    rot_pipeline.fit(X_rot, y_rot)
    print("Crop rotation model trained.")
except Exception as e:
    rot_pipeline = None
    print(f"Crop rotation model error: {e}")

@app.route('/rotate', methods=['POST'])
def crop_rotation():
    try:
        input_data = request.json
        location = input_data.get('location', "").strip().lower()
        plant = input_data.get('plant', "").strip().lower()
        match = crop_rotation_df[
            (crop_rotation_df['Locality'] == location) &
            (crop_rotation_df['Plant'] == plant)
        ]
        if not match.empty:
            nutrient = match['Nutrient Requirement'].iloc[0]
            input_df = pd.DataFrame([{
                'Locality': location,
                'Plant': plant,
                'Nutrient Requirement': nutrient
            }])
            prediction = rot_pipeline.predict(input_df)
            recommended = le_rotation.inverse_transform(prediction)[0]
            return jsonify({
                "location": location,
                "current_plant": plant,
                "recommended_rotation_crop": recommended
            })
        else:
            return jsonify({"message": "No matching data found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- RUN THE APP ---------------- #
if __name__ == '__main__':
    app.run(debug=True, port=5000)
