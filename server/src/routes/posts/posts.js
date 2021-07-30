const router = require('express').Router();

const { authenticationUserToken: verifyUser } = require('../../middleware/auth');
const User = require('../../db/models/User');
const Post = require('../../db/models/Post');

/* Authenticate the User */
router.use(verifyUser);

/* Get Post Details */
router.get('/', async (req, res) => {
  const postId = req.query;

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
  /* Authenticate userId sent inside req.body */
  const { postId, userId } = req.body;

  if (userId === undefined) {
    req.body.userId = req.user._id;
  } else if (userId != req.user._id) {
    return res.status(401).json({ msg: "You don't have access to update post" });
  }

  let post;
  try {
    /* Update all the existing key-value pair */
    post = await Post.findOneAndUpdate({ _id: postId, userId }, req.body, { returnOriginal: false });
  } catch (err) {
    console.log("Error while fetching post", err);
    return res.status(500).json({ msg: "Error while updating post" });
  }

  if (!post) {
    if (!post) return res.status(404).json({ msg: 'Post does not exist' });
  }

  res.status(200).json(post);
});

/* Like / UnLike Post */
router.post('/like', async (req, res) => {
  const { postId } = req.body;
  const { _id: userId } = req.user;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong." });
  }

  if (!post) {
    return res.status(404).json({ msg: "Post does not exist" });
  }

  if (!post.likes.includes(userId)) {
    await post.updateOne({ $push: { likes: userId } });
    return res.status(200).json({ msg: "Post liked successfully " });
  } else {
    await post.updateOne({ $pull: { likes: userId } });
    return res.status(200).json({ msg: "Post unliked successfully" });
  }

});

/* All Current User Posts */
router.get('/myPosts', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id });

    res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong" })
  }
});

/* Get Post of some user */
router.get('/myFeed', async (req, res) => {
  let posts = [];

  /* User will see post posted by it and those created by those users whom it follow */
  const userIds = [...req.user.following, req.user._id];

  try {
    posts = await Post.find({ userId: { $in: userIds } })
      .populate('userId', '_id name');
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }

  return res.status(200).json(posts);
});

module.exports = router;
