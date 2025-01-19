from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import traceback

# Initialize Flask app
app = Flask(__name__)
from flask_cors import CORS

# Add this after initializing the Flask app
CORS(app)


# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})

# Load dataset
try:
    df = pd.read_csv("Crop_recommendation.csv")
except FileNotFoundError:
    raise Exception("Error: 'Crop_recommendation.csv' file not found. Please make sure it's in the correct directory.")

# Function to train the RandomForest model
def train_model():
    try:
        # Extract features and target
        X = df.drop(columns=["label"])
        y = df["label"]

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train model
        model = RandomForestClassifier(random_state=42)
        model.fit(X_train, y_train)
        return model
    except Exception as e:
        print(f"Error during model training: {e}")
        traceback.print_exc()
        raise

# Train the model once when the app starts
try:
    model = train_model()
    print("Model trained successfully.")
except Exception as e:
    raise Exception("Model training failed. Please check your dataset or code.") from e

# API route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse input JSON data
        if not request.is_json:
            return jsonify({"error": "Invalid input format. Please send JSON data."}), 400
        
        data = request.get_json()
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
        # Validate input fields
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Convert input data to feature array
        features = np.array([
            data['N'],
            data['P'],
            data['K'],
            data['temperature'],
            data['humidity'],
            data['ph'],
            data['rainfall']
        ]).reshape(1, -1)

        # Make prediction
        prediction = model.predict(features)[0]
        return jsonify({"recommended_crop": prediction})
    except Exception as e:
        # Log and return error
        print(f"Error during prediction: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5002)
