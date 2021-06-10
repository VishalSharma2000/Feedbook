const router = require('express').Router();
const ejs = require('ejs');
const path = require('path');

const sendMail = require('../config/nodemailer');
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

  /* Create User Instance */
  const newUser = new User({
    username,
    name,
    email,
    password,
  });

  /* Save User */
  try {
    await newUser.save();
  } catch (error) {
    console.log('Error in saving User ' + error);
    return res.status(500).json(failureJSON(error));
  }

  /* Send Mail to User */
  // res.render('activateEmail.ejs', { name: 'Vishal' })

  try {
    const emailTemplate = await ejs.renderFile(path.join(__dirname, '../views', 'activateEmail.ejs'), { name: 'Vishal' });

    await sendMail({
      to: newUser.email,
      subject: 'Email Activation',
      body: emailTemplate
    });
  } catch (error) {
    console.log('Error in sending email ' + error);
    return res.status(500).json(failureJSON(error));
  }

  return res.status(201).json(successJSON(newUser));

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

  if (user.emailActivated) {
    return res.json('Your Email is not Activated');
  }

  res.send(user);
});

module.exports = router;