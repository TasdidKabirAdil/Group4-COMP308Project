const typeDefs = `#graphql
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        role: String!
        createdAt: String!
    }

    type Query {
        users: [User]
        user(id: ID!): User
    }

    type Mutation {
        login(email: String!, password: String!): AuthPayload
        register(
            username: String!
            email: String!
            password: String!
            role: String!
        ): User
    }

    type AuthPayload {
        token: String
        user: User
    }
`

module.exports = typeDefs;