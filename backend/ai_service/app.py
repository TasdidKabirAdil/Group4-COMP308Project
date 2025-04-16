# --- Inside app.py ---

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import os
import tensorflow as tf
from tensorflow import keras 
import json # Import json

from utils.preprocessing import preprocess_symptoms

app = Flask(__name__)

MODEL_DIR = 'models'
MODEL_FILENAME = 'symptom_disease_model.h5' 
DISEASE_LIST_FILENAME = 'all_diseases.json' # File where disease list is saved
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILENAME)
DISEASE_LIST_PATH = os.path.join(MODEL_DIR, DISEASE_LIST_FILENAME)

# --- Load ALL_DISEASES list dynamically ---
ALL_DISEASES = []
try:
    if os.path.exists(DISEASE_LIST_PATH):
        with open(DISEASE_LIST_PATH, 'r') as f:
            ALL_DISEASES = json.load(f)
        print(f"Loaded {len(ALL_DISEASES)} diseases from {DISEASE_LIST_PATH}.")
    else:
        print(f"WARNING: Disease list file not found at {DISEASE_LIST_PATH}. Predictions may be inaccurate.")
except Exception as e:
    print(f"Error loading disease list: {e}")
# --- End of list loading ---

model = None
try:
    if os.path.exists(MODEL_PATH):
        model = keras.models.load_model(MODEL_PATH) 
        # Basic check: does model output match loaded disease list?
        if model.output_shape[-1] != len(ALL_DISEASES) and len(ALL_DISEASES) > 0 :
             print(f"WARNING: Model output features ({model.output_shape[-1]}) do not match loaded disease list size ({len(ALL_DISEASES)}).")
             print("Ensure the model was trained with the correct disease list.")
             model = None # Prevent running inconsistent model
        elif len(ALL_DISEASES) > 0:
             print("Keras model loaded successfully.")
        else:
             print("Keras model loaded, but disease list is empty or failed to load.")
             model = None # Cannot decode predictions without the list
    else:
         print(f"WARNING: Model file not found at {MODEL_PATH}. Run training script first.")
except Exception as e:
    print(f"Error loading Keras model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    global model
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    
    if model is None or not ALL_DISEASES: # Check model and list loaded
         error_msg = "Model not loaded." if model is None else "Disease list not loaded."
         return jsonify({"error": f"{error_msg} Cannot make predictions."}), 500

    try:
        symptoms_list = data.get('symptoms', []) 
        if not isinstance(symptoms_list, list):
            return jsonify({"error": "Input 'symptoms' must be a list"}), 400
            
        if not symptoms_list:
             return jsonify({"error": "Input 'symptoms' list cannot be empty"}), 400

        processed_input = preprocess_symptoms(symptoms_list)

        probabilities = model.predict(processed_input)
        
        prediction_threshold = 0.1 # You might need to lower the threshold with many classes
        
        disease_probabilities = probabilities[0] 

        # Check consistency again in case model loaded before list was generated
        if len(disease_probabilities) != len(ALL_DISEASES):
             app.logger.error(f"Mismatch between model output size ({len(disease_probabilities)}) and disease list size ({len(ALL_DISEASES)}).")
             return jsonify({"error": "Model and disease list mismatch."}), 500

        predicted_diseases = []
        disease_scores = {}
        for i, disease_name in enumerate(ALL_DISEASES): # Use loaded list
            prob = float(disease_probabilities[i])
            disease_scores[disease_name] = round(prob, 4) 
            if prob >= prediction_threshold:
                predicted_diseases.append(disease_name)
        
        # Sort predictions by score (optional but helpful)
        predicted_diseases.sort(key=lambda d: disease_scores[d], reverse=True)

        recommend_consultation = len(predicted_diseases) > 0

        response = {
            'predicted_conditions': predicted_diseases,
            'recommend_consultation': recommend_consultation
        }
        return jsonify(response)

    except Exception as e:
        app.logger.error(f"Prediction error: {e}")
        # import traceback
        # app.logger.error(traceback.format_exc())
        return jsonify({"error": "An error occurred during prediction."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)