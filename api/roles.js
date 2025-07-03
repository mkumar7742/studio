
const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const auth = require('./middleware/auth');
const { logAuditEvent } = require('../lib/audit');

// GET all roles for the family, or all roles for an admin
router.get('/', auth, async (req, res) => {
    if (!req.member.permissions.includes('roles:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  try {
    const query = req.member.roleName === 'System Administrator' ? {} : { familyId: req.member.familyId };
    const roles = await Role.find(query);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new role for the family
router.post('/', auth, async (req, res) => {
    if (!req.member.permissions.includes('roles:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  const role = new Role({ ...req.body, familyId: req.member.familyId });
  try {
    const newRole = await role.save();
    await logAuditEvent(req.member, 'ROLE_CREATE', { roleId: newRole.id, roleName: newRole.name }, req.member.familyId);
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a role for the family
router.put('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('roles:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const query = req.member.roleName === 'System Administrator' ? { _id: req.params.id } : { _id: req.params.id, familyId: req.member.familyId };
        const updatedRole = await Role.findOneAndUpdate(
            query,
            req.body, 
            { new: true }
        );
        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found or you do not have permission to modify it.' });
        }
        const familyIdForAudit = updatedRole.familyId || req.member.familyId; // Not perfect, but covers most cases
        await logAuditEvent(req.member, 'ROLE_UPDATE', { roleId: updatedRole.id, roleName: updatedRole.name, changes: req.body }, familyIdForAudit);
        res.json(updatedRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a role from the family
router.delete('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('roles:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const query = req.member.roleName === 'System Administrator' ? { _id: req.params.id } : { _id: req.params.id, familyId: req.member.familyId };
        const deletedRole = await Role.findOneAndDelete(query);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found or you do not have permission to delete it.' });
        }
        const familyIdForAudit = deletedRole.familyId || req.member.familyId;
        await logAuditEvent(req.member, 'ROLE_DELETE', { roleId: deletedRole.id, roleName: deletedRole.name }, familyIdForAudit);
        res.json({ message: 'Role deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
