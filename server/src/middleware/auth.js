// require('dotenv').config();
const jwt = require('jsonwebtoken');
const { JWT_VERIFY_KEY } = process.env;

const User = require('../db/models/User');

const authenticationUserToken = async (req, res, next) => {
  const [authType, authToken] = req.headers['authorization'].split(' ');
  const decoded = jwt.verify(authToken, JWT_VERIFY_KEY);

  let user = undefined;
  try {
    user = await User.findOne({ _id: decoded._id, tokens: authToken });
  } catch (error) {
    console.log('Cannot Retrive User while token autherization');
    throw Error('Authorization Failed');
  }

  if (!user) throw new Error('Authorization Failed');

  req.user = user;
  req.token = authToken;

  next();
};

module.exports = {
  authenticationUserToken
};