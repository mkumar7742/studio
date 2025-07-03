
const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const Category = require('../models/category');
const auth = require('./middleware/auth');
const { logAuditEvent } = require('../lib/audit');

// GET all budgets for the family
router.get('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('budgets:view')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const budgets = await Budget.find({ familyId: req.member.familyId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new budget for the family
router.post('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('budgets:manage')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  const { categoryId, amount, period } = req.body;

  try {
    // Check if a budget for this category already exists
    const existingBudget = await Budget.findOne({ familyId: req.member.familyId, categoryId: categoryId });
    if (existingBudget) {
      return res.status(400).json({ message: 'A budget for this category already exists.' });
    }

    // Get category name for denormalization
    const category = await Category.findOne({ _id: categoryId, familyId: req.member.familyId });
    if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
    }

    const budget = new Budget({
      familyId: req.member.familyId,
      categoryId,
      categoryName: category.name,
      amount,
      period,
    });
    
    const newBudget = await budget.save();
    await logAuditEvent(req.member, 'BUDGET_CREATE', { budgetId: newBudget.id, categoryName: newBudget.categoryName, amount: newBudget.amount }, req.member.familyId);
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a budget for the family
router.put('/:id', auth, async (req, res) => {
  if (!req.member.permissions.includes('budgets:manage')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, familyId: req.member.familyId },
      req.body,
      { new: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found or you do not have permission to modify it.' });
    }
    await logAuditEvent(req.member, 'BUDGET_UPDATE', { budgetId: updatedBudget.id, changes: req.body }, req.member.familyId);
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a budget from the family
router.delete('/:id', auth, async (req, res) => {
  if (!req.member.permissions.includes('budgets:manage')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const deletedBudget = await Budget.findOneAndDelete({ _id: req.params.id, familyId: req.member.familyId });
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget not found or you do not have permission to delete it.' });
    }
    await logAuditEvent(req.member, 'BUDGET_DELETE', { budgetId: deletedBudget.id, categoryName: deletedBudget.categoryName }, req.member.familyId);
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
