
const express = require('express');
const router = express.Router();
const Member = require('../models/member');

// GET all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new member
router.post('/', async (req, res) => {
  const member = new Member(req.body);
  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a member
router.put('/:id', async (req, res) => {
    try {
        const updatedMember = await Member.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!updatedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(updatedMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a member
router.delete('/:id', async (req, res) => {
    try {
        const deletedMember = await Member.findOneAndDelete({ id: req.params.id });
        if (!deletedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json({ message: 'Member deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
