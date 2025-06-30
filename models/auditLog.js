
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
