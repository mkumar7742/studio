
const express = require('express');
const router = express.Router();
const Approval = require('../models/approval');

// GET all approvals
router.get('/', async (req, res) => {
  try {
    const approvals = await Approval.find().sort({ _id: -1 });
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new approval
router.post('/', async (req, res) => {
  const approval = new Approval(req.body);
  try {
    const newApproval = await approval.save();
    res.status(201).json(newApproval);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) an approval status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedApproval = await Approval.findOneAndUpdate(
      { id: req.params.id },
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
