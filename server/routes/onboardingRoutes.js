import express from 'express';
import { submitBuyerOnboarding, submitSupplierOnboarding } from '../controllers/onboardingController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/buyer', requireAuth, requireRole('buyer'), submitBuyerOnboarding);
router.post('/supplier', requireAuth, requireRole('supplier'), submitSupplierOnboarding);

export default router;