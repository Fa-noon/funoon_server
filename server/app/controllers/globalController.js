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

//-------------------------------------- Un Auth Feed ------------------------------------------------
export const unAuthFeed = catchAsync(async (req, res, next) => {
  Post.find()
    .populate('createdBy', 'name')
    .sort({ dateCreated: -1 })
    .exec((err, posts) => {
      if (err) {
        return next(new AppError('Could not load feed at this moment', 400));
      }
      res.status(200).json({
        status: 'success',
        posts,
        Total_posts: posts.length,
      });
    });
});

//-------------------------------------- Auth Feed ------------------------------------------------
export const authFeed = catchAsync(async (req, res, next) => {
  let allPosts = [];
  User.findById(req.user.id).exec((err, user) => {
    if (err || !user) {
      return next(new AppError('Could not load feed at this moment', 400));
    }
    if (user.interests.length == 0) {
      Post.find()
        .populate('createdBy', 'name')
        .sort({ dateCreated: -1 })
        .exec((err, posts) => {
          if (err) {
            return next(
              new AppError('Could not load feed at this moment', 400)
            );
          }
          allPosts = posts;
        });
    } else {
      for (let i = 0; i < user.interests.length; i++) {
        Post.find({ tags: { $in: [user.interests[i]] } })
          .populate('createdBy', 'name')
          .sort({ dateCreated: -1 })
          .exec((err, posts) => {
            if (err) {
              return next(
                new AppError('Could not load feed at this moment', 400)
              );
            }
            console.log(user.interests[i]);
            console.log(posts);
            allPosts = [...allPosts, posts];
          });
      }
    }
  });
  res.status(200).json({
    status: 'success',
    allPosts,
    Total_posts: allPosts.length,
  });
});
