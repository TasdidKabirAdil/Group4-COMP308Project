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
            <Card className="mx-auto mb-4 shadow" style={{ maxWidth: "600px", background: "#e7f4ff" }}>
                <Card.Body className="text-center">
                    <Card.Title className="text-info fs-4 mb-2">
                        💡 Daily Tip
                    </Card.Title>
                    <Card.Text className="text-muted fs-6">
                        {data?.getTodayTip ? (
                            <em>{data.getTodayTip.message}</em>
                        ) : (
                            <em>No daily tip for today</em>
                        )}
                    </Card.Text>
                </Card.Body>
            </Card>

            <Row>
                <Col md={6} className="mb-4">
                    <Card className='shadow' style={{backgroundColor: 'rgba(0, 76, 255, 0)', border: 'none', color: 'white'}}>
                        <Card.Body>
                            <Card.Title>Daily Information Entry</Card.Title>
                            <DailyInfoForm patientId={patientId} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-4">
                    <Card className='shadow' style={{backgroundColor: 'rgba(0, 76, 255, 0)', border: 'none', color: 'white'}}>
                        <Card.Body>
                            <Card.Title>Symptom Checklist</Card.Title>
                            <SymptomChecklist patientId={patientId} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={20} className="mb-4">
                    <Card className='shadow' style={{backgroundColor: 'rgba(0, 76, 255, 0)', border: 'none', color: 'white'}}>
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