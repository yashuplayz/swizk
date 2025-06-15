const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/DiaryEntry');
const { authenticateJWT } = require('../middleware/auth');

// Get all diary entries for a user and their partner
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const entries = await DiaryEntry.find({
      $or: [
        { author: req.user.id },
        { partner: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new diary entry
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { partner, content } = req.body;
    const entry = new DiaryEntry({
      author: req.user.id,
      partner,
      content
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
