
const express = require('express');
const router = express.Router();
const Family = require('../models/family');
const auth = require('./middleware/auth');

// GET all families (System Admin only)
router.get('/', auth, async (req, res) => {
    // This assumes the auth middleware adds roleName to req.member
    if (req.member.roleName !== 'System Administrator') {
        return res.status(403).json({ message: 'Forbidden: Access is restricted to System Administrators.' });
    }
    try {
        const families = await Family.find({}).sort({ name: 1 });
        res.json(families);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
