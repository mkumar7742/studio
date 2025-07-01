
const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  balance: { type: Number, required: true },
  currency: { type: String, required: true },
  icon: { type: String, required: true },
});

module.exports = mongoose.model('Account', AccountSchema);
