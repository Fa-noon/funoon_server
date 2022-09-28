import express from 'express';
const router = express.Router();
//import controllers
import { login, register } from 'controllers/user';
//import validators and middlewares
const {
  requireSignin,
  authMiddleware,
  verifyToken,
} = require('middlewares/auth');

//routes
router.post('/login', login);
router.post('/register', register);

module.exports = router;
