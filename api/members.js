
const express = require('express');
const router = express.Router();
const Member = require('../models/member');
const auth = require('./middleware/auth');
const { logAuditEvent } = require('../lib/audit');

// GET all members for the family or all members for System Admin
router.get('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('members:view')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const query = req.member.roleName === 'System Administrator' ? {} : { familyId: req.member.familyId };
    const members = await Member.find(query);
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new member to the family
router.post('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('members:create')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  const member = new Member({ ...req.body, familyId: req.member.familyId });
  try {
    const newMember = await member.save();
    await logAuditEvent(req.member, 'MEMBER_CREATE', { targetMemberId: newMember.id, targetMemberName: newMember.name, roleId: newMember.roleId }, req.member.familyId);
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a member in the family
router.put('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('members:edit')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Admins should not change passwords via this generic update endpoint.
    // Password changes should have a dedicated, more secure flow.
    const { password, ...updateData } = req.body;
    if (password) {
        return res.status(400).json({ message: 'Password cannot be updated from this endpoint.' });
    }

    try {
        const updatedMember = await Member.findOneAndUpdate(
            { _id: req.params.id, familyId: req.member.familyId },
            updateData, 
            { new: true }
        );
        if (!updatedMember) {
            return res.status(404).json({ message: 'Member not found or you do not have permission to modify it.' });
        }
        await logAuditEvent(req.member, 'MEMBER_UPDATE', { targetMemberId: updatedMember.id, targetMemberName: updatedMember.name, changes: updateData }, req.member.familyId);
        res.json(updatedMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a member from the family
router.delete('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('members:delete')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const deletedMember = await Member.findOneAndDelete({ _id: req.params.id, familyId: req.member.familyId });
        if (!deletedMember) {
            return res.status(404).json({ message: 'Member not found or you do not have permission to delete it.' });
        }
        await logAuditEvent(req.member, 'MEMBER_DELETE', { targetMemberId: deletedMember.id, targetMemberName: deletedMember.name }, req.member.familyId);
        res.json({ message: 'Member deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
