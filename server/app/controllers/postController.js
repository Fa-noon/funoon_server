import AppError from './../helpers/appError';
import Post from './../models/postModel';
import User from './../models/userModel';
import APIFeatures from '../helpers/APIfeatures.js';
import catchAsync from '../helpers/catchAsync';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import multer from 'multer';

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

exports.uploadTourImages = upload.fields([
  { name: 'images', maxCount: 10 },
]);

// ---------------------Create Post-------------------------------------------

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    images: req.body.images,
    createdBy: req.body.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: newPost,
    },
  });
});

// ---------------------Get Post-------------------------------------------

exports.getPost = catchAsync(async (req, res, next) => {
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

exports.updatePost = catchAsync(async (req, res, next) => {
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

exports.deletePost = catchAsync(async (req, res, next) => {
  const deletedPost = await Post.findByIdAndDelete(req.params.id);

  if (!deletedPost) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
