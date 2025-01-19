from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import os

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})  # Replace with the port your React app uses

# Load model and class indices
working_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(working_dir, "tf_model.h5")
class_indices_path = os.path.join(working_dir, "class_indices.json")

try:
    model = tf.keras.models.load_model(model_path)
    with open(class_indices_path, 'r') as f:
        class_indices = json.load(f)
    app.logger.info("Model and class indices loaded successfully")
except Exception as e:
    app.logger.error(f"Error loading model or class indices: {str(e)}")
    model = None
    class_indices = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or class_indices is None:
        return jsonify({'error': 'Model or class indices not loaded'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image file found'}), 400

    try:
        # Process the uploaded image
        file = request.files['image']
        image = Image.open(file)
        image = image.resize((224, 224))  # Match the input size of your model
        image_array = np.array(image) / 255.0  # Normalize pixel values
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        # Make predictions
        predictions = model.predict(image_array)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        predicted_class_name = class_indices[str(predicted_class_index)]

        return jsonify({'prediction': predicted_class_name})

    except Exception as e:
        app.logger.error(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
