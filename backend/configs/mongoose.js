const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const configMongoose = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected Successfully!')
    } catch (error) {
        console.error('Failed to connect MongoDB', error)
        process.exit(1)
    }
}

module.exports = configMongoose;