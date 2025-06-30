
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  allocated: { type: Number, required: true },
  currency: { type: String, required: true },
  scope: { type: String, enum: ['global', 'member'], required: true },
  memberId: { type: String },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  status: { type: String, enum: ['active', 'archived'], required: true },
});

module.exports = mongoose.model('Budget', BudgetSchema);
