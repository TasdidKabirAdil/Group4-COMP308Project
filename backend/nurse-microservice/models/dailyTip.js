const mongoose = require('mongoose')

const dailyTipSchema = new mongoose.Schema({
    message: String,
    date: { type: String, required: true, unique: true } // e.g., "2025-04-13"
  });
  
const DailyTip = mongoose.model('DailyTip', dailyTipSchema);  

module.exports = DailyTip