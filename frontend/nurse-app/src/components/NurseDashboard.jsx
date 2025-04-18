import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Table, Alert } from "react-bootstrap";

const GET_USERS = gql`
  query Users {
    users {
      id
      username
      role
    }
  }
`;

const GET_DAILY_TIP = gql`
  query GetTodayTip {
    getTodayTip {
      id
      message
      date
    }
  }
`;

const SEND_DAILY_TIP = gql`
  mutation SendDailyTip {
    sendDailyTip {
      id
      message
      date
    }
  }
`;

const GET_EMERGENCY_ALERTS = gql`
  query EmergencyAlerts {
    emergencyAlerts {
      id
      patientId
      message
      timestamp
    }
  }
`;

const RESPOND_TO_ALERT = gql`
  mutation UpdateEmergencyAlerts($updateEmergencyAlertsId: ID!, $message: String!) {
    updateEmergencyAlerts(id: $updateEmergencyAlertsId, message: $message) {
      id
      patientId
      message
      timestamp
    }
  }
`;

function NurseDashboard() {
  const navigate = useNavigate();
  const { data: userData, loading, error } = useQuery(GET_USERS);
  const { data: tipData } = useQuery(GET_DAILY_TIP);
  const { data: emergencyAlertsData } = useQuery(GET_EMERGENCY_ALERTS);

  const [sendDailyTip] = useMutation(SEND_DAILY_TIP);
  const [respondToAlert] = useMutation(RESPOND_TO_ALERT);
  const [respondedAlerts, setRespondedAlerts] = useState([]);

  const patients = userData?.users.filter((user) => user.role === "Patient");

  const handleSendTip = async () => {
    try {
      const { data } = await sendDailyTip();
      alert(`Daily Tip sent: ${data.sendDailyTip.message}`);
      window.location.reload();
    } catch (error) {
      console.error("Error sending tip", error);
      alert("Failed to send daily tip");
    }
  };

  const handleAlertResponse = async (alertId) => {
    try {
      await respondToAlert({
        variables: {
          updateEmergencyAlertsId: alertId,
          message: "Help is on the way",
        },
      });
      setRespondedAlerts((prev) => [...prev, alertId]);
      alert("Response has been sent");
    } catch (error) {
      console.error("Error responding to alert", error);
      alert("Failed to respond to alert");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Container className="mt-4">
        <h2 className="mb-4 text-center">🩺 Nurse Dashboard</h2>

        <Card className="mx-auto mb-4 shadow" style={{ maxWidth: "600px", background: "#e7f4ff" }}>
          <Card.Body className="text-center">
            <Card.Title className="text-info fs-4 mb-2">
              💡 Motivational Tip of the Day
            </Card.Title>
            <Card.Text className="text-muted fs-6">
              {tipData?.getTodayTip?.message || (
                <>
                  <em>No tip sent yet for today.</em> <br />
                  Click below to inspire your patients ✨
                </>
              )}
            </Card.Text>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-center gap-3 mb-5">
          <Button variant="primary" onClick={handleSendTip}>
            📤 Send Daily Motivational Tips
          </Button>
          <Button variant="success" onClick={() => navigate("/vitals-form")}>
            ➕ Enter Vital Signs for Patients
          </Button>
        </div>

        {/* Patient List */}
        <Card className="mb-4 shadow-sm" style={{ backgroundColor: 'rgba(0, 76, 255, 0)', color: 'white', border: 'none'}}>
          <Card.Header className="fw-semibold fs-5">👩‍⚕️ Patient List</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Clinical Visit Details</th>
                </tr>
              </thead>
              <tbody>
                {patients?.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.username}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/patient-details/${patient.id}`)}
                        >
                          View User Details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center text-muted">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Emergency Alerts */}
        <Card className="shadow-sm" style={{ backgroundColor: 'rgba(0, 76, 255, 0)', color: 'white', border: 'none'}}>
          <Card.Header className="fw-semibold fs-5">🚨 Emergency Alerts</Card.Header>
          <Card.Body>
            {emergencyAlertsData?.emergencyAlerts.length === 0 && (
              <Alert variant="info" className="text-center">
                No emergency alerts found.
              </Alert>
            )}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Emergency Alert Message</th>
                  <th>Date and Time</th>
                  <th>Respond</th>
                </tr>
              </thead>
              <tbody>
                {emergencyAlertsData?.emergencyAlerts.map((alert) => {
                  const patient = userData.users.find((user) => user.id === alert.patientId);
                  return (
                    <tr key={alert.id}>
                      <td>{patient ? patient.username : "Unknown Patient"}</td>
                      <td>{alert.message}</td>
                      <td>{new Date(alert.timestamp).toLocaleString()}</td>
                      <td>
                        {respondedAlerts.includes(alert.id) || alert.message === "Help is on the way" ? (
                          <Button variant="secondary" size="sm" disabled>
                            Responded
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleAlertResponse(alert.id)}
                          >
                            Respond
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default NurseDashboard;
