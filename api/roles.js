
const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const auth = require('../middleware/auth');
const { logAuditEvent } = require('../lib/audit');

// GET all roles
router.get('/', auth, async (req, res) => {
    if (!req.member.permissions.includes('roles:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new role
router.post('/', auth, async (req, res) => {
    if (!req.member.permissions.includes('roles:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  const role = new Role({
      _id: `role-${Date.now()}`,
      ...req.body
  });
  try {
    const newRole = await role.save();
    await logAuditEvent(req.member, 'ROLE_CREATE', { roleId: newRole.id, roleName: newRole.name });
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a role
router.put('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('roles:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        await logAuditEvent(req.member, 'ROLE_UPDATE', { roleId: updatedRole.id, roleName: updatedRole.name, changes: req.body });
        res.json(updatedRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a role
router.delete('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('roles:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        await logAuditEvent(req.member, 'ROLE_DELETE', { roleId: deletedRole.id, roleName: deletedRole.name });
        res.json({ message: 'Role deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
