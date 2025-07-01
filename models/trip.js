
const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  departDate: { type: String, required: true },
  returnDate: { type: String, required: true },
  location: { type: String, required: true },
  purpose: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  report: { type: String, required: true },
  status: { type: String, enum: ['Approved', 'Pending', 'Not Approved'], required: true },
  memberId: { type: String, required: true },
  hotel: { type: String },
}, { _id: false });

module.exports = mongoose.model('Trip', TripSchema);
