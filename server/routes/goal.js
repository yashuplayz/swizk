const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { authenticateJWT } = require('../middleware/auth');

// Create a goal
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { title, description, dueDate, users } = req.body;
    const goal = new Goal({ title, description, dueDate, users });
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Get all goals for the user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const goals = await Goal.find({ users: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a goal (mark as completed or edit)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { title, description, dueDate, completed } = req.body;
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, completed },
      { new: true }
    );
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
