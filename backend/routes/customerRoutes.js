import express from 'express';
import { getCustomers, createCustomer } from '../controllers/customerController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCustomers);
router.post('/', createCustomer);

export default router;
