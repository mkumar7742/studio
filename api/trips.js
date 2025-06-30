
const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');

// GET all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ departDate: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new trip
router.post('/', async (req, res) => {
  const trip = new Trip(req.body);
  try {
    const newTrip = await trip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a trip
router.put('/:id', async (req, res) => {
  try {
    const updatedTrip = await Trip.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedTrip) {
        return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a trip
router.delete('/:id', async (req, res) => {
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
