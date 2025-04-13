const mongoose = require('mongoose');
const MotivationalTip = require('./models/motivationalTip');

// Replace with your actual MongoDB URI
const MONGO_URI = 'mongodb://localhost:27017/health-monitor-db'; 

const tips = [
  "You're doing better than you think.",
  "One step at a time — progress is progress.",
  "Your body is healing, be kind to yourself.",
  "Take a deep breath — you got this.",
  "Rest is productive too.",
  "Celebrate the small wins today.",
  "Healing isn't linear. Keep going.",
  "You're stronger than you feel right now.",
  "Drink water and smile — even a little helps.",
  "You've already overcome so much."
];

const seedTips = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const created = await MotivationalTip.insertMany(
      tips.map((message) => ({ message }))
    );
    console.log(`Seeded ${created.length} motivational tips`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Failed to seed tips:', err);
  }
};

seedTips();
