import express from 'express';
import {
  Search,
  unAuthFeed,
  authFeed,
} from '../controllers/globalController.js';
import { protect, forbid } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/search', Search);
router.get('/unAuthFeed', unAuthFeed);
router.get('/authFeed', protect, authFeed);

export default router;
