const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let { SALT_ROUND } = process.env;
SALT_ROUND = parseInt(SALT_ROUND);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username cannot be empty'],
    unique: true,
    lowercase: true,
    trim: true,
    min: 6,
    max: 25,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (pass) {
        if (pass.length < 9) throw new Error(`Password Length should be more than 8, found ${pass.length}`);
      }
    }
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: "",
  },
  followers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: [],
  },
  following: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: [],
  },
  lastLoginIn: {
    type: Date,
  },
}, {
  timestamps: true,
});

/* Middleware functions on schema */

/* Performing operations before save */
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, SALT_ROUND);
  }

  next();
});

module.exports = mongoose.model('User', UserSchema);