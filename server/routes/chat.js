const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authenticateJWT } = require('../middleware/auth');

// Send a message
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const message = new Message({ sender: req.user.id, receiver, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Get chat messages between two users
router.get('/:partnerId', authenticateJWT, async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: partnerId },
        { sender: partnerId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
