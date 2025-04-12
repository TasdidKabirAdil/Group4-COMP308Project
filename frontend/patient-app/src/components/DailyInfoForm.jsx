import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Form, Button, Row, Col } from 'react-bootstrap';

const CREATE_DAILY_INFO = gql`
    mutation CreateDailyInfo($input: DailyInfoInput!) {
        createDailyInfo(input: $input) {
            id
            pulseRate
            bloodPressureSystolic
            bloodPressureDiastolic
            weight
            temperature
            respiratoryRate
            entryDate
        }
    }
`;

function DailyInfoForm({ patientId }) {
    const [formData, setFormData] = useState({
        pulseRate: '',
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        weight: '',
        temperature: '',
        respiratoryRate: ''
    });
    const [createDailyInfo, { loading, error }] = useMutation(CREATE_DAILY_INFO);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const numericData = {};
        for (const key in formData) {
             if (formData[key] !== '') {
                 numericData[key] = parseFloat(formData[key]);
             }
        }

        try {
            await createDailyInfo({ variables: { input: { patientId, ...numericData } } });
            alert('Daily info submitted successfully!');
            setFormData({
               pulseRate: '', bloodPressureSystolic: '', bloodPressureDiastolic: '',
               weight: '', temperature: '', respiratoryRate: ''
           });
        } catch (err) {
            console.error("Submission error:", err);
            alert(`Submission failed: ${err.message}`);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formPulseRate">
                    <Form.Label>Pulse Rate (bpm)</Form.Label>
                    <Form.Control type="number" name="pulseRate" value={formData.pulseRate} onChange={handleChange} />
                </Form.Group>
                 <Form.Group as={Col} controlId="formTemperature">
                    <Form.Label>Temperature (°C)</Form.Label>
                    <Form.Control type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} />
                </Form.Group>
            </Row>
             <Row className="mb-3">
                 <Form.Group as={Col} controlId="formBloodPressureSystolic">
                    <Form.Label>Blood Pressure (Systolic)</Form.Label>
                    <Form.Control type="number" name="bloodPressureSystolic" value={formData.bloodPressureSystolic} onChange={handleChange} />
                </Form.Group>
                  <Form.Group as={Col} controlId="formBloodPressureDiastolic">
                    <Form.Label>Blood Pressure (Diastolic)</Form.Label>
                    <Form.Control type="number" name="bloodPressureDiastolic" value={formData.bloodPressureDiastolic} onChange={handleChange} />
                </Form.Group>
            </Row>
             <Row className="mb-3">
                 <Form.Group as={Col} controlId="formWeight">
                    <Form.Label>Weight (kg)</Form.Label>
                    <Form.Control type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} />
                </Form.Group>
                  <Form.Group as={Col} controlId="formRespiratoryRate">
                    <Form.Label>Respiratory Rate (breaths/min)</Form.Label>
                    <Form.Control type="number" name="respiratoryRate" value={formData.respiratoryRate} onChange={handleChange} />
                </Form.Group>
             </Row>
            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Daily Info'}
            </Button>
            {error && <p className="text-danger mt-2">Error: {error.message}</p>}
        </Form>
    );
}

export default DailyInfoForm;