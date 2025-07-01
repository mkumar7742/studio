
const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const auth = require('./middleware/auth');

// GET all categories, sorted by order
router.get('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('categories:view')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new category
router.post('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('categories:create')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  const category = new Category(req.body);
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a category
router.put('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('categories:edit')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
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
router.post('/reorder', auth, async (req, res) => {
    if (!req.member.permissions.includes('categories:edit')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
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
router.delete('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('categories:delete')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
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
