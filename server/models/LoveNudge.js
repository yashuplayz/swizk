const mongoose = require('mongoose');

const LoveNudgeSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, default: 'Thinking of you!' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoveNudge', LoveNudgeSchema);
