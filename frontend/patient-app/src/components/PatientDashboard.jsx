import React from 'react';
import DailyInfoForm from './DailyInfoForm';
import SymptomChecklist from './SymptomChecklist';
import EmergencyAlert from './EmergencyAlert';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import PredictionHistory from '../components/PredictionHistory';

const GET_DAILY_TIP = gql`
    query GetTodayTip {
        getTodayTip {
            message
        }
    }
`

function PatientDashboard() {
    const patientId = localStorage.getItem('id');
    const { data } = useQuery(GET_DAILY_TIP)

    if (!patientId) {
        return <p>Please log in.</p>;
    }

    return (
        <Container className="mt-4">
            <h1 className="mb-4 text-center">Patient Dashboard</h1>
            <h2>Daily Tip</h2>
            {data?.getTodayTip ? (
                <h3>{data.getTodayTip.message}</h3>
            ) : (
                <p>No daily tip for today</p>
            )}
            <Row>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Daily Information Entry</Card.Title>
                            <DailyInfoForm patientId={patientId} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-4">
                     <Card>
                        <Card.Body>
                            <Card.Title>Symptom Checklist</Card.Title>
                            <SymptomChecklist patientId={patientId} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={20} className="mb-4">
                     <Card>
                        <Card.Body>
                            <Card.Title>Predictions</Card.Title>
                            <PredictionHistory patientId={patientId} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
             <Row className="justify-content-center">
                 <Col md={6}>
                    <EmergencyAlert patientId={patientId} />
                 </Col>
             </Row>
        </Container>
    );
}

export default PatientDashboard;