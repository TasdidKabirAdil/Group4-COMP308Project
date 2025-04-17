import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Form, Button, Alert } from 'react-bootstrap';

const SUBMIT_SYMPTOMS = gql`
  mutation SubmitSymptomChecklist($input: SymptomChecklistInput!) {
    submitSymptomChecklist(input: $input) {
      id
      symptoms
      submissionDate
      prediction {
        predictedConditions
        recommendConsultation
      }
    }
  }
`;

const commonSymptoms = [
  'fever', 'cough', 'shortness of breath', 'fatigue',
  'muscle aches', 'headache', 'loss of taste', 'sore throat',
  'runny nose', 'nausea', 'diarrhea'
];

const labelMap = {
  'fever': 'Fever or chills',
  'cough': 'Cough',
  'shortness of breath': 'Shortness of breath or difficulty breathing',
  'fatigue': 'Fatigue',
  'muscle aches': 'Muscle or body aches',
  'headache': 'Headache',
  'loss of taste': 'New loss of taste or smell',
  'sore throat': 'Sore throat',
  'runny nose': 'Congestion or runny nose',
  'nausea': 'Nausea or vomiting',
  'diarrhea': 'Diarrhea'
};

function SymptomChecklist({ patientId }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [submitSymptoms, { loading, error, data }] = useMutation(SUBMIT_SYMPTOMS, {
    refetchQueries: ['GetSymptomChecklists']
  });
  const [predictionResult, setPredictionResult] = useState(null);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSymptoms(prev => [...prev, value]);
    } else {
      setSelectedSymptoms(prev => prev.filter(symptom => symptom !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const normalizedSymptoms = selectedSymptoms.map(symptom => symptom.toLowerCase());
      const res = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: normalizedSymptoms })
      });

      const prediction = await res.json();
      setPredictionResult(prediction);

      await submitSymptoms({
        variables: {
          input: {
            patientId,
            symptoms: selectedSymptoms,
            prediction: {
              predictedConditions: prediction.predicted_conditions,
              recommendConsultation: prediction.recommend_consultation
            }
          }
        }
      });

    } catch (err) {
      console.error("Symptom submission error:", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <p>Please select any symptoms you are experiencing today:</p>
      {commonSymptoms.map((symptom, index) => (
        <Form.Check
          key={index}
          type="checkbox"
          id={`symptom-${index}`}
          label={labelMap[symptom] || symptom}
          value={symptom}
          onChange={handleCheckboxChange}
          checked={selectedSymptoms.includes(symptom)}
          className="mb-2"
        />
      ))}

      <Button variant="primary" type="submit" disabled={loading} className="mt-3">
        {loading ? 'Submitting...' : 'Submit Symptoms'}
      </Button>
      {error && <Alert variant="danger" className="mt-3">Error: {error.message}</Alert>}
      {data && <Alert variant="success" className="mt-3">Symptoms submitted successfully!</Alert>}
      {predictionResult && (
        <Alert variant="info" className="mt-4">
          <h5>Predicted Conditions:</h5>
          <ul>
            {predictionResult.predicted_conditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
          {predictionResult.recommend_consultation && (
            <strong>⚠️ A medical consultation is recommended.</strong>
          )}
        </Alert>
      )}
    </Form>
  );
}

export default SymptomChecklist;
