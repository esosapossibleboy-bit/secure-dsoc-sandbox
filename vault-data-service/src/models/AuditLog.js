// auth-audit-service/src/models/AuditLog.js
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    attemptedUsername: { type: String, required: true, trim: true },
    ipAddress: { type: String, default: 'unknown' },
    eventStatus: { 
        type: String, 
        enum: ['SUCCESS', 'FAILED_BRUTE_FORCE_ATTEMPT', 'EXPIRED_TOKEN_ALERT'], 
        required: true 
    },
    failureReason: { type: String, default: null },
    severityLevel: { type: String, enum: ['LOW', 'HIGH', 'CRITICAL'], default: 'LOW' }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
