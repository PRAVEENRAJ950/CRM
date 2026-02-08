import express from 'express';
import { sendMessage, getMessages, getChatUsers } from '../controllers/messageController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', sendMessage);
router.get('/users', getChatUsers); // Helper to get list of people to chat with
router.get('/:userId', getMessages);

export default router;
