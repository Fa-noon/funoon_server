import express from 'express';
import {
  uploadUserPhoto,
  deleteMe,
  getAllUsers,
  updateMe,
  getUser,
  updateUser,
  deleteUser,
  updateInterests,
} from '../controllers/userController.js';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, uploadUserPhoto, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(signup);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
router.post('/updateInterests', protect, updateInterests);

export default router;
