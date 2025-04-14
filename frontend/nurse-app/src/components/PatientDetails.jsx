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
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Patient Details</h2>
                <Button variant="secondary" onClick={() => navigate('/nurse')}>
                    Go Back
                </Button>
            </div>

            <h4 className="mb-4">Previous Clinical Visits</h4>

            {patientData.userVitalSigns.length > 0 ? (
                <Row xs={1} md={2} lg={2} className="g-4">
                    {patientData.userVitalSigns.map((vitalSign) => (
                        <Col key={vitalSign.id}>
                            <Card>
                                <Card.Header>
                                    <strong>Visit Date:</strong>{' '}
                                    {new Date(parseInt(vitalSign.createdAt)).toLocaleDateString()}
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>{userData?.user.username}</Card.Title>
                                    <Card.Text>
                                        <strong>Temperature:</strong> {vitalSign.temperature} °C <br />
                                        <strong>Heart Rate:</strong> {vitalSign.heartRate} bpm <br />
                                        <strong>Blood Pressure:</strong> {vitalSign.bloodPressure} mmHg <br />
                                        <strong>Respiratory Rate:</strong> {vitalSign.respiratoryRate} breaths/min <br />
                                        <strong>Weight:</strong> {vitalSign.weight} kg
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>No clinical visit data found</p>
            )}
        </Container>
    );
}

export default PatientDetails