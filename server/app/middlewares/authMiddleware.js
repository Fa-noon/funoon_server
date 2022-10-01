import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from './../models/userModel.js';
import catchAsync from './../helpers/catchAsync.js';
import AppError from './../helpers/appError.js';

const getId = (tokken) => {
  var decoded = jwt.verify(tokken.split(' ')[1], process.env.JWT_SECRET);
  return decoded['id'];
};
//-------------------------------Protect---------------------------------------

export const protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
  
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
  
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfterTokenIssue(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }
  
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  });
  
  //-------------------------------Restriction---------------------------------------
  
  export const restrictTo = (...roles) => {
    return (req, res, next) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
  
      next();
    };
  };
  //-------------------------------Forbid---------------------------------------
  
  export const forbid = catchAsync(async (req, res, next) => {
    const id = getId(req.headers.authorization);
  
    const user = await User.findById(id);
  
    if (!user) {
      return next(new AppError('No post found with that ID', 404));
    }
  
    if (user.id !== id) {
      return next(new AppError('You do not own this post', 403));
    }
  
    req.body.id = id;
  
    next();
  });
  
