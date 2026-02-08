import express from 'express';
import {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignStats
} from '../controllers/campaignController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin, requireMarketing } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCampaigns);
router.get('/:id', getCampaign);
router.get('/:id/stats', getCampaignStats);

// Protected routes (Marketing & Admin)
router.post('/', requireMarketing, createCampaign);
router.put('/:id', requireMarketing, updateCampaign);
router.delete('/:id', requireAdmin, deleteCampaign);

export default router;
