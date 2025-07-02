
const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const auth = require('./middleware/auth');

// GET all budgets
router.get('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('budgets:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new budget
router.post('/', auth, async (req, res) => {
    if (!req.member.permissions.includes('budgets:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  const budget = new Budget(req.body);
  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a budget
router.put('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('budgets:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBudget) {
        return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a budget
router.delete('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('budgets:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
        if (!deletedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json({ message: 'Budget deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
