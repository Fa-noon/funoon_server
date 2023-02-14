import AppError from './../helpers/appError.js';
import User from './../models/userModel.js';
import catchAsync from './../helpers/catchAsync.js';
import multer from 'multer';
import sharp from 'sharp';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import Post from '../models/postModel.js';

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import AWS from 'aws-sdk';
import { urlGenerator } from '../helpers/urlGenerator.js';
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

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${__dirname}/../images/user/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
//--------------------------Get All Users------------------------
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

//--------------------------Update Current User------------------------
export const updateMe = catchAsync(async (req, res, next) => {
  // const s3 = new S3Client({
  //   credentials: {
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //     sessionToken: process.env.AWS_SESSION_TOKEN,
  //   },
  //   region: process.env.AWS_REGION,
  // });

  // AWS.config.update({
  //   region: process.env.AWS_REGION,
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   sessionToken: process.env.AWS_SESSION_TOKEN,
  // });

  // // console.log('req.body', req.body);
  // console.log('req.file', req.file);
  // console.log(generateFileName());

  //req.file.buffer stores the actual image....
  //-------------------------------------Resize Images---------------------------------------
  // const buffer = await sharp(req.file.buffer)
  //   .resize({ height: 1080, width: 1350, fit: 'contain' })
  //   .toBuffer();
  //------------------------------better approach----------------------------------
  // const params = {
  //   Bucket: process.env.BUCKET_NAME,
  //   Key: req.file.originalname + Date.now(),
  //   Body: buffer,
  //   ContentType: req.file.mimetype,
  // };

  // const putCommand = new PutObjectCommand(params);
  // await s3.send(putCommand);

  // // 1) create error if user posts password data
  if (req.body.password) {
    return next(
      new AppError(
        'This route is not for password updates Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  if (req.file) filteredBody.photo = req.file.originalname;

  // 2) simply update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});
//--------------------------Delete Current User------------------------
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    isActive: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
//--------------------------Delete User ny id------------------------
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
//--------------------------Get User ny id------------------------
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'status',
    requestTime: req.requsetTime,
    data: { user },
  });
});
//--------------------------Update User by id------------------------
export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

//----------------------------------Update Interests------------------------------
export const updateInterests = catchAsync(async (req, res, next) => {
  const { interests } = req.body;
  User.findByIdAndUpdate(req.user.id, { upsert: true, new: true }).exec(
    (err, user) => {
      if (err || !user || !interests) {
        return next(new AppError('Sorry, cannot update interests', 404));
      }
      if (interests.length < 3) {
        return next(new AppError('Please add 3 or more than 3 interests', 404));
      }
      user.isInterested = true;
      user.interests = interests;
      user.save((err) => {
        if (err) {
          console.log(err);
          return next(new AppError('Sorry, cannot update interests', 400));
        }
        res.status(200).json({
          status: 'success',
          user: user,
        });
      });
    }
  );
});

//----------------------------------My Profile----------------------------------------

export const myProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return next(new AppError('Sorry, cannot find profile', 404));
    }
    Post.find({ createdBy: userId }).exec((err, posts) => {
      if (err) {
        return next(new AppError('Sorry, cannot find profile', 404));
      }
      res.status(200).json({
        status: 'success',
        User: user,
        Posts: posts,
      });
    });
  });
});

//----------------------------------User Profile----------------------------------------

export const userProfile = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return next(new AppError('Sorry, cannot find profile', 404));
    }
    Post.find({ createdBy: userId }).exec((err, posts) => {
      if (err) {
        return next(new AppError('Sorry, cannot find profile', 404));
      }
      res.status(200).json({
        status: 'success',
        User: user,
        Posts: posts,
      });
    });
  });
});
