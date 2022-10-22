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
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
const __dirname = dirname(fileURLToPath(import.meta.url));

const multerStorage = multer.memoryStorage();
import AWS from 'aws-sdk';

const bucket_name = process.env.BUCKET_NAME;
const bucket_region = 'ap-south-1';
const bucket_access_key = 'ASIAY6H3SXS4UYTQC4GU';
const bucket_secret_access_key = 'yqRya+98u42tDP22o1X3ivm+o5d6I4Y3YI5JYMQ/';
const sessionToken =
  'IQoJb3JpZ2luX2VjELj//////////wEaCmFwLXNvdXRoLTEiRzBFAiB16cIwS7QqpKVzLD+H6rIHS+4c9A16AxPAmn2rZv7slQIhANCMRJR0s948ry1u0gbHzp1HaCEZX7Kair/NsNgPvJ+IKrECCJH//////////wEQABoMNjE0NzA3OTM2NDQxIgzViZOwFWSCL9VMTOwqhQKK9b0H8zePXAjLnNfNbU7xSL5J4QkjrFv3NllOtmTigwepzdY6Mj3A1VMjWShOCClGx180qoZLtrIWx7+lcernMOaNEIrsfCJjABY7YXGiWwUbyS08ka2uaJLIW+X5d0M5UwkRaSjGQlFAMpZakH9m1TfPRqtbGto35U+TW5f8GRXCcwVlctQ/LRy9cZ8NEzql5etkcqvGSQNGRWLYD0zJ8GYfWRtoM32KuYZXqesrp+qJyPqjpLNcmE6vJdkVwG3v7g2o2I3ArSAhcuFTKM/lgVS5iGmHsNcTLjv+KY3YGeQZzLfshbJfpOOfPgdnm/h2eQZ7mPDO54rAJbekj8sB0HSCE94wp6vQmgY6nQF/YI7QOyGXnT4e0LR6FD+wR3golhQaQjgqO6Xsn8QdXjsy/u9wtNREFAcG4ZNhHbWnPj6Fs/ZDzLx8LZuhZ4xRf1C6ImRINh2gVVd5YyhmNaqT1kDCQUqNEeG6ks70QL8Y+q4H5fMa9OgVVPV+zVlImdnsaaYR4DXU1gSN8/1Equ31e6OBXDzhaz3NcsnIW1ytymH7PCjW6zmVDMmB';

const s3 = new S3Client({
  credentials: {
    accessKeyId: bucket_access_key,
    secretAccessKey: bucket_secret_access_key,
    sessionToken: sessionToken,
  },
  region: bucket_region,
});

AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: 'ASIAY6H3SXS4UYTQC4GU',
  secretAccessKey: 'yqRya+98u42tDP22o1X3ivm+o5d6I4Y3YI5JYMQ/',
  sessionToken:
    'IQoJb3JpZ2luX2VjELj//////////wEaCmFwLXNvdXRoLTEiRzBFAiB16cIwS7QqpKVzLD+H6rIHS+4c9A16AxPAmn2rZv7slQIhANCMRJR0s948ry1u0gbHzp1HaCEZX7Kair/NsNgPvJ+IKrECCJH//////////wEQABoMNjE0NzA3OTM2NDQxIgzViZOwFWSCL9VMTOwqhQKK9b0H8zePXAjLnNfNbU7xSL5J4QkjrFv3NllOtmTigwepzdY6Mj3A1VMjWShOCClGx180qoZLtrIWx7+lcernMOaNEIrsfCJjABY7YXGiWwUbyS08ka2uaJLIW+X5d0M5UwkRaSjGQlFAMpZakH9m1TfPRqtbGto35U+TW5f8GRXCcwVlctQ/LRy9cZ8NEzql5etkcqvGSQNGRWLYD0zJ8GYfWRtoM32KuYZXqesrp+qJyPqjpLNcmE6vJdkVwG3v7g2o2I3ArSAhcuFTKM/lgVS5iGmHsNcTLjv+KY3YGeQZzLfshbJfpOOfPgdnm/h2eQZ7mPDO54rAJbekj8sB0HSCE94wp6vQmgY6nQF/YI7QOyGXnT4e0LR6FD+wR3golhQaQjgqO6Xsn8QdXjsy/u9wtNREFAcG4ZNhHbWnPj6Fs/ZDzLx8LZuhZ4xRf1C6ImRINh2gVVd5YyhmNaqT1kDCQUqNEeG6ks70QL8Y+q4H5fMa9OgVVPV+zVlImdnsaaYR4DXU1gSN8/1Equ31e6OBXDzhaz3NcsnIW1ytymH7PCjW6zmVDMmB',
});

const s33 = new AWS.S3();

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

export const upload = multer({
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

//---------------------------------------S3 TEST----------------------------------------
export const s3Test = catchAsync(async (req, res, next) => {
  console.log('req.body', req.body);
  console.log('req.file', req.file);
  console.log(generateFileName());
  //req.file.buffer stores the actual image....
  //------------------------------better approach----------------------------------
  const params = {
    Bucket: 'cyclic-real-wear-clam-ap-south-1',
    Key: 'Numan',
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  //--------------------cyclic approach---------------------------------------------
  // store something
  // const params = {
  //   Body: req.file.buffer,
  //   Bucket: 'cyclic-real-wear-clam-ap-south-1',
  //   Key: 'Numan',
  //   ContentType: req.file.mimetype,
  // };
  // s33.putObject(params, (err, data) => {
  //   if (err) {
  //     console.log('Error,', err);
  //   } else {
  //     console.log('success');
  //   }
  // });
  // get it back
  // let my_file = await s33
  //   .getObject({
  //     Bucket: 'cyclic-real-wear-clam-ap-south-1',
  //     Key: 'Numan',
  //   })
  //   .promise();

  // console.log(JSON.parse(my_file));

  res.send({});
});
