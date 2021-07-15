const router = require('express').Router();

const { authenticationUserToken: verifyUser } = require('../../middleware/auth');
const User = require('../../db/models/User');
const Post = require('../../db/models/Post');

/* Authenticate the User */
router.use(verifyUser);

/* Get Post Details */
router.get('/:postId', async (req, res) => {
  const postId = req.params.postId;

  const post = undefined;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    return res.status(500).json({ err });
  }

  if (!post) return res.status(404).send('Post does not exist');

  return res.json(post);
});

/* Create Post */
router.post('/create', async (req, res) => {
  const newPost = new Post(req.body);

  try {
    await newPost.save();
  } catch (err) {
    return res.status(500).json({ err });
  }

  return res.status(201).json(newPost);
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
