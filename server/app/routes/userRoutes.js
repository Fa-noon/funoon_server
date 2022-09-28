
const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

//----------------------------------------------------------------
//import express from 'express';
// const router = express.Router();

// //import controllers
// import { authController } from './../controllers/authController';
// //import validators and middlewares
// const {
//   requireSignin,
//   authMiddleware,
//   verifyToken,
// } = require('middlewares/auth');

// //routes
// router.post('/login', authController.login);
// //router.post('/register', register);

// module.exports = router;
