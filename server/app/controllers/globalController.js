import Post from './../models/postModel.js';
import User from './../models/userModel.js';
import catchAsync from '../helpers/catchAsync.js';
import AppError from './../helpers/appError.js';

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
  try {
    let allPosts = [];
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('Could not load feed at this moment', 400));
    }
    if (user.interests.length == 0) {
      const post = await Post.find()
        .populate('createdBy', 'name')
        .sort({ dateCreated: -1 });

      allPosts.push(post);
    } else {
      for (let i = 0; i < user.interests.length; i++) {
        const post = await Post.find({ tags: { $in: [user.interests[i]] } })
          .populate('createdBy', 'name')
          .sort({ dateCreated: -1 });
        if (post) {
          //destructuring required but not usefull(also return array) because [[],[]]
          allPosts.push(post);
        }
      }
    }
    //------------------------- (third) Last Step is to Add other posts which are not matched with interests------------------------
    const unInterestedPosts = await Post.find()
      .populate('createdBy', 'name')
      .sort({ dateCreated: -1 });
    if (unInterestedPosts) {
      allPosts.push(unInterestedPosts);
    }
    //-------------------------Destructuring-----------------------------
    let realPosts = [];
    for (let i = 0; i < allPosts.length; i++) {
      for (let j = 0; j < allPosts[i].length; j++) {
        realPosts.push(allPosts[i][j]);
      }
    }

    //-------------------------Remove Duplicates because 1 post can have multiple tags(interests)--------------------------
    const key = 'id';
    let uniquePosts = [
      ...new Map(realPosts.map((item) => [item[key], item])).values(),
    ];

    //-----------------------------Return the response-----------------------------------------------
    res.status(200).json({
      status: 'success',
      posts: uniquePosts,
      Total_posts: uniquePosts.length,
    });
  } catch (error) {
    return next(new AppError(error, 400));
  }
});
