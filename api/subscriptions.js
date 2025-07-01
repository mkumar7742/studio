
const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription');
const auth = require('./middleware/auth');

// GET all subscriptions
router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ nextPaymentDate: 1 });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new subscription
router.post('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('subscriptions:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  const subscription = new Subscription({
      _id: `sub-${Date.now()}`,
      ...req.body
  });
  try {
    const newSubscription = await subscription.save();
    res.status(201).json(newSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a subscription
router.put('/:id', auth, async (req, res) => {
  if (!req.member.permissions.includes('subscriptions:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubscription) {
        return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(updatedSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a subscription
router.delete('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('subscriptions:manage')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json({ message: 'Subscription deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
