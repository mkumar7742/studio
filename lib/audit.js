
const AuditLog = require('../models/auditLog');

async function logAuditEvent(actor, action, details = {}, familyId) {
  try {
    const log = new AuditLog({
      memberId: actor.id,
      memberName: actor.name,
      action,
      details,
      familyId,
    });
    await log.save();
  } catch (error) {
    console.error('Failed to save audit event:', error);
    // In a production app, you'd likely have more robust error logging here (e.g., to a dedicated logging service)
  }
}

module.exports = { logAuditEvent };
