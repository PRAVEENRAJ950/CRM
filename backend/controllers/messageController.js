import Message from '../models/Message.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user._id;

        if (!receiverId || !message) {
            return res.status(400).json({
                success: false,
                message: 'Receiver and message content are required',
            });
        }

        // Verify receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'Receiver not found',
            });
        }

        // Feature 6: Restricted Messaging Rules
        // Customers can ONLY send messages to Support or Sales (Exec/Manager).
        // They cannot message other customers.
        // They cannot message 'System Admin' directly unless initiated by Admin.
        if (req.user.role === 'Customer') {
            const allowedRoles = ['Sales Executive', 'Support Executive', 'Sales Manager'];
            const isAllowedRole = allowedRoles.includes(receiver.role);

            // Check if messaging Admin
            if (receiver.role === 'System Admin') {
                // Check if Admin initiated conversation
                const existingThread = await Message.findOne({ senderId: receiverId, receiverId: senderId });
                if (!existingThread) {
                    return res.status(403).json({
                        success: false,
                        message: 'You cannot initiate a message with System Admin.',
                    });
                }
            } else if (!isAllowedRole) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only message Sales or Support staff.',
                });
            }
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        // Create Notification for Receiver
        await createNotification(
            receiverId,
            `New message from ${req.user.name}`,
            'message'
        );

        res.status(201).json({
            success: true,
            data: newMessage,
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
 * @desc    Get conversation with a specific user
 * @route   GET /api/messages/:userId
 * @access  Private
 */
export const getMessages = async (req, res) => {
    try {
        const { userId: otherUserId } = req.params;
        const currentUserId = req.user._id;

        // Fetch messages between current user and other user
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ],
        })
            .sort({ createdAt: 1 }) // Oldest first
            .populate('senderId', 'name email role')
            .populate('receiverId', 'name email role');

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages,
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
 * @desc    Get list of users who have chatted with the current user OR all users available to chat
 * @route   GET /api/messages/users
 * @access  Private
 */
export const getChatUsers = async (req, res) => {
    try {
        // Return list of available users to chat with.
        // For simplicity:
        // - If Admin/Sales/Support: Return all Users (or maybe filter out other Admins?)
        // - If Customer: Return Sales Managers, Sales Execs, Support Execs.

        const currentUser = req.user;
        let query = {};

        if (currentUser.role === 'Customer') {
            query = { role: { $in: ['Sales Manager', 'Sales Executive', 'Support Executive'] } };
        } else {
            // Staff can chat with everyone (Customers and other Staff)
            query = { _id: { $ne: currentUser._id } };
        }

        const users = await User.find(query).select('name email role status');

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
}
