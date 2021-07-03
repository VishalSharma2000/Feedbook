const express = require('express');
const router = express.Router();

const User = require('../db/models/User');
const { isUserExist } = require('./../utils/helperFunctions');
const { authenticationUserToken: verifyUser } = require('../middleware/auth');

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
router.get('/', verifyUser, async (req, res) => {
  const { userId } = req.query;

  console.log(req.user);
  /* If User does not exist */
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

  /* If there is any invalid update key-value pair then return */
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

    /* Update all the allowed updates in the user document */
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
  const { userId, userToFollow } = req.body;

  /* Check if User Exist */
  const [currUserDetails] = await isUserExist(userId);
  const [toFollowUserDetails] = await isUserExist(userToFollow);

  if (!currUserDetails || !toFollowUserDetails) {
    return res.status(401).json(failureJSON('User does not exist'));
  }

  /* If userToFollow is already following the user */
  if (currUserDetails.following.includes(toFollowUserDetails._id)) {
    return res.status(400).json(failureJSON('Already following the user'));
  }

  currUserDetails.following.push(toFollowUserDetails);
  toFollowUserDetails.followers.push(currUserDetails);

  try {
    await currUserDetails.save();
    await toFollowUserDetails.save();
  } catch (error) {
    return res.status(501).json(failureJSON(error));
  }

  res.json(currUserDetails);
});

/* UnFollow user */
router.post('/unfollow', async (req, res) => {
  const { userId, userToUnFollow } = req.body;

  /* Check if User Exist */
  const [currUserDetails] = await isUserExist(userId);
  const [toUnFollowUserDetails] = await isUserExist(userToUnFollow);

  if (!currUserDetails || !toUnFollowUserDetails) {
    return res.status(401).json(failureJSON('User does not exist'));
  }

  /* If userToFollow is already following the user */
  if (!currUserDetails.following.includes(toUnFollowUserDetails._id)) {
    return res.status(400).json(failureJSON('You have already unfollowed the user'));
  }

  currUserDetails.following.slice(currUserDetails.following.indexOf(toUnFollowUserDetails), 1);
  toUnFollowUserDetails.followers.pop(currUserDetails);

  try {
    await currUserDetails.save();
  } catch (error) {
    return res.status(501).json(failureJSON(error));
  }

  res.json(currUserDetails);
});

module.exports = router;