import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getIncomingOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('buyer'), placeOrder);
router.get('/mine', requireAuth, requireRole('buyer'), getMyOrders);
router.get('/incoming', requireAuth, requireRole('supplier'), getIncomingOrders);
router.get('/:id', requireAuth, getOrder); // ownership checked inside controller, either role allowed
router.patch('/:id/status', requireAuth, requireRole('supplier'), updateOrderStatus);

export default router;