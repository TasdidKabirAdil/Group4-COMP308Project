const typeDefs = `#graphql
    scalar Date

    type DailyInfo {
        id: ID!
        patientId: ID!
        pulseRate: Float
        bloodPressureSystolic: Float
        bloodPressureDiastolic: Float
        weight: Float
        temperature: Float
        respiratoryRate: Float
        entryDate: Date
    }

    type SymptomChecklist {
        id: ID!
        patientId: ID!
        symptoms: [String]
        submissionDate: Date
        prediction: PredictionResult
    }

    type PredictionResult {
        predictedConditions: [String!]!
        recommendConsultation: Boolean!
    }

    type EmergencyAlert {
        id: ID!
        patientId: ID!
        message: String
        timestamp: Date
    }

    type DailyTip {
        id: ID!
        message: String!
        date: String!
    }

    input DailyInfoInput {
        patientId: ID!
        pulseRate: Float
        bloodPressureSystolic: Float
        bloodPressureDiastolic: Float
        weight: Float
        temperature: Float
        respiratoryRate: Float
    }

    input SymptomChecklistInput {
        patientId: ID!
        symptoms: [String]!
        prediction: PredictionInput
    }

    input PredictionInput {
        predictedConditions: [String!]!
        recommendConsultation: Boolean!
    }

    type Query {
        getDailyInfo(patientId: ID!): [DailyInfo]
        getSymptomChecklists(patientId: ID!): [SymptomChecklist]
        getEmergencyAlerts(patientId: ID!): [EmergencyAlert]
        getTodayTip: DailyTip
    }

    type Mutation {
        createDailyInfo(input: DailyInfoInput!): DailyInfo
        submitSymptomChecklist(input: SymptomChecklistInput!): SymptomChecklist
        createEmergencyAlert(patientId: ID!): EmergencyAlert
        deleteSymptomChecklist(id: ID!): Boolean!
    }
`;

module.exports = typeDefs;