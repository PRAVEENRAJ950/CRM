import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
            trim: true,
        },
        module: {
            type: String,
            required: true, // e.g., 'Auth', 'Lead', 'Deal', 'User'
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        ipAddress: {
            type: String,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed, // For storing extra details like { leadId: '...' }
        },
    },
    {
        timestamps: true, // Creates createdAt (timestamp)
    }
);

// Index for efficient searching/filtering
auditLogSchema.index({ userId: 1, module: 1, action: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
