import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Alert } from 'react-bootstrap';

const CREATE_EMERGENCY_ALERT = gql`
    mutation CreateEmergencyAlert($patientId: ID!) {
         createEmergencyAlert(patientId: $patientId) {
             id
             timestamp
         }
    }
`;

function EmergencyAlert({ patientId }) {
    const [createAlert, { loading, error, data }] = useMutation(CREATE_EMERGENCY_ALERT);

    const handleAlertClick = async () => {
        if (window.confirm("Are you sure you want to send an emergency alert?")) {
            try {
                await createAlert({ variables: { patientId } });
            } catch (err) {
                 console.error("Alert creation error:", err);
            }
        }
    };

    return (
        <div className="text-center mt-4">
            <Button variant="danger" size="lg" onClick={handleAlertClick} disabled={loading}>
                {loading ? 'Sending...' : 'Send Emergency Alert'}
            </Button>
             {error && <Alert variant="warning" className="mt-3">Error sending alert: {error.message}</Alert>}
             {data && <Alert variant="success" className="mt-3">Emergency alert sent successfully!</Alert>}
        </div>
    );
}

export default EmergencyAlert;