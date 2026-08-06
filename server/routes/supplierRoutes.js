import express from 'express';
import { getPublicSupplierProfile, getMyProfile, updateMyProfile } from '../controllers/supplierController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// IMPORTANT: /me must come before /:id, otherwise Express matches "me" as
// an :id param and getPublicSupplierProfile fails on an invalid ObjectId.
router.get('/me', requireAuth, requireRole('supplier'), getMyProfile);
router.put('/me', requireAuth, requireRole('supplier'), updateMyProfile);
router.get('/:id', getPublicSupplierProfile);

export default router;