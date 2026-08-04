import express from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from '../controllers/productController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/', requireAuth, requireRole('supplier'), createProduct);
router.put('/:id', requireAuth, requireRole('supplier'), updateProduct);
router.delete('/:id', requireAuth, requireRole('supplier'), deleteProduct);
router.patch('/:id/stock', requireAuth, requireRole('supplier'), updateStock);

export default router;