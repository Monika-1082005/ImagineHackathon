# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import traceback
# from analysis import load_data, analyze_data

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# import os

# DATA_FILE = os.path.join(os.path.dirname(__file__), "crop_yield.csv")

# if not os.path.exists(DATA_FILE):
#     print(f"File not found: {DATA_FILE}")
# else:
#     print(f"File found: {DATA_FILE}")

# try:
#     df = load_data(DATA_FILE)
#     print("Dataset loaded successfully.")
# except Exception as e:
#     print(f"Error loading dataset: {e}")
#     traceback.print_exc()
#     df = None

# @app.route('/analyze', methods=['GET'])
# def analyze():
#     try:
#         if df is None:
#             return jsonify({"error": "Dataset not available"}), 500

#         analysis_result = analyze_data(df)
#         return jsonify(analysis_result)
#     except Exception as e:
#         print(f"Error during analysis: {e}")
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/analyze')
def analyze():
    # Load dataset
    df = pd.read_csv('crop_yield.csv')
    
    # Yearly trends
    yearly_trends = df.groupby('Crop_Year').agg({'Yield': 'mean'}).reset_index()
    yearly_trends.columns = ['year', 'yield']
    
    # Crop distribution (e.g., by Area)
    crop_distribution = df.groupby('Crop').agg({'Area': 'sum'}).reset_index()
    crop_distribution.columns = ['crop', 'value']
    
    # Correlation data (e.g., Yield vs. factors)
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

if __name__ == '__main__':
    app.run(debug=True,port=5001)

