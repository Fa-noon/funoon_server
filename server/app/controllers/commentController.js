import Post from './../models/postModel.js';
import User from './../models/userModel.js';
import catchAsync from '../helpers/catchAsync.js';


//----------------------- Search -----------------------------

export const addComment = catchAsync(async(req,res,next)=>{
   res.send("added!")
   }) 