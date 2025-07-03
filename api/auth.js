
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Member = require('../models/member');
const Role = require('../models/role');
const auth = require('./middleware/auth');
const Family = require('../models/family');
const Category = require('../models/category');
const { initialData } = require('../lib/seed-data');

// @route   POST api/auth/register
// @desc    Register a new family and its Family Head account
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if a user with this email already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
        return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // 2. Create the Family
    const newFamily = new Family({ name: `${name}'s Family` });
    await newFamily.save();

    // 3. Create Roles for this Family
    const familyRoles = initialData.roles.map(role => ({ ...role, familyId: newFamily.id }));
    const createdRoles = await Role.insertMany(familyRoles);
    const adminRole = createdRoles.find(r => r.name === 'Family Head');
    if (!adminRole) {
        // This is a critical internal error, so we should clean up if it fails.
        await Family.findByIdAndDelete(newFamily.id);
        throw new Error('Family Head role could not be created.');
    }

    // 4. Create default Categories for this Family
    const familyCategories = initialData.categories.map(cat => ({ ...cat, familyId: newFamily.id }));
    await Category.insertMany(familyCategories);

    // 5. Create the new admin member for this family
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

    res.status(201).json({ message: 'Family and Head account created successfully. Please log in.' });
  } catch (err) {
    console.error(err.message);
    // Check for validation errors (e.g., password complexity)
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).send('Server Error');
  }
});


// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const member = await Member.findOne({ email }).select('+password');
    if (!member) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await member.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Get user role and permissions
    const role = await Role.findById(member.roleId);
    if (!role || role.familyId.toString() !== member.familyId.toString()) {
        return res.status(500).json({ message: 'User role not found or mismatched family.' });
    }

    // User matched, create JWT payload
    const payload = {
      member: {
        id: member._id,
        name: member.name,
        roleId: member.roleId,
        familyId: member.familyId,
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_default_jwt_secret',
      { expiresIn: '5h' }, // Expires in 5 hours
      (err, token) => {
        if (err) throw err;
        // Attach permissions to the user object in the response
        const userWithPermissions = { ...member.toJSON(), permissions: role.permissions };
        res.json({ token, user: userWithPermissions });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // The auth middleware already attaches the user and their permissions to `req.member`
        // We can simply return it.
        res.json(req.member);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
