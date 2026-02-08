import Notification from '../models/Notification.js';

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            userId: req.user._id,
            isRead: false,
        });

        res.status(200).json({
            success: true,
            data: notifications,
            unreadCount,
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
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            data: notification,
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
 * Helper to create a notification (internal use)
 */
export const createNotification = async (userId, message, type = 'system', dueDate = null) => {
    try {
        await Notification.create({ userId, message, type, dueDate });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

/**
 * @desc    Create test notification (for demo/testing)
 * @route   POST /api/notifications/test
 * @access  Private
 */
export const createTestNotification = async (req, res) => {
    try {
        await createNotification(req.user._id, req.body.message || 'Test Notification');
        res.status(201).json({ success: true, message: 'Notification created' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
