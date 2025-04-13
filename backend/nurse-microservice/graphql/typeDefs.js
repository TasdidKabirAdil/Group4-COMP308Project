const vitalSignTypeDefs = `#graphql
    type MotivationalTip {
        id: ID!
        message: String!
        createdAt: String
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

    type Query {
        userVitalSigns(
            userId: ID!
            enteredBy: ID!
        ) : [VitalSign!]

        dailyTip: MotivationalTip!
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
    }
`

module.exports = vitalSignTypeDefs;