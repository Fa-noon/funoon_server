import express from 'express';
import {
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:id', protect, addComment);
router.patch('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
