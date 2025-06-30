
const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');
const auth = require('../middleware/auth');

// GET all trips
router.get('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('trips:view')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const trips = await Trip.find().sort({ departDate: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new trip
router.post('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('trips:create')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  const trip = new Trip(req.body);
  try {
    const newTrip = await trip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a trip
router.put('/:id', auth, async (req, res) => {
  // A trip can be edited by its creator or an admin
  const trip = await Trip.findOne({ id: req.params.id });
  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }
  const canEdit = req.member.id === trip.memberId || req.member.permissions.includes('roles:manage');

  if (!canEdit) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const updatedTrip = await Trip.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a trip
router.delete('/:id', auth, async (req, res) => {
    // A trip can be deleted by its creator or an admin
    const trip = await Trip.findOne({ id: req.params.id });
    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }
    const canDelete = req.member.id === trip.memberId || req.member.permissions.includes('roles:manage');
    
    if (!canDelete) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const deletedTrip = await Trip.findOneAndDelete({ id: req.params.id });
        if (!deletedTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json({ message: 'Trip deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
