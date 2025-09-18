const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment');

// GET all apartments, with optional filters
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.rooms) filter.rooms = req.query.rooms;
    if (req.query.features) filter.features = { $in: req.query.features.split(',') };
    
    const apartments = await Apartment.find(filter).sort({ createdAt: -1 });
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single apartment by ID
router.get('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }
    res.json(apartment);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Apartment not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new apartment
router.post('/', async (req, res) => {
  try {
    const newApartment = new Apartment(req.body);
    await newApartment.save();
    res.status(201).json(newApartment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update apartment
router.put('/:id', async (req, res) => {
  try {
    const updated = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Apartment not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE apartment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Apartment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Apartment not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;