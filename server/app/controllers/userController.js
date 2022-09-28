const AppError = require('./../helpers/appError');
const User = require('./../models/userModel');
const APIFeatures = require('../helpers/APIfeatures.js');
const catchAsync = require('./../helpers/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

//--------------------------Get All User ------------------------
exports.getAllUsers = catchAsync(async (req, res) => {
  //3-Exececuting Query
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limit()
    .page();

  const user = await features.query;

  res.status(200).json({
    status: 'status',
    requestTime: req.requsetTime,
    results: user.length,
    data: { user },
  });
});
//--------------------------Update Current User------------------------
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

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
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    isActive: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
//--------------------------Delete User ny id------------------------
exports.deleteUser = catchAsync(async (req, res, next) => {
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
exports.getUser = catchAsync(async (req, res, next) => {
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
//--------------------------Update User ny id------------------------
exports.updateUser = catchAsync(async (req, res, next) => {
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
