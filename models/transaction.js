
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  date: { type: String, required: true },
  member: { type: String, required: true },
  merchant: { type: String, required: true },
  isRecurring: { type: Boolean, default: false },
  recurrenceFrequency: { type: String, enum: ['weekly', 'monthly', 'yearly'] },
});

TransactionSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

TransactionSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
