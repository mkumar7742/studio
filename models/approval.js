
const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  decisionDate: { type: Date },
  approverId: { type: String },
  approverName: { type: String },
  notes: { type: String },
});

ApprovalSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

ApprovalSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Approval', ApprovalSchema);
