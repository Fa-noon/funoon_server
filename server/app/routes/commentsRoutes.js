import express from 'express';
import { addComment, updateComment } from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:id', protect, addComment);
router.patch('/:id', protect, updateComment);

export default router;
