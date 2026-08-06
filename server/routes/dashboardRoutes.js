import express from 'express';
import { getBuyerDashboard, getSupplierDashboard } from '../controllers/dashboardController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/buyer', requireAuth, requireRole('buyer'), getBuyerDashboard);
router.get('/supplier', requireAuth, requireRole('supplier'), getSupplierDashboard);

export default router;