import Post from './../models/postModel.js';
import User from './../models/userModel.js';
import catchAsync from '../helpers/catchAsync.js';

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
