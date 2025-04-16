# --- Inside train_model.py ---

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers #type: ignore
import os
import json # Import json to save/load the list

from utils.preprocessing import ALL_SYMPTOMS

MODEL_DIR = 'models'
MODEL_FILENAME = 'symptom_disease_model.h5'
DISEASE_LIST_FILENAME = 'all_diseases.json' # File to save disease list
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILENAME)
DISEASE_LIST_PATH = os.path.join(MODEL_DIR, DISEASE_LIST_FILENAME)
DATASET_PATH = 'dataset.csv' 

print("Loading dataset...")
try:
    df = pd.read_csv(DATASET_PATH)
except FileNotFoundError:
    print(f"Error: Dataset file not found at {DATASET_PATH}")
    exit()
except Exception as e:
    print(f"Error loading dataset: {e}")
    exit()

df.columns = df.columns.str.strip().str.strip('"')
print("Dataset loaded.")

target_column_name = 'diseases'
if target_column_name not in df.columns:
     print(f"Error: Target column '{target_column_name}' not found in dataset.")
     exit()

# --- Generate ALL_DISEASES list dynamically ---
ALL_DISEASES = sorted(list(df[target_column_name].unique()))
num_classes = len(ALL_DISEASES)
print(f"Found {num_classes} unique diseases.")

# --- Save the generated list ---
print(f"Saving disease list to {DISEASE_LIST_PATH}...")
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)
try:
    with open(DISEASE_LIST_PATH, 'w') as f:
        json.dump(ALL_DISEASES, f)
    print("Disease list saved.")
except Exception as e:
    print(f"Error saving disease list: {e}")
    exit()
# --- End of list generation and saving ---

print("Preparing data...")
# (Rest of the data preparation and validation logic as before...)
# Ensure ALL_SYMPTOMS list in utils/preprocessing.py is correct (132 symptoms)
missing_symptoms = [s for s in ALL_SYMPTOMS if s not in df.columns]
if missing_symptoms:
    print(f"Error: Missing expected symptom columns in dataset: {missing_symptoms}")
    exit()
    
X = df[ALL_SYMPTOMS].values

# Use the dynamically generated list for encoding
try:
    le = LabelEncoder()
    le.fit(ALL_DISEASES) 
    y_encoded = le.transform(df[target_column_name])
    y_one_hot = tf.keras.utils.to_categorical(y_encoded, num_classes=num_classes) # Use num_classes
except ValueError as e:
     print(f"Error encoding diseases: {e}. Ensure all values in '{target_column_name}' column are strings.")
     exit()

print("Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y_one_hot, test_size=0.2, random_state=42) 
print("Data split.")

print("Defining MLP model...")
input_shape = [X_train.shape[1]] # Should be 132

# Adjust model complexity if needed for 773 classes - maybe add a layer or more neurons
model = keras.Sequential(
    [
        keras.Input(shape=input_shape),
        layers.Dense(256, activation="relu"), # Increased neurons maybe?
        layers.Dropout(0.4),
        layers.Dense(128, activation="relu"), 
        layers.Dropout(0.4),
        # layers.Dense(64, activation="relu"), # Optional extra layer
        # layers.Dropout(0.3),                 # Optional extra dropout
        layers.Dense(num_classes, activation="sigmoid"), # Output matches number of diseases
    ]
)
model.summary() 

print("Compiling model...")
model.compile(
    optimizer='adam',
    loss='binary_crossentropy', 
    metrics=['accuracy', tf.keras.metrics.AUC(multi_label=True, name='auc')] 
)

print("Training MLP model...")
# Consider increasing epochs or adjusting batch_size/patience for a larger task
early_stopping = keras.callbacks.EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True) 

history = model.fit(
    X_train,
    y_train,
    validation_split=0.2, 
    epochs=150, # Maybe more epochs needed?
    batch_size=32, 
    callbacks=[early_stopping],
    verbose=1 
)
print("Model trained.")

print("Evaluating model...")
loss, accuracy, auc = model.evaluate(X_test, y_test, verbose=0)
print(f"Model Accuracy on Test Set: {accuracy:.4f}") # Note: Accuracy might be low if only one class is correct per sample
print(f"Model AUC on Test Set: {auc:.4f}") # AUC is often a better metric here
print(f"Model Loss on Test Set: {loss:.4f}")

print("Saving model...")
model.save(MODEL_PATH) 
print(f"Model saved to {MODEL_PATH}")

print("Training script finished.")