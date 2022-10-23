import express from 'express';
import {
  uploadPostImages,
  createPost,
  updatePost,
  getPost,
  deletePost,
  likePost,
  getAllPosts,
  sharePost,
  getAlltags,
  resizePostimages,
  upload,
  //s3Test,
} from '../controllers/postController.js';
import { protect, forbid } from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.post(
//   '/createPost',
//   protect,
//   uploadPostImages,
//   resizePostimages,
//   createPost
// );
router.post(
  '/createPost',
  protect,
  uploadPostImages,
  resizePostimages,
  createPost
);
router.route('/').get(getAllPosts);
router.put('/share', protect, sharePost);
router.get('/tags', getAlltags);

router
  .get('/:id', getPost)
  .patch('/:id', protect, forbid, updatePost)
  .delete('/:id', protect, forbid, deletePost)
  .put('/like', protect, likePost);

export default router;
