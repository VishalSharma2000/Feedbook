const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let { SALT_ROUND, JWT_VERIFY_KEY } = process.env;
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
  bio: {
    type: String,
    default: "",
    maxLength: 50,
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
  address: {
    addLine1: String,
    city: String,
    country: String,
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  tokens: [{
    type: String,
    required: true,
  }]
}, {
  timestamps: true,
});

/* Middleware functions on schema */
/* When we want to use the data of the instance then we should define the method as methods but when we want to search in the collection and it has not relation with the instance then we can define static method */

/* Methods */
UserSchema.methods.toJSON = function () {
  /* Converting from User instance to normal object */
  const user = this.toObject();

  /* Deleting sensitive data of the user */
  delete user.password;
  delete user.lastLoginIn;

  return user;
};

/* Statics */
UserSchema.statics.findByCredentials = async function (email, password) {
  const User = this;

  let user = undefined;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    console.log('Error while fetching user ' + error);
    throw new Error({ status: 500, msg: 'Some server error' + error });
  }

  if (!user) {
    console.log('User not found');
    throw new Error({ status: 404, msg: 'User does not exist' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('authentication failed');
    throw new Error({ status: 401, msg: 'Authentication Failed' });
  }

  return user;
};

/* Performing operations before save */
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, SALT_ROUND);
  }

  next();
});

UserSchema.methods.generateAuthToken = async function () {
  let user = this;

  /* Create new token for new login */
  const token = jwt.sign({ _id: user._id.toString() }, JWT_VERIFY_KEY, { expiresIn: 100000 });
  console.log(token);

  /* Concatinating newly created token with the old token array */
  user.tokens.push(token);

  await user.save();
  return token;
};

// UserSchema.post('remove', async function (next) {
//   const followers = this.followers;

//   let followingUsers = [];
//   try {
//     followingUsers = await User.find({ following: this._id });
//   } catch (error) {

//   }
// })

module.exports = mongoose.model('User', UserSchema);