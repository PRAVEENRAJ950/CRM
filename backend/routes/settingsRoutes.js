import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getSettings);
router.put('/', requireAdmin, updateSettings);

export default router;
