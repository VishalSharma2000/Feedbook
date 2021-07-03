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



module.exports = router;