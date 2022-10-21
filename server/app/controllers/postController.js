import AppError from './../helpers/appError.js';
import Post from './../models/postModel.js';
import User from './../models/userModel.js';
import APIFeatures from '../helpers/APIfeatures.js';
import catchAsync from '../helpers/catchAsync.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import sharp from 'sharp';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadPostImages = upload.fields([
  { name: 'images', maxCount: 10 },
]);

export const resizePostimages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `post-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(1080, 1350)
        .toFormat('jpeg')
        .jpeg({ quality: 70 })
        .toFile(`${__dirname}/../images/posts/${filename}`);
      req.body.images.push(filename);
    })
  );

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getId = (tokken) => {
  var decoded = jwt.verify(tokken.split(' ')[1], process.env.JWT_SECRET);
  return decoded['id'];
};
// ---------------------Create Post-------------------------------------------

export const createPost = catchAsync(async (req, res, next) => {
  const id = getId(req.headers.authorization);

  const newPost = await Post.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    createdBy: id,
    images: req.body.images,
    tags: req.body.tags,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: newPost,
    },
  });
});

// ---------------------Get Post-------------------------------------------

export const getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'status',
    requestTime: req.requsetTime,
    data: { post },
  });
});
// ---------------------Update Post-------------------------------------------

export const updatePost = catchAsync(async (req, res, next) => {
  const newPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newPost) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: newPost,
    },
  });
});

// ---------------------Delete Post-------------------------------------------

export const deletePost = catchAsync(async (req, res, next) => {
  const deletedPost = await Post.findByIdAndDelete(req.params.id);

  if (!deletedPost) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//-------------------------------- Like and Dislike Post -----------------------------------------

export const likePost = (req, res, next) => {
  const { postId } = req.body;
  Post.findById(postId).exec((err, result) => {
    if (err) {
      return next(new AppError('Could not update like count', 400));
    }
    if (!result.likesIDs.includes(req.user.id)) {
      //if user has not liked the post. Like it
      Post.findByIdAndUpdate(
        postId,
        { $inc: { likes: 1 }, $push: { likesIDs: req.user.id } },
        { upsert: true, new: true }
      ).exec((err, result) => {
        if (err) {
          return next(new AppError('Could not update like count', 400));
        }
        res.status(200).json({
          status: 'success',
          data: result,
        });
      });
    } else {
      //if user has liked the post. Dislike it
      Post.findByIdAndUpdate(
        postId,
        { $inc: { likes: -1 }, $pull: { likesIDs: req.user.id } },
        { upsert: true, new: true }
      ).exec((err, result) => {
        if (err) {
          return next(new AppError('Could not update like count', 400));
        }
        res.status(200).json({
          status: 'success',
          data: result,
        });
      });
    }
  });
};

//--------------------------Get All Posts------------------------

export const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  if (!posts) {
    return next(new AppError('Could not find any post', 400));
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

//-------------------------------- Share Post -----------------------------------------

export const sharePost = (req, res, next) => {
  const { postId } = req.body;
  Post.findById(postId).exec((err, result) => {
    if (err) {
      return next(new AppError('Could not update share count', 400));
    }
    if (!result.sharesIDs.includes(req.user.id)) {
      //if user has not shared the post. Share it
      Post.findByIdAndUpdate(
        postId,
        { $inc: { shares: 1 }, $push: { sharesIDs: req.user.id } },
        { upsert: true, new: true }
      ).exec((err, result) => {
        if (err) {
          return next(new AppError('Could not update share count', 400));
        }
        res.status(200).json({
          status: 'success',
          data: result,
        });
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: result,
      });
    }
  });
};

//--------------------------Get All tags------------------------

export const getAlltags = catchAsync(async (req, res, next) => {
  const tags = await Post.find().distinct('tags');
  if (!tags) {
    return next(new AppError('Could not find any tag', 400));
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tags.length,
    data: {
      tags,
    },
  });
});
