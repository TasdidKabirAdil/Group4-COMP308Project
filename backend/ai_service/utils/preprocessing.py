import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import os

PREPROCESSOR_DIR = 'models'
PREPROCESSOR_FILENAME = 'preprocessor.joblib'
PREPROCESSOR_PATH = os.path.join(PREPROCESSOR_DIR, PREPROCESSOR_FILENAME)

def build_preprocessor(X):
    categorical_features = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'thal']
    numerical_features = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak', 'ca']

    numerical_pipeline = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')), 
        ('scaler', StandardScaler())
    ])

    categorical_pipeline = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_pipeline, numerical_features),
            ('cat', categorical_pipeline, categorical_features)
        ],
        remainder='passthrough'
    )
    return preprocessor

def preprocess_data_and_save(X_train, X_test, y_train, y_test):
    preprocessor = build_preprocessor(X_train)

    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    if not os.path.exists(PREPROCESSOR_DIR):
        os.makedirs(PREPROCESSOR_DIR)
    joblib.dump(preprocessor, PREPROCESSOR_PATH)
    print(f"Preprocessor saved to {PREPROCESSOR_PATH}")

    return X_train_processed, X_test_processed, y_train, y_test

def preprocess_input(input_data_df):
    if not os.path.exists(PREPROCESSOR_PATH):
         raise FileNotFoundError(f"Preprocessor not found at {PREPROCESSOR_PATH}. Run training first.")
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    processed_data = preprocessor.transform(input_data_df)
    return processed_data