
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Member = require('../models/member');
const Role = require('../models/role');
const auth = require('./middleware/auth');

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

    // Get user role and permissions
    const role = await Role.findById(member.roleId);
    if (!role) {
        return res.status(500).json({ message: 'User role not found.' });
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
        // Attach permissions to the user object in the response
        const userWithPermissions = { ...member.toJSON(), permissions: role.permissions };
        res.json({ token, user: userWithPermissions });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // The auth middleware already attaches the user and their permissions to `req.member`
        // We can simply return it.
        res.json(req.member);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
