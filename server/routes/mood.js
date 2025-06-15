const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const { authenticateJWT } = require('../middleware/auth');

// Post a mood
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { mood } = req.body;
    const moodEntry = new Mood({ user: req.user.id, mood });
    await moodEntry.save();
    res.status(201).json(moodEntry);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Get all moods (for mood board)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const moods = await Mood.find().populate('user', 'displayName email').sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
