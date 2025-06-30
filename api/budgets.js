const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');

// GET all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new budget
router.post('/', async (req, res) => {
  const budget = new Budget(req.body);
  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a budget
router.put('/:id', async (req, res) => {
  try {
    const updatedBudget = await Budget.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedBudget) {
        return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a budget
router.delete('/:id', async (req, res) => {
    try {
        const deletedBudget = await Budget.findOneAndDelete({ id: req.params.id });
        if (!deletedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json({ message: 'Budget deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
