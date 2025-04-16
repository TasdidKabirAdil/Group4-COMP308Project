const mongoose = require('mongoose')

const dailyTipSchema = new mongoose.Schema({
    message: String,
    date: { type: String, required: true, unique: true }
  });
  
const DailyTip = mongoose.model('DailyTip', dailyTipSchema);  

module.exports = DailyTip