// require('dotenv').config();
const jwt = require('jsonwebtoken');
const { JWT_VERIFY_KEY } = process.env;

const User = require('../db/models/User');

const authenticationUserToken = async (req, res, next) => {
  /* Format of authorization header => Bearer authToken */
  const [authType, authToken] = req.headers['authorization'].split(' ');
  let decoded;
  try {
    decoded = jwt.verify(authToken, JWT_VERIFY_KEY);
  } catch (error) {
    console.log(error.message);
    return res.status(401).json('Authentication Failed');
  }

  let user = undefined;
  try {
    user = await User.findOne({ _id: decoded._id, tokens: authToken });
  } catch (error) {
    console.log('Cannot Retrive User while token autherization');
    return res.status(501).json('Authorication Failed');
  }

  if (!user)
    return res.status(401).json('Authentication Failed');

  req.user = user;
  req.token = authToken;

  next();
};

module.exports = {
  authenticationUserToken
};