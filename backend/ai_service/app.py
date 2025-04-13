from flask import Flask, request, jsonify

import joblib 
import pandas as pd
import numpy as np
import os

from tensorflow import keras 

from utils.preprocessing import preprocess_input 

app = Flask(__name__)

MODEL_DIR = 'models'
MODEL_FILENAME = 'heart_disease_model.h5' 
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILENAME)

if not os.path.exists(MODEL_PATH):
    print(f"WARNING: Model file not found at {MODEL_PATH}. Run training script first.")
    model = None
else:
    model = keras.models.load_model(MODEL_PATH) 
    print("Keras model loaded successfully.")

@app.route('/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    try:
        input_df = pd.DataFrame([data])
    except Exception as e:
         app.logger.error(f"Error converting JSON to DataFrame: {e}")
         return jsonify({"error": "Invalid input data format."}), 400

    if model is None:
         return jsonify({"error": "Model not loaded. Cannot make predictions."}), 500

    try:
        processed_input = preprocess_input(input_df)
        
        if hasattr(processed_input, "toarray"):
            processed_input = processed_input.toarray()

        probability = model.predict(processed_input)

        confidence_score = float(probability[0][0]) 
        
        prediction = 1 if confidence_score >= 0.5 else 0

        has_heart_disease = bool(prediction == 1)
        recommend_consultation = has_heart_disease

        response = {
            'prediction_label': 'Heart Disease Likely' if has_heart_disease else 'Heart Disease Unlikely',
            'has_heart_disease_prediction': has_heart_disease,
            'confidence_score': confidence_score,
            'recommend_consultation': recommend_consultation
        }
        return jsonify(response)

    except FileNotFoundError as e:
        app.logger.error(f"Prediction error: {e}")
        return jsonify({"error": "Preprocessor not found. Ensure training was run."}), 500
    except Exception as e:
        app.logger.error(f"Prediction error: {e}")
        app.logger.error(f"Prediction Traceback: {e}") 
        return jsonify({"error": "An error occurred during prediction."}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)