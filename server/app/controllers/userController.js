// import User from './../models/userModel';
// const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');

// //---------------------------------------- Register -------------------------------------------
// const register = (req, res) => {
//   //console.log("reg con",req.body);
//   const { firstName, lastName, email, password, phone, address } = req.body;
//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: 'Email is taken',
//       });
//     }
//     //new user
//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password,
//       phone,
//       address,
//     });
//     newUser.save((err, result) => {
//       if (err) {
//         return res.status(401).json({
//           error: 'Error saving user in database. Try later',
//         });
//       }
//       return res.json({
//         message: 'Registration success. Please login.',
//       });
//     });
//   });
// };
// //---------------------------------------- Login -------------------------------------------

// const login = (req, res) => {
//   const { email, password } = req.body;
//   // console.table({ email, password });
//   User.findOne({ email }).exec((err, user) => {
//     if (err || !user) {
//       return res.status(400).json({
//         error: 'User with that email does not exist. Please register.',
//       });
//     }
//     // authenticate
//     if (!user.password == password) {
//       return res.status(400).json({
//         error: 'Email and password do not match',
//       });
//     }
//     // generate token and send to client
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });
//     const { _id, name, email, role } = user;

//     return res.json({
//       token,
//       user: { _id, name, email, role },
//     });
//   });
// };
// module.exports = {
//   register,
//   login,
// };
