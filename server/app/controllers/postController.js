import AppError from './../helpers/appError';
import Post from './../models/postModel';
import User from './../models/userModel';
import APIFeatures from '../helpers/APIfeatures.js';
import catchAsync from '../helpers/catchAsync';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import multer from 'multer';
import sharp from 'sharp';

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

exports.uploadUserPhoto = upload.array('images', 10);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./../images/${req.file.filename}`);

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

exports.createPost = catchAsync(async (req, res, next) => {
  const id = getId(req.headers.authorization);
  const images = [];
  if (req.files) {
    req.files.forEach((el) => {
      images.push(el.originalname);
    });
  }

  const newPost = await Post.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    createdBy: id,
    images: images,
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
