const mongoose = require('mongoose');

const MotivationalTipSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MotivationalTip = mongoose.model('MotivationalTip', MotivationalTipSchema);
module.exports = MotivationalTip;
