
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryName: { type: String, required: true }, // Denormalized for easier display
  amount: { type: Number, required: true },
  period: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
});

// Ensure a category can only have one budget per family
BudgetSchema.index({ familyId: 1, categoryId: 1 }, { unique: true });


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
