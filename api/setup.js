
const express = require('express');
const router = express.Router();
const Member = require('../models/member');
const Role = require('../models/role');

// @route   GET api/setup/status
// @desc    Check if the initial setup has been completed (i.e., if an admin user exists)
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const memberCount = await Member.countDocuments();
    res.json({ needsSetup: memberCount === 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/setup/create-admin
// @desc    Create the first administrator account
// @access  Public (only if no users exist)
router.post('/create-admin', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // This endpoint should only be callable if there are NO users in the database.
    const memberCount = await Member.countDocuments();
    if (memberCount > 0) {
      return res.status(403).json({ message: 'Setup has already been completed.' });
    }

    // Find the Administrator role, which should have been seeded.
    const adminRole = await Role.findOne({ name: 'Administrator' });
    if (!adminRole) {
        // This case is unlikely if seeding runs correctly, but it's a good safeguard.
        return res.status(500).json({ message: 'Administrator role not found. Please restart the server to trigger seeding.' });
    }

    // Create the new admin member
    const newAdmin = new Member({
        name,
        email,
        password, // The 'save' pre-hook in the model will hash this
        roleId: adminRole._id,
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'person portrait',
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Administrator account created successfully.' });
  } catch (err) {
    console.error(err.message);
    // Check for validation errors (e.g., password complexity)
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
