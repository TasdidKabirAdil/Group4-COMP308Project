import React, { useState } from "react"
import { gql, useQuery, useMutation } from '@apollo/client'

const GET_USERS = gql`
    query Users {
        users {
            id
            username
            role
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

const SEND_DAILY_TIP = gql`
    mutation SendDailyTip {
        sendDailyTip {
            id
            message
            date
        }
    }
`

const GET_EMERGENCY_ALERTS = gql`
    query EmergencyAlerts {
        emergencyAlerts {
            id
            patientId
            message
            timestamp
        }
    }
`

const RESPOND_TO_ALERT = gql`
    mutation UpdateEmergencyAlerts($updateEmergencyAlertsId: ID!, $message: String!) {
        updateEmergencyAlerts(id: $updateEmergencyAlertsId, message: $message) {
            id
            patientId
            message
            timestamp
        }
    }
`

function NurseDashboard() {
    const { data: userData, loading, error } = useQuery(GET_USERS)
    const { data: emergencyAlertsData } = useQuery(GET_EMERGENCY_ALERTS)
    const patients = userData?.users.filter(user => user.role === 'Patient')
    const [sendDailyTip] = useMutation(SEND_DAILY_TIP)
    const [respondToAlert] = useMutation(RESPOND_TO_ALERT)
    const [respondedAlerts, setRespondedAlerts] = useState([]);

    const handleSendTip = async () => {
        try {
            const { data } = await sendDailyTip()
            alert(`Daily Tip sent: ${data.sendDailyTip.message}`)
        } catch (error) {
            console.error("Error sending tip", error)
            alert("Failed to send daily tip")
        }
    }

    const handleAlertResponse = async (alertId) => {
        try {
            await respondToAlert({ variables: { updateEmergencyAlertsId: alertId, message: "Help is on the way" } })
            setRespondedAlerts((prev) => [...prev, alertId]);
            alert("Response has been sent")
        } catch (error) {
            console.error("Error responding to alert", error);
            alert("Failed to respond to alert");
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <>
            <h2>Nurse Dashboard</h2>
            <button onClick={handleSendTip}>Send daily motivational tips</button>
            <h3>Patient List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Clinical Visit Details</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.length > 0 ? (
                        patients.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.username}</td>
                                <td><button>View user details</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No patients found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h3>Emergency Alerts</h3>
            <table>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Emergency Alert Message</th>
                        <th>Date and Time</th>
                        <th>Respond</th>
                    </tr>
                </thead>
                <tbody>
                    {emergencyAlertsData?.emergencyAlerts.length > 0 ? (
                        emergencyAlertsData.emergencyAlerts.map((alert) => {
                            const patient = userData.users.find(user => user.id === alert.patientId)
                            return (
                                <tr key={alert.id}>
                                    <td>{patient ? patient.username : "Unknown Patient"}</td>
                                    <td>{alert.message}</td>
                                    <td>{new Date(alert.timestamp).toLocaleString()}</td>
                                    <td>
                                        {respondedAlerts.includes(alert.id) ? (
                                            <button disabled>Responded</button>
                                        ) : (
                                            <button onClick={() => handleAlertResponse(alert.id)}>Respond</button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="3">No alerts found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default NurseDashboard 