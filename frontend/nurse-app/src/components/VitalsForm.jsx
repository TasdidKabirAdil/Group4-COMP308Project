import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const GET_USERS = gql`
    query Users {
        users {
            id
            username
            role
        }
    }
`

const CREATE_VITALSIGNS = gql`
    mutation CreateVitalSign($userId: ID!, $enteredBy: ID!, $temperature: Float!, $heartRate: Int!, $bloodPressure: String!, $respiratoryRate: Int!, $weight: Float!) {
        createVitalSign(userId: $userId, enteredBy: $enteredBy, temperature: $temperature, heartRate: $heartRate, bloodPressure: $bloodPressure, respiratoryRate: $respiratoryRate, weight: $weight) {
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

function VitalsForm() {
    const navigate = useNavigate()
    const { data: userData, loading, error } = useQuery(GET_USERS)
    const patients = userData?.users.filter(user => user.role === "Patient")
    const nurseId = localStorage.getItem('id')
    const [createVitalSign] = useMutation(CREATE_VITALSIGNS)
    const [vitalSignForm, setVitalSignForm] = useState({
        userId: '',
        enteredBy: nurseId,
        temperature: '',
        heartRate: '',
        bloodPressure: '',
        respiratoryRate: '',
        weight: '',
    })

    const handleChange = (e) => {
        setVitalSignForm({
            ...vitalSignForm, [e.target.name]: ["temperature", "weight"].includes(e.target.name)
                ? parseFloat(e.target.value)
                : ["heartRate", "respiratoryRate"].includes(e.target.name)
                    ? parseInt(e.target.value)
                    : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await createVitalSign({ variables: { ...vitalSignForm } })
            if (data) {
                alert('Vital Signs have been added')
                setVitalSignForm({
                    userId: '',
                    enteredBy: localStorage.getItem('id'),
                    temperature: '',
                    heartRate: '',
                    bloodPressure: '',
                    respiratoryRate: '',
                    weight: '',
                })
            }
        } catch (error) {
            console.error("GraphQL Error: ", error)
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-center">Enter Patient Vital Signs</h2>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Select Patient</Form.Label>
                    <Form.Select
                        name="userId"
                        value={vitalSignForm.userId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select Patient</option>
                        {patients?.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.username}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nurse ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="enteredBy"
                        value={vitalSignForm.enteredBy}
                        disabled
                    />
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Temperature (°C)</Form.Label>
                            <Form.Control
                                type="number"
                                name="temperature"
                                placeholder="Enter temperature"
                                value={vitalSignForm.temperature}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Heart Rate (bpm)</Form.Label>
                            <Form.Control
                                type="number"
                                name="heartRate"
                                placeholder="Enter heart rate"
                                value={vitalSignForm.heartRate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Blood Pressure (e.g. 120/80 mmHg)</Form.Label>
                    <Form.Control
                        type="text"
                        name="bloodPressure"
                        placeholder="Enter blood pressure"
                        value={vitalSignForm.bloodPressure}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Respiratory Rate (breaths/min)</Form.Label>
                            <Form.Control
                                type="number"
                                name="respiratoryRate"
                                placeholder="Enter respiratory rate"
                                value={vitalSignForm.respiratoryRate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Weight (kg)</Form.Label>
                            <Form.Control
                                type="number"
                                name="weight"
                                placeholder="Enter weight"
                                value={vitalSignForm.weight}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex gap-2">
                    <Button type="submit" variant="success">
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/nurse')}>
                        Go Back
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default VitalsForm