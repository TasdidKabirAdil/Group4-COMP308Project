const mongoose = require('mongoose')

const VitalSignsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // patient ID
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // nurse ID
    temperature: Number,
    heartRate: Number,
    bloodPressure: String,
    respiratoryRate: Number,
    weight: Number,
    createdAt: { type: Date, default: Date.now }
})

const VitalSigns = mongoose.model('VitalSigns', VitalSignsSchema)

module.exports = VitalSigns