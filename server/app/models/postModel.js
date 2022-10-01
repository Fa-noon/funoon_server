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
  comments: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  shares: {
    type: Number,
    default: 0,
  },

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
