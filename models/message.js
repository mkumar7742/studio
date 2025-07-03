
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

MessageSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

MessageSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Message', MessageSchema);
