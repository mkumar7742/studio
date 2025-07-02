
const express = require('express');
const router = express.Router();
const AuditLog = require('../models/auditLog');
const auth = require('./middleware/auth');

// GET all audit logs for the family
router.get('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('audit:view')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    // For performance, you might want to add pagination in a real app
    const logs = await AuditLog.find({ familyId: req.member.familyId }).sort({ timestamp: -1 }).limit(200); 
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
