import express from 'express';
import { createRating, getRatingSummary } from '../controllers/ratingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createRating);
router.get('/summary', getRatingSummary);

export default router;
