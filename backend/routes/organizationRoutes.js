import express from 'express';
import { getOrganization, updateOrganization } from '../controllers/organizationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin, requireManager } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireManager, getOrganization);
router.put('/', requireAdmin, updateOrganization);

export default router;
