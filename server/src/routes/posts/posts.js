const router = require('express').Router();

const { authenticationUserToken: verifyUser } = require('../../middleware/auth');
const User = require('../../db/models/User');
const Post = require('../../db/models/Post');

/* Authenticate the User */
router.use(verifyUser);

/* Get Post Details */
router.get('/:postId', verifyUser, async (req, res) => {
  res.send('working');
});

/* Create Post */
router.post('/create', async (req, res) => {

});

/* Update Post */
router.patch('/update', async (req, res) => {

});

/* Like / UnLike Post */
router.post('/like', async (req, res) => {

});

/* All Current User Posts */
router.get('/myPosts', async (req, res) => {

});

/* Get Post of some user */
router.get('/allPosts', async (req, res) => {

});

module.exports = router;
