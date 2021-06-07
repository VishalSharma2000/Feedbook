const route = require('express').Router();

const User = require('./../db/models/User');

const successJSON = (data = null) => {
  return {
    error: false,
    errorMessage: '',
    data: data,
  }
};

const failureJSON = (errorMessage) => {
  return {
    error: true,
    errorMessage: errorMessage || 'Some Error. Please Try Again!',
    data: null,
  }
}

/* Sign Up New User */
route.post('/signup', async (req, res) => {
  const { username, name, email, password } = req.body;

  const newUser = new User({
    username,
    name,
    email,
    password,
  });

  try {
    await newUser.save();
    return res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

module.exports = route;