const mongoose = require('mongoose');

const SymptomChecklistSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symptoms: [{ type: String }],
    submissionDate: { type: Date, default: Date.now }
});

const SymptomChecklist = mongoose.model('SymptomChecklist', SymptomChecklistSchema);

module.exports = SymptomChecklist;