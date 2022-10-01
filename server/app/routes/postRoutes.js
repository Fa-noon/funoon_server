const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const authMiddleware = require("middlewares/authMiddleware")


const router = express.Router();

router.post('/createPost', authMiddleware.protect,postController.uploadUserPhoto, postController.createPost);

router
  .get('/:id', postController.getPost)
  .patch('/:id', authMiddleware.protect,authMiddleware.forbid, postController.updatePost)
  .delete('/:id', authMiddleware.protect,authMiddleware.forbid, postController.deletePost)
  .put("/like",authMiddleware.protect,postController.likePost);

module.exports = router;
