import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Only Admin can view logs
router.get('/', requireAdmin, getAuditLogs);

export default router;
