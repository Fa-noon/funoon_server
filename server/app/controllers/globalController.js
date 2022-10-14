import Post from './../models/postModel.js';
import User from './../models/userModel.js';
import catchAsync from '../helpers/catchAsync.js';

//----------------------- Search -----------------------------

export const Search = catchAsync(async (req, res, next) => {
  const SearchQuery = '(?i)' + req.query.search;
  User.find({ name: { $regex: SearchQuery } }).exec((err, users) => {
    if (err) {
      return next(new AppError('Could not search users', 400));
    }
    Post.find({
      $or: [
        { title: { $regex: SearchQuery } },
        { tags: { $regex: SearchQuery } },
      ],
    }).exec((err, posts) => {
      if (err) {
        return next(new AppError('Could not search users', 400));
      }
      res.status(200).json({
        status: 'success',
        posts,
        users,
      });
    });
  });
});
