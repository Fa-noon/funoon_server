import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import User from './userModel.js';
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {type: Number, default: 0 },
  likesIDs: [{ type: ObjectId, ref: "User" }],
 // a blog post can have multiple comments, so it should be in a array.
 // all comments info should be kept in this array of this blog post.
  comments: [{
      type: ObjectId,
      ref: 'Comment'
  }],
  shares: {
    type: Number,
    default: 0,
  },
  sharesIDs: [{ type: ObjectId, ref: "User" }],

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
  price: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
  },
  createdBy: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
