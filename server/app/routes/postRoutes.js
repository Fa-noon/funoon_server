import express from 'express';
import {uploadUserPhoto,createPost,updatePost,getPost,deletePost,likePost,getAllPosts,postSearch} from '../controllers/postController.js';
import {protect,forbid} from "../middlewares/authMiddleware.js"


const router = express.Router();

router.post('/createPost', protect,uploadUserPhoto, createPost);
router.route('/').get(getAllPosts);
router.get('/search', postSearch);

router
  .get('/:id', getPost)
  .patch('/:id', protect,forbid, updatePost)
  .delete('/:id', protect,forbid, deletePost)
  .put("/like",protect,likePost);

  

export default router;
