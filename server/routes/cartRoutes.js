import express from 'express';
import { getCart, addItem, updateItem, removeItem, attachUserIfPresent } from '../controllers/cartController.js';

const router = express.Router();

// Every cart route is public (works for guests) but auth-aware — if a valid
// token cookie is present, it resolves to that user's cart instead of a guest cart.
router.use(attachUserIfPresent);

router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:productId', updateItem);
router.delete('/items/:productId', removeItem);

export default router;