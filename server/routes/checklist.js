const express = require('express');
const router = express.Router();
const Checklist = require('../models/Checklist');
const { authenticateJWT } = require('../middleware/auth');

// Create a checklist
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { title, items, users } = req.body;
    const checklist = new Checklist({ title, items, users });
    await checklist.save();
    res.status(201).json(checklist);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Get all checklists for the user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const checklists = await Checklist.find({ users: req.user.id }).sort({ createdAt: -1 });
    res.json(checklists);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update checklist items
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { items } = req.body;
    const checklist = await Checklist.findByIdAndUpdate(
      req.params.id,
      { items },
      { new: true }
    );
    res.json(checklist);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
