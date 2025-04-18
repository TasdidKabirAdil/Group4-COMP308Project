# 🩺 Group4-COMP308Project

## 🧠 Overview

A modern full-stack web application built to support **nurse practitioners** and **patients** during post-hospital care. This app enables health monitoring, emergency alerts, and symptom tracking — all while leveraging modern web frameworks, GraphQL APIs, and microservice architecture.

---

## 🎯 Project Purpose

This application was developed to:

- Design and code responsive web apps using emerging frameworks
- Build a **GraphQL API** using **Express**
- Build a **microfrontend-based** UI using **React**
- Apply design patterns and modular architecture principles
- Use deep learning to intelligently analyze patient symptoms

> ✅ Developed in a team of 4–5 students as part of our COMP308 course  

---

## 🏥 Key Features

### 👩‍⚕️ Nurse Features

- Register and log in securely
- Enter patient vital signs:
  - Temperature (°C)
  - Heart Rate (bpm)
  - Blood Pressure (mmHg)
  - Respiratory Rate (breaths/min)
  - Weight (kg)
- View history of clinical visits
- Send daily motivational tips to patients

### 🧍 Patient Features

- Register and log in
- Enter daily vitals and health data
- Submit emergency alerts to healthcare providers
- Complete symptom checklists (e.g., COVID, RSV)
- View motivational tips sent by nurses

### 🧱 AI-Powered Disease Prediction

Our application features a custom-trained deep learning model that intelligently analyzes symptom checklists submitted by patients and predicts possible diseases.

- 🌎 Dataset: Extracted from open medical sources and cleaned
- 🤖 Model: Multi-layer Perceptron (MLP) built using TensorFlow/Keras
- 🔧 Architecture:
- 256 ➞ 128 ➞ N-output (number of diseases)
- Trained using binary crossentropy + AUC evaluation
- 🔬 Input: Symptom vectors generated from 400+ possible symptom indicators
- 🔍 Output: Sorted list of potential diseases + consultation advice
- 🚀 Deployed via Flask microservice, consumed by the patient microfrontend

✨ This feature helps enhance clinical judgment and empowers patients with awareness of their possible conditions.

---

## 🧱 Tech Stack

| Layer         | Stack                                      |
|--------------|---------------------------------------------|
| Frontend     | React 18.2+, React Bootstrap, Vite          |
| Backend      | Express.js, Apollo Server, GraphQL          |
| Microservices| Node.js, Flask (optional for AI)            |
| Database     | MongoDB (Mongoose ODM)                      |
| Architecture | Micro Frontends + Microservices             |
| Styling      | React Bootstrap, Responsive Web Design      |

---

## 🛠️ Running Locally

1. Clone this repo

    ```
    git clone https://github.com/your-group-name/Group4-COMP308Project.git
    cd Group4-COMP308Project
    ```
    
2. Install dependencies:

    Backend
    ```
    cd backend/ai_services && pip install -r requirements.txt
    cd backend && npm install

    ```
    Frontend
    ```
    cd frontend && npm install
    cd frontend/shell-app && npm install
    cd frontend/auth-app && npm install
    cd frontend/patient-app && npm install
    cd frontend/nurse-app && npm install
    ```
3. Start services:
    ```
    npm run dev
    ```