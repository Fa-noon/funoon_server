import express from 'express';
import { addComment } from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:id', protect, addComment);

export default router;
