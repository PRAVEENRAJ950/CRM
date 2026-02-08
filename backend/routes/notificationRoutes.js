import express from 'express';
import { getNotifications, markAsRead, createTestNotification } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.post('/test', createTestNotification); // For testing connection

export default router;
