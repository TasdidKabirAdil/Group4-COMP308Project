const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('../configs/mongoose')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const startServer = async() => {
    const app = express()

    app.use(cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'https://studio.apollographql.com'
        ],
        credentials: true
    }))

    app.use(cookieParser())

    await connectDB()

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res })
    })

    await server.start()
    server.applyMiddleware({ app, path: '/graphql', cors: false })

    const PORT = 4003

    app.listen(PORT, () => {
        console.log(`🚀 Auth service running at http://localhost:${PORT}${server.graphqlPath}`)
    })
}

startServer()