
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  order: { type: Number, required: true },
});

module.exports = mongoose.model('Category', CategorySchema);
