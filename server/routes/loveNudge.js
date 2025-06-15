const express = require('express');
const router = express.Router();
const LoveNudge = require('../models/LoveNudge');
const { authenticateJWT } = require('../middleware/auth');

// Send a love nudge
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const nudge = new LoveNudge({ sender: req.user.id, receiver, message });
    await nudge.save();
    res.status(201).json(nudge);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Get nudges sent to the user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const nudges = await LoveNudge.find({ receiver: req.user.id }).sort({ createdAt: -1 });
    res.json(nudges);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
