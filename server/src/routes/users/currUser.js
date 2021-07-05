const router = require('express').Router();
const User = require('../../db/models/User');

/* Get Logged User Details */
router.patch('/', async (req, res) => {
  res.json(req.user);
})

/* Update Logged User Profile */
router.patch('/update', async (req, res) => {
  const newUserDetails = req.body;
  /* If the user is not currently logged user then don't update the details */
  if (newUserDetails._id != req.user._id) {
    return res.status(401).json('Authentication Failed');
  }

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

/* Delete Logged User Profile */
router.delete('/delete', async (req, res) => {
  /* TODO: Update the following array when the user is deleted */
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    res.send(user);
  } catch (error) {
    return res.status(501).json(failureJSON(error.message));
  }
});

module.exports = router;