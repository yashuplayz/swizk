const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register with email/password
router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword, displayName });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email, displayName } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login with email/password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email, displayName: user.displayName } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login/Register with Firebase (Google/social)
router.post('/firebase', async (req, res) => {
  const { firebaseUid, email, displayName } = req.body;
  try {
    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = new User({ firebaseUid, email, displayName });
      await user.save();
    }
    // Optionally, issue a JWT for session management
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email, displayName: user.displayName } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
