const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// GET all categories, sorted by order
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new category
router.post('/', async (req, res) => {
  const category = new Category(req.body);
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a category
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST reorder categories
router.post('/reorder', async (req, res) => {
    const { orderedIds } = req.body;
    try {
        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { id: id },
                update: { $set: { order: index } }
            }
        }));
        await Category.bulkWrite(bulkOps);
        res.status(200).json({ message: 'Categories reordered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// DELETE a category
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findOneAndDelete({ id: req.params.id });
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
