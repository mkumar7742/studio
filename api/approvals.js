
const express = require('express');
const router = express.Router();
const Approval = require('../models/approval');
const auth = require('./middleware/auth');
const { logAuditEvent } = require('../lib/audit');

// GET all approvals (for head) or user's approvals (for member)
router.get('/', auth, async (req, res) => {
  try {
    const query = req.member.permissions.includes('approvals:manage') 
      ? {} 
      : { memberId: req.member.id };
    const approvals = await Approval.find(query).sort({ requestDate: -1 });
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new approval request
router.post('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('approvals:request')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const approval = new Approval({
    ...req.body,
    memberId: req.member.id,
    memberName: req.member.name,
  });

  try {
    const newApproval = await approval.save();
    await logAuditEvent(req.member, 'APPROVAL_REQUEST_CREATE', { approvalId: newApproval.id, amount: newApproval.amount, description: newApproval.description });
    res.status(201).json(newApproval);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) an approval status
router.put('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('approvals:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { status, notes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status update.' });
    }

    try {
        const updatedApproval = await Approval.findByIdAndUpdate(
            req.params.id, 
            { 
                status,
                notes,
                approverId: req.member.id,
                approverName: req.member.name,
                decisionDate: new Date(),
            }, 
            { new: true }
        );
        if (!updatedApproval) {
            return res.status(404).json({ message: 'Approval not found' });
        }

        await logAuditEvent(req.member, 'APPROVAL_REQUEST_DECISION', { approvalId: updatedApproval.id, status: updatedApproval.status });

        res.json(updatedApproval);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;
