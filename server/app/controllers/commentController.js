import Post from './../models/postModel.js';
import User from './../models/userModel.js';
import catchAsync from '../helpers/catchAsync.js';
import AppError from './../helpers/appError.js';

//----------------------- Add new comment -----------------------------

export const addComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const { body } = req.body;
  Post.findByIdAndUpdate({ _id: postId }, { upsert: true, new: true }).exec(
    (err, post) => {
      if (err) {
        return next(new AppError('Could not find any post', 400));
      }
      post.comments.push({ body: body, createdBy: userId });
      post.save((err) => {
        if (err) {
          return next(new AppError('Could not add new comment', 400));
        }
        res.status(200).json({
          status: 'success',
          post: post,
        });
      });
    }
  );
});

//----------------------- update comment -----------------------------

export const updateComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const { commentId, body } = req.body;
  Post.findByIdAndUpdate({ _id: postId }, { upsert: true, new: true }).exec(
    (err, post) => {
      if (err) {
        return next(new AppError('Could not find any post', 400));
      }
      const oldComment = post.comments.id(commentId);
      if (!oldComment.createdBy == userId) {
        return next(new AppError('You cannot update this comment', 400));
      }
      oldComment.body = body;
      post.save((err) => {
        if (err) {
          return next(new AppError('Could not update the comment', 400));
        }
        res.status(200).json({
          status: 'success',
          post: post,
        });
      });
    }
  );
});

//----------------------- delete comment -----------------------------

export const deleteComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const { commentId } = req.body;
  Post.findByIdAndUpdate({ _id: postId }, { upsert: true, new: true }).exec(
    (err, post) => {
      if (err) {
        return next(new AppError('Could not find any post', 400));
      }
      const oldComment = post.comments.id(commentId);
      if (!oldComment.createdBy == userId) {
        return next(new AppError('You cannot delete this comment', 400));
      }
      oldComment.remove();
      post.save((err) => {
        if (err) {
          return next(new AppError('Could not update the comment', 400));
        }
        res.status(200).json({
          status: 'success',
          post: post,
        });
      });
    }
  );
});
