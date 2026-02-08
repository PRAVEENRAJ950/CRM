import AuditLog from '../models/AuditLog.js';

/**
 * @desc    Get audit logs
 * @route   GET /api/audit-logs
 * @access  Private (Admin Only)
 */
export const getAuditLogs = async (req, res) => {
    try {
        const { module, action, userId, startDate, endDate } = req.query;

        let query = {};

        if (module) query.module = module;
        if (action) query.action = { $regex: action, $options: 'i' };
        if (userId) query.userId = userId;

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const logs = await AuditLog.find(query)
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .limit(100); // Limit to last 100 for performance, pagination recommended for full implementation

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

/**
 * Helper to create an audit log entry
 * @param {Object} data - Log data
 * @param {string} data.userId - User ID performing action
 * @param {string} data.action - Action name (e.g., 'CREATE', 'UPDATE')
 * @param {string} data.module - Module name (e.g., 'Lead', 'Auth')
 * @param {string} data.description - Human readable description
 * @param {Object} [data.metadata] - Optional additional data
 * @param {string} [data.ipAddress] - Optional IP address
 */
export const createAuditLog = async ({ userId, action, module, description, metadata, ipAddress }) => {
    try {
        await AuditLog.create({
            userId,
            action,
            module,
            description,
            metadata,
            ipAddress
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw error to avoid blocking main flow
    }
};
