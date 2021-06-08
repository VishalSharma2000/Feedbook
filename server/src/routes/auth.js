const router = require('express').Router();

const User = require('./../db/models/User');

const successJSON = (data = undefined) => {
  return {
    error: false,
    errorMessage: '',
    data: data,
  }
};

const failureJSON = (errorMessage) => {
  if (errorMessage = {} || errorMessage === undefined || errorMessage === null)
    errorMessage = "Some Error. Please Try Again!"
  return {
    error: true,
    errorMessage: errorMessage,
    data: null,
  }
}

/* Sign Up New User */
router.post('/signup', async (req, res) => {
  const { username, name, email, password } = req.body;

  const newUser = new User({
    username,
    name,
    email,
    password,
  });

  try {
    await newUser.save();
    return res.status(201).json(successJSON(newUser));
  } catch (error) {
    console.log(error);
    return res.status(500).json(failureJSON(error));
  }
});

/* Login for Existing User */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  let user = undefined;
  try {
    user = await User.findByCredentials(email, password);
  } catch (error) {
    console.log('Error while authentication user', error.toString());
    return res.status(500).send();
  }

  res.send(user);
});

module.exports = router;