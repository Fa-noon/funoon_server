const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require("middlewares/authMiddleware")

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authMiddleware.protect,
  authController.updatePassword
);

router.patch('/updateMe', authMiddleware.protect,userController.uploadUserPhoto, userController.updateMe);
router.delete('/deleteMe', authMiddleware.protect, userController.deleteMe);

router.route('/').get(userController.getAllUsers).post(authController.signup);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
