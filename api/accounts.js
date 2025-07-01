
const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const auth = require('./middleware/auth');

// GET all accounts
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
