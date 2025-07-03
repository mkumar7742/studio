
const express = require('express');
const router = express.Router();
const Family = require('../models/family');

// @route   GET api/setup/status
// @desc    Check if the initial setup has been completed (i.e., if any families exist)
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const familyCount = await Family.countDocuments();
    // This endpoint now checks if ANY family exists. If so, login is available.
    // The new public registration is handled by the /api/auth/register endpoint.
    res.json({ setupComplete: familyCount > 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// The create-admin functionality has been moved to /api/auth/register
// to allow for public registration of new families. This file is kept
// for the status check and potential future system-level setup tasks.

module.exports = router;
