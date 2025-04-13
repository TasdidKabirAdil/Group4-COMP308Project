const vitalSignsTypeDefs = `#graphql
    type VitalSigns {
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
        ) : [VitalSigns!]
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
        ) : VitalSigns
    }
`

module.exports = vitalSignsTypeDefs;