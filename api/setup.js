
const express = require('express');
const router = express.Router();
const Member = require('../models/member');
const Role = require('../models/role');
const Category = require('../models/category');
const Family = require('../models/family');
const { initialData } = require('../lib/seed-data');

// @route   GET api/setup/status
// @desc    Check if the initial setup has been completed (i.e., if any families exist)
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const familyCount = await Family.countDocuments();
    res.json({ needsSetup: familyCount === 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/setup/create-admin
// @desc    Create the first family and its administrator account
// @access  Public (only if no families exist)
router.post('/create-admin', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // This endpoint should only be callable if there are NO families in the database.
    const familyCount = await Family.countDocuments();
    if (familyCount > 0) {
      return res.status(403).json({ message: 'Setup has already been completed.' });
    }

    // 1. Create the Family
    const newFamily = new Family({ name: `${name}'s Family` });
    await newFamily.save();

    // 2. Create Roles for this Family
    const familyRoles = initialData.roles.map(role => ({ ...role, familyId: newFamily.id }));
    const createdRoles = await Role.insertMany(familyRoles);
    const adminRole = createdRoles.find(r => r.name === 'Family Head');
    if (!adminRole) {
        throw new Error('Family Head role could not be created.');
    }

    // 3. Create default Categories for this Family
    const familyCategories = initialData.categories.map(cat => ({ ...cat, familyId: newFamily.id }));
    await Category.insertMany(familyCategories);

    // 4. Create the new admin member for this family
    const newAdmin = new Member({
        name,
        email,
        password, // The 'save' pre-hook in the model will hash this
        roleId: adminRole.id,
        familyId: newFamily.id,
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'person portrait',
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Family and Head account created successfully.' });
  } catch (err) {
    console.error(err.message);
    // Check for validation errors (e.g., password complexity)
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
