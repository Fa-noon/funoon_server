import mongoose, { Schema } from 'mongoose';
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    text: {
      type: String,
      trim: true,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    createdBy:{
     type: ObjectId,
     ref: 'User',
    },
// Each comment can only relates to one blog, so it's not in array
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
 })

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;