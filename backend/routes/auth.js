const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: 'User already exists' });

    // Hash pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
