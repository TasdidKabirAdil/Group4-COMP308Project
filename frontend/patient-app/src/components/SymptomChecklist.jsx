import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Form, Button, Alert } from 'react-bootstrap';

const SUBMIT_SYMPTOMS = gql`
    mutation SubmitSymptomChecklist($input: SymptomChecklistInput!) {
        submitSymptomChecklist(input: $input) {
            id
            symptoms
            submissionDate
        }
    }
`;

const commonSymptoms = [
    'Fever or chills', 'Cough', 'Shortness of breath or difficulty breathing',
    'Fatigue', 'Muscle or body aches', 'Headache', 'New loss of taste or smell',
    'Sore throat', 'Congestion or runny nose', 'Nausea or vomiting', 'Diarrhea'
];

function SymptomChecklist({ patientId }) {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [submitSymptoms, { loading, error, data }] = useMutation(SUBMIT_SYMPTOMS);

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
            await submitSymptoms({ variables: { input: { patientId, symptoms: selectedSymptoms } } });
             setSelectedSymptoms([]);
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
                    label={symptom}
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
        </Form>
    );
}

export default SymptomChecklist;