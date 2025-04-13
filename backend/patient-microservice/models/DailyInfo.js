const mongoose = require('mongoose');

const DailyInfoSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pulseRate: { type: Number },
    bloodPressureSystolic: { type: Number },
    bloodPressureDiastolic: { type: Number },
    weight: { type: Number },
    temperature: { type: Number },
    respiratoryRate: { type: Number },
    entryDate: { type: Date, default: Date.now }
});

const DailyInfo = mongoose.model('DailyInfo', DailyInfoSchema);

module.exports = DailyInfo;