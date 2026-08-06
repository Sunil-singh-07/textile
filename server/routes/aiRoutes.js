import express from 'express';
import { chat } from '../controllers/aiController.js';
import { attachUserIfPresent } from '../controllers/cartController.js';

const router = express.Router();

router.post('/chat', attachUserIfPresent, chat);

export default router;