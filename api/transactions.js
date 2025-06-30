
const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new transaction
router.post('/', async (req, res) => {
  const transaction = new Transaction(req.body);
  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST bulk delete transactions
router.post('/bulk-delete', async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: 'Invalid request body, expected "ids" array.' });
    }
    try {
        await Transaction.deleteMany({ id: { $in: ids } });
        res.status(200).json({ message: 'Transactions deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
