
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Member = require('../models/member');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const member = await Member.findOne({ email }).select('+password');
    if (!member) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await member.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // User matched, create JWT payload
    const payload = {
      member: {
        id: member._id,
        name: member.name,
        roleId: member.roleId
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_default_jwt_secret',
      { expiresIn: '5h' }, // Expires in 5 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
