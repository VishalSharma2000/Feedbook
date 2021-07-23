const router = require('express').Router();

const { authenticationUserToken: verifyUser } = require('../../middleware/auth');
const User = require('../../db/models/User');
const Post = require('../../db/models/Post');

/* Authenticate the User */
router.use(verifyUser);

/* Get Post Details */
router.get('/:postId', async (req, res) => {
  const postId = req.params.postId;

  let post = undefined;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    console.log("Error while fetching post", err);
    return res.status(500).json({ err });
  }

  if (!post) return res.status(404).json({ msg: 'Post does not exist' });

  return res.json(post);
});

/* Create Post */
router.post('/create', async (req, res) => {
  /* Embed userId if not given from frontend AND prevent some other user to create post on behalf of current logged in user */
  const userId = req.body.userId;
  if (userId === undefined) {
    req.body.userId = req.user._id;
  } else if (userId != req.user._id) {
    return res.status(401).json({ msg: "You don't have access to create post" });
  }

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
