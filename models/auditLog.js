
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
});

AuditLogSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

AuditLogSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
