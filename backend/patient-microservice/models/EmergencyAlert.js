const mongoose = require('mongoose');

const EmergencyAlertSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, default: 'Emergency alert triggered by patient.' },
    timestamp: { type: Date, default: Date.now }
});

const EmergencyAlert = mongoose.model('EmergencyAlert', EmergencyAlertSchema);

module.exports = EmergencyAlert;