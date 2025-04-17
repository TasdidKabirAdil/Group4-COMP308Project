const typeDefs = `#graphql
    scalar Date

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        role: String!
        createdAt: String!
    }

    type DailyTip {
        id: ID!
        message: String!
        date: String!
    }

    type VitalSign {
        id: ID!
        userId: ID!
        enteredBy: ID!
        temperature: Float!
        heartRate: Int!
        bloodPressure: String!
        respiratoryRate: Int!
        weight: Float!
        createdAt: String
    }

    type EmergencyAlert {
        id: ID!
        patientId: ID!
        message: String
        timestamp: Date
    }

    type Query {
        userVitalSigns(
            userId: ID!
        ) : [VitalSign!]

        users: [User]
        user(id: ID!): User

        emergencyAlerts: [EmergencyAlert]
        getTodayTip: DailyTip
    }

    type Mutation {
        createVitalSign (
            userId: ID!
            enteredBy: ID!
            temperature: Float!
            heartRate: Int!
            bloodPressure: String!
            respiratoryRate: Int!
            weight: Float!
        ) : VitalSign

        sendDailyTip: DailyTip!

        updateEmergencyAlerts(id: ID! message: String!): EmergencyAlert #emergency alert response from nurse
    }
`

module.exports = typeDefs;