import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import User from './userModel.js';
const { ObjectId } = mongoose.Schema;

//------------------------Comment Schema-------------------------

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
  },
});

//------------------------------------Post Schema---------------------------

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: { type: Number, default: 0 },
  likesIDs: [{ type: ObjectId, ref: 'User' }],
  // a blog post can have multiple comments, so it should be in a array.
  // all comments info should be kept in this array of this blog post.
  comments: [commentSchema],
  shares: {
    type: Number,
    default: 0,
  },
  sharesIDs: [{ type: ObjectId, ref: 'User' }],

  isSold: {
    type: Boolean,
    default: false,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },

  images: {
    type: [String],
    required: true,
  },
  imagesUrls: {
    type: [String],
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  createdBy: {
    type: ObjectId,
    ref: 'User',
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
