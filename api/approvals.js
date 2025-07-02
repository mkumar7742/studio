
const express = require('express');
const router = express.Router();
const Approval = require('../models/approval');
const auth = require('./middleware/auth');

// GET all approvals
router.get('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('approvals:view')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const approvals = await Approval.find().sort({ _id: -1 });
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new approval
router.post('/', auth, async (req, res) => {
  // Any member can create an approval request, so no specific permission check is needed here
  // as long as they are authenticated. The actioning requires permission.
  const approval = new Approval(req.body);
  try {
    const newApproval = await approval.save();
    res.status(201).json(newApproval);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) an approval status
router.put('/:id/status', auth, async (req, res) => {
  if (!req.member.permissions.includes('approvals:action')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const { status } = req.body;
    const updatedApproval = await Approval.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status } },
      { new: true }
    );
    if (!updatedApproval) {
      return res.status(404).json({ message: 'Approval not found' });
    }
    res.json(updatedApproval);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
