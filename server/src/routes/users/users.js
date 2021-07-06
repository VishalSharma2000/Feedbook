const express = require('express');
const router = express.Router();

const User = require('../../db/models/User');
const { isUserExist } = require('../../utils/helperFunctions');

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
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  /* If User does not exist */
  if (!userId) {
    return res.status(400).json(failureJSON('User Id is required'));
  }

  let user = undefined;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return res.status(501).json(failureJSON(error));
  }

  return res.status(200).json(user);
});


/* Follow user */
router.post('/follow', async (req, res) => {
  const { userIdToFollow } = req.body;
  const currUserDetails = req.user;

  /* Check if User Exist */
  const [toFollowUserDetails] = await isUserExist(userIdToFollow);

  if (!toFollowUserDetails) {
    return res.status(401).json(failureJSON('User does not exist'));
  }

  /* If userIdToFollow is already following the user */
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
  const { userIdToUnFollow } = req.body;
  const currUserDetails = req.user;

  /* Check if User Exist */
  const [userDetailsToUnFollow] = await isUserExist(userIdToUnFollow);

  if (!userDetailsToUnFollow) {
    return res.status(401).json(failureJSON('User does not exist'));
  }

  /* If userIdToUnFollow is not following the user */
  if (!currUserDetails.following.includes(userIdToUnFollow)) {
    return res.status(400).json(failureJSON('You have already unfollowed the user'));
  }

  currUserDetails.following.splice(currUserDetails.following.indexOf(userIdToUnFollow), 1);
  userDetailsToUnFollow.followers.splice(userDetailsToUnFollow.followers.indexOf(currUserDetails._id), 1);

  try {
    await currUserDetails.save();
    await userDetailsToUnFollow.save();
  } catch (error) {
    return res.status(501).json(failureJSON(error));
  }

  res.json(currUserDetails);
});

module.exports = router;