
const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  owner: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    avatar: { type: String, required: true },
    avatarHint: { type: String, required: true },
  },
  category: { type: String, enum: ['Travel', 'Food', 'Software'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  frequency: { type: String, enum: ['Once', 'Monthly', 'Bi-Monthly'], required: true },
  project: { type: String, required: true },
  description: { type: String, required: true },
  team: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Declined'], required: true },
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
