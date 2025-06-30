const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  date: { type: String, required: true },
  accountId: { type: String, required: true },
  receiptUrl: { type: String },
  member: { type: String, required: true },
  team: { type: String, required: true },
  merchant: { type: String, required: true },
  report: { type: String, required: true },
  status: { type: String, enum: ['Submitted', 'Not Submitted', 'Reimbursed'], required: true },
  isRecurring: { type: Boolean, default: false },
  recurrenceFrequency: { type: String, enum: ['weekly', 'monthly', 'yearly'] },
  reimbursable: { type: Boolean, default: false },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
