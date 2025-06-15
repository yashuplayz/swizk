const mongoose = require('mongoose');

const ChecklistSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  title: { type: String, required: true },
  items: [
    {
      text: String,
      checked: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Checklist', ChecklistSchema);
