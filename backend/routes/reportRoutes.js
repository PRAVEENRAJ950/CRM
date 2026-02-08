import express from 'express';
import {
    exportReportPDF,
    getSalesPerformance,
    getLeadConversion,
    getDealPipeline,
    getCampaignPerformance,
    exportReportExcel
} from '../controllers/reportController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireManager } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireManager); // Admin & Manager only

router.get('/sales-performance', getSalesPerformance);
router.get('/lead-conversion', getLeadConversion);
router.get('/deal-pipeline', getDealPipeline);
// [NEW]
router.get('/campaign-performance', getCampaignPerformance);
router.get('/export/excel', exportReportExcel);
router.get('/export/pdf', exportReportPDF);

export default router;
