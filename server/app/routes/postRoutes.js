const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/createPost', authController.protect,postController.uploadUserPhoto, postController.createPost);

router
  .get('/:id', postController.getPost)
  .patch('/:id', authController.protect,authController.forbid, postController.updatePost)
  .delete('/:id', authController.protect,authController.forbid, postController.deletePost);

module.exports = router;
