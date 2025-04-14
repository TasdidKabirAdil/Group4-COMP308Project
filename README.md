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
> ✅ Scheduled for presentation and demo in **Week 14**

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
- Use a deep learning microservice to analyze symptom checklists and suggest medical action

### 🧍 Patient Features

- Register and log in
- Enter daily vitals and health data
- Submit emergency alerts to healthcare providers
- Complete symptom checklists (e.g., COVID, RSV)
- View motivational tips sent by nurses

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
    cd backend
    npm install

    ```
    Frontend
    ```
    cd frontend/shell-app && npm install
    cd frontend/auth-app && npm install
    cd frontend/patient-app && npm install
    cd frontend/nurse-app && npm install
    ```
3. Start services:
    ```
    cd backend && npm run dev
    cd frontend/shell-app && npm run dev
    ```