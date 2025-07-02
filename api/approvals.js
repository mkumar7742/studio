
const express = require('express');
const router = express.Router();
const Approval = require('../models/approval');
const auth = require('./middleware/auth');
const { logAuditEvent } = require('../lib/audit');

// GET all approvals (for head) or user's approvals (for member) for the family
router.get('/', auth, async (req, res) => {
  try {
    const query = req.member.permissions.includes('approvals:manage') 
      ? { familyId: req.member.familyId } 
      : { familyId: req.member.familyId, memberId: req.member.id };
    const approvals = await Approval.find(query).sort({ requestDate: -1 });
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new approval request for the family
router.post('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('approvals:request')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const approval = new Approval({
    ...req.body,
    memberId: req.member.id,
    memberName: req.member.name,
    familyId: req.member.familyId,
  });

  try {
    const newApproval = await approval.save();
    await logAuditEvent(req.member, 'APPROVAL_REQUEST_CREATE', { approvalId: newApproval.id, amount: newApproval.amount, description: newApproval.description }, req.member.familyId);
    res.status(201).json(newApproval);
  } catch (err)
 {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) an approval status for the family
router.put('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('approvals:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { status, notes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status update.' });
    }

    try {
        const updatedApproval = await Approval.findOneAndUpdate(
            { _id: req.params.id, familyId: req.member.familyId }, 
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
            return res.status(404).json({ message: 'Approval not found or you do not have permission to modify it.' });
        }

        await logAuditEvent(req.member, 'APPROVAL_REQUEST_DECISION', { approvalId: updatedApproval.id, status: updatedApproval.status }, req.member.familyId);

        res.json(updatedApproval);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;
