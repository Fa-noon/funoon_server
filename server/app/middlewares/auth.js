import expressJwt from 'express-jwt';
import { User } from 'models';
// import { searchToken } from 'lib/redis';

//--------------------------------Require Signin Middleware------------------------------------------

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['sha1', 'RS256', 'HS256'],
}); // req.user

//------------------------------------Auth Middleware--------------------------------------

const authMiddleware = async (req, res, next) => {
  const authUserId = req.user.id;
  const user = await User.findOne({ where: { id: authUserId } });
  if (!user) {
    return res.status(400).json({
      error: 'Invalid Token, User not found',
    });
  }
  req.profile = user;
  next();
};
//--------------------------------------------SUPER-ADMIN MIDDLEWARE---------------------------------
const adminMiddleware = async (req, res, next) => {
  const adminUserId = req.user.id;
  const checkSuperAdmin = await User.findOne({ where: { id: adminUserId } });
  if (!checkSuperAdmin) {
    return res.status(400).json({
      error: 'Invalid Token, User not found',
    });
  }
  if (checkSuperAdmin.role !== 'Super-Admin') {
    return res.status(400).json({
      error: 'Super-Admin resource. Access denied',
    });
  }

  req.profile = checkSuperAdmin;
  next();
};
//---------------------------------------------Verify Token-------------------------------------------
// const verifyToken = async (req, res, next) => {
//   const Token = req.header('Authorization').replace('Bearer ', '');
//   if (!Token) {
//     return res.status(403).send({
//       Error: 'Token is not provided!',
//     });
//   }
//   try {
//     const Tokens = await searchToken(Token);
//     console.log('Tokens: ', Tokens);
//     if (Tokens.length > 0) {
//       return res.status(401).json({
//         Error: 'Token Expired',
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   next();
// };

module.exports = {
  authMiddleware,
  requireSignin,
  adminMiddleware,
};
