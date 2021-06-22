const express = require('express');
const router = express.Router();

const User = require('../db/models/User');

const successJSON = (data = undefined) => {
  return {
    error: false,
    errorMessage: '',
    data: data,
  }
};

const failureJSON = (errorMessage) => {
  if (errorMessage === {} || errorMessage === undefined || errorMessage === null)
    errorMessage = "Some Error. Please Try Again!"
  return {
    error: true,
    errorMessage: errorMessage,
    data: null,
  }
}

/* Get User Details */
router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json(failureJSON('User Id is required'));
  }

  let user = undefined;
  try {
    user = await User.findById({ _id: userId });
  } catch (error) {
    return res.status(501).json(failureJSON(error));
  }

  return res.status(200).json(user);
});

/* Update User Profile */
router.patch('/update', async (req, res) => {
  const newUserDetails = req.body;

  /* Check if all the key-value pair in newUserDetails are updatable */
  const allowedUpdates = ['_id', 'username', 'name', 'bio', 'password', 'address'];
  const inValidUpdates = Object.keys(newUserDetails).filter(key => {
    return allowedUpdates.indexOf(key) === -1;
  });

  if (inValidUpdates.length > 0) {
    console.log('Invalid updates');
    return res.status(401).json(failureJSON({
      error: 'Some values are not allowed to update',
      values: inValidUpdates
    }));
  }

  try {
    const user = await User.findById(newUserDetails._id);

    if (!user) {
      return res.status(401).json(failureJSON('User does not exist'));
    }

    allowedUpdates.forEach(updateKey => {
      user[updateKey] = newUserDetails[updateKey];
    });

    await user.save();

    res.json(user);
  } catch (error) {
    console.log('Error while saving user');
    return res.status(501).json(failureJSON(error));
  }
});

/* Delete User Profile */
router.delete('/delete', async (req, res) => {
  const { userId } = req.query;

  /* TODO: Update the following array when the user is deleted */
  try {
    const user = await User.findByIdAndDelete(userId);

    res.send(user);
  } catch (error) {
    return res.status(501).json(failureJSON(error.message));
  }
});

/* Follow user */
router.post('/follow', async (req, res) => {

});

/* UnFollow user */
router.post('/unfollow', async (req, res) => {

});

module.exports = router;