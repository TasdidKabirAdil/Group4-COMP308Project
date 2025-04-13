import pandas as pd
import numpy as np
from ucimlrepo import fetch_ucirepo
from sklearn.model_selection import train_test_split

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers #type: ignore

import os

from utils.preprocessing import preprocess_data_and_save 

MODEL_DIR = 'models'
MODEL_FILENAME = 'heart_disease_model.h5'
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILENAME)

print("Fetching dataset...")
heart_disease = fetch_ucirepo(id=45)
X = heart_disease.data.features
y = heart_disease.data.targets
y_binary = np.where(y['num'] > 0, 1, 0).ravel()
print("Dataset fetched.")

print("Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y_binary, test_size=0.2, random_state=42, stratify=y_binary)
print("Data split.")

print("Preprocessing data and saving preprocessor...")
X_train_processed, X_test_processed, y_train, y_test = preprocess_data_and_save(X_train, X_test, y_train, y_test)
print("Data preprocessed.")

if hasattr(X_train_processed, "toarray"): 
    X_train_processed = X_train_processed.toarray()
if hasattr(X_test_processed, "toarray"):
    X_test_processed = X_test_processed.toarray()

print("Defining MLP model...")
input_shape = [X_train_processed.shape[1]] 

model = keras.Sequential(
    [
        keras.Input(shape=input_shape),
        layers.Dense(64, activation="relu"),
        layers.Dense(32, activation="relu"),
        layers.Dense(1, activation="sigmoid"),
    ]
)
model.summary() 

print("Compiling model...")
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

print("Training MLP model...")
early_stopping = keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

history = model.fit(
    X_train_processed,
    y_train,
    validation_split=0.2, 
    epochs=100,
    batch_size=16, 
    callbacks=[early_stopping],
    verbose=1 
)
print("Model trained.")

print("Evaluating model...")
loss, accuracy = model.evaluate(X_test_processed, y_test, verbose=0)
print(f"Model Accuracy on Test Set: {accuracy:.4f}")
print(f"Model Loss on Test Set: {loss:.4f}")


print("Saving model...")
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)
model.save(MODEL_PATH) 
print(f"Model saved to {MODEL_PATH}")

print("Training script finished.")