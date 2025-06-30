
const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription');

// GET all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ nextPaymentDate: 1 });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new subscription
router.post('/', async (req, res) => {
  const subscription = new Subscription(req.body);
  try {
    const newSubscription = await subscription.save();
    res.status(201).json(newSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a subscription
router.put('/:id', async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedSubscription) {
        return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(updatedSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a subscription
router.delete('/:id', async (req, res) => {
    try {
        const deletedSubscription = await Subscription.findOneAndDelete({ id: req.params.id });
        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json({ message: 'Subscription deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
