const express = require('express');
const router = express.Router();

const User = require('../../db/models/User');

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
router.get('/:id', async (req, res) => {
  const userId = req.params;

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