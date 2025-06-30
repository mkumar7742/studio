
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  billingCycle: { type: String, enum: ['Monthly', 'Yearly'], required: true },
  nextPaymentDate: { type: String, required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
