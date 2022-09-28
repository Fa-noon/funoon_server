import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'User',
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// // virtual fields
// userSchema
//   .virtual('password')
//   .set(function (password) {
//     // create temp variable called _password
//     this._password = password;
//     // generate salt
//     this.salt = this.makeSalt();
//     // encrypt password
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });

// // methods > authenticate, encryptPassword, makeSalt
// userSchema.methods = {
//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },

//   encryptPassword: function (password) {
//     if (!password) return '';
//     try {
//       return crypto
//         .createHmac('sha1', this.salt)
//         .update(password)
//         .digest('hex');
//     } catch (err) {
//       return '';
//     }
//   },

//   makeSalt: function () {
//     return Math.round(new Date().valueOf() * Math.random()) + '';
//   },
// };
// export user model

module.exports = mongoose.model('User', userSchema);
