
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  billingCycle: { type: String, enum: ['Monthly', 'Yearly'], required: true },
  nextPaymentDate: { type: String, required: true },
  category: { type: String, required: true },
});

SubscriptionSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

SubscriptionSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
