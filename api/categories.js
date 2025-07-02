
const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Transaction = require('../models/transaction');
const auth = require('./middleware/auth');

// GET all categories for the family, sorted by order
router.get('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('categories:view')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const categories = await Category.find({ familyId: req.member.familyId }).sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new category for the family
router.post('/', auth, async (req, res) => {
  if (!req.member.permissions.includes('categories:create')) {
      return res.status(403).json({ message: 'Forbidden' });
  }
  const category = new Category({ ...req.body, familyId: req.member.familyId });
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a category for the family
router.put('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('categories:edit')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const updatedCategory = await Category.findOneAndUpdate(
            { _id: req.params.id, familyId: req.member.familyId },
            req.body, 
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found or you do not have permission to modify it.' });
        }
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST reorder categories for the family
router.post('/reorder', auth, async (req, res) => {
    if (!req.member.permissions.includes('categories:edit')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { orderedIds } = req.body;
    try {
        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id, familyId: req.member.familyId },
                update: { $set: { order: index } }
            }
        }));
        await Category.bulkWrite(bulkOps);
        res.status(200).json({ message: 'Categories reordered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// DELETE a category from the family
router.delete('/:id', auth, async (req, res) => {
    if (!req.member.permissions.includes('categories:delete')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const categoryToDelete = await Category.findOne({ _id: req.params.id, familyId: req.member.familyId });
        if (!categoryToDelete) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if the category is in use by any transaction in the same family
        const transactionCount = await Transaction.countDocuments({ category: categoryToDelete.name, familyId: req.member.familyId });
        if (transactionCount > 0) {
            return res.status(400).json({ message: 'Cannot delete category. It is currently in use by transactions.' });
        }
        
        await Category.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
