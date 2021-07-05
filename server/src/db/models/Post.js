const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: 'User',
  },
  mediaUrl: {
    type: String,
    default: "",
  },
  likes: [{
    type: ObjectId,
    ref: 'User',
  }],
}, {
  timeStamps: true,
});

module.exports = mongoose.model('Post', PostSchema);