
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
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

BudgetSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

BudgetSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Budget', BudgetSchema);
