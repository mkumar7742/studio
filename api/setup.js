
const express = require('express');
const router = express.Router();
const Member = require('../models/member');
const Role = require('../models/role');
const Family = require('../models/family');

// @route   GET api/setup/status
// @desc    Check if the initial setup has been completed (i.e., if any members exist)
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const memberCount = await Member.countDocuments();
    res.json({ setupComplete: memberCount > 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/setup/create-admin
// @desc    Create the initial System Administrator account
// @access  Public (only if no users exist)
router.post('/create-admin', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const memberCount = await Member.countDocuments();
        if (memberCount > 0) {
            return res.status(403).json({ message: 'Setup has already been completed.' });
        }
        
        // Define all possible permissions for the System Administrator
        const allPermissions = [
            'dashboard:view',
            'expenses:view', 'expenses:create', 'expenses:edit', 'expenses:delete',
            'income:view', 'income:create', 'income:edit', 'income:delete',
            'approvals:request', 'approvals:manage',
            'budgets:view', 'budgets:manage',
            'categories:view', 'categories:create', 'categories:edit', 'categories:delete',
            'members:view', 'members:create', 'members:edit', 'members:delete',
            'roles:manage',
            'calendar:view',
            'audit:view',
        ];

        // Create the System Administrator role (no familyId)
        const adminRole = new Role({
            name: 'System Administrator',
            permissions: allPermissions
        });
        await adminRole.save();

        // Create the System Administrator member (no familyId)
        const adminMember = new Member({
            name,
            email,
            password, // Hashed on save
            roleId: adminRole.id,
            avatar: 'https://placehold.co/100x100.png',
            avatarHint: 'admin portrait',
        });
        await adminMember.save();
        
        res.status(201).json({ message: 'System Administrator created successfully. Please log in.' });
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;
