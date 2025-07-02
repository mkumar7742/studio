
const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const auth = require('./middleware/auth');

// GET all transactions for the family
router.get('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('expenses:view') && !req.member.permissions.includes('income:view')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const transactions = await Transaction.find({ familyId: req.member.familyId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new transaction for the family
router.post('/', auth, async (req, res) => {
  const { type } = req.body;
  const requiredPermission = type === 'income' ? 'income:create' : 'expenses:create';
  
  if (!req.member.permissions.includes(requiredPermission)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const transaction = new Transaction({ ...req.body, familyId: req.member.familyId });
  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST bulk delete transactions for the family
router.post('/bulk-delete', auth, async (req, res) => {
    if (!req.member.permissions.includes('expenses:delete')) {
         return res.status(403).json({ message: 'Forbidden: Missing permission to delete expenses.' });
    }

    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: 'Invalid request body, expected "ids" array.' });
    }
    try {
        await Transaction.deleteMany({ _id: { $in: ids }, familyId: req.member.familyId });
        res.status(200).json({ message: 'Transactions deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
