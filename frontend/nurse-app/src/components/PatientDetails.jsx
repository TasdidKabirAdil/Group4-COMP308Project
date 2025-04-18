import { useParams } from "react-router-dom"
import { gql, useQuery } from "@apollo/client"
import { useNavigate } from 'react-router-dom'
import { Container, Button, Card, Row, Col } from 'react-bootstrap';

const GET_VITALSIGNS = gql`
    query UserVitalSigns($userId: ID!) {
        userVitalSigns(userId: $userId) {
            id
            userId
            enteredBy
            temperature
            heartRate
            bloodPressure
            respiratoryRate
            weight
            createdAt
        }
    }
`

const GET_USER = gql`
    query User($userId: ID!) {
        user(id: $userId) {
            id
            username
        }
    }
`

function PatientDetails() {
    const { id: patientId } = useParams()
    const navigate = useNavigate()
    const { data: patientData, loading, error } = useQuery(GET_VITALSIGNS, { variables: { userId: patientId } })
    const { data: userData } = useQuery(GET_USER, { variables: { userId: patientId } })

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Patient Details</h2>
                <Button variant="secondary" onClick={() => navigate('/nurse')}>
                    ⬅ Go Back
                </Button>
            </div>

            <h4 className="mb-4 text-center">📋 Previous Clinical Visits</h4>

            {patientData.userVitalSigns.length > 0 ? (
                <Row xs={1} md={2} lg={2} className="g-4">
                    {patientData.userVitalSigns.map((vitalSign) => (
                        <Col key={vitalSign.id}>
                            <Card className="h-100 shadow-sm border-0" style={{ transition: '0.3s', backgroundColor: 'rgba(0, 76, 255, 0)', color: 'white' }}>
                                <Card.Header className="fw-bold">
                                    Visit Date: {new Date(parseInt(vitalSign.createdAt)).toLocaleDateString()}
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title className="mb-3">{userData?.user.username}</Card.Title>
                                    <ul className="list-unstyled">
                                        <li><strong>🌡 Temperature:</strong> {vitalSign.temperature} °C</li>
                                        <li><strong>💓 Heart Rate:</strong> {vitalSign.heartRate} bpm</li>
                                        <li><strong>🩸 Blood Pressure:</strong> {vitalSign.bloodPressure} mmHg</li>
                                        <li><strong>🌬 Respiratory Rate:</strong> {vitalSign.respiratoryRate} breaths/min</li>
                                        <li><strong>⚖️ Weight:</strong> {vitalSign.weight} kg</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p className="text-muted text-center mt-5">No clinical visit data found</p>
            )}
        </Container>
    );
}

export default PatientDetails