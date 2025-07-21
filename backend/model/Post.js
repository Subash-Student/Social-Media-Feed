import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
}, { _id: false });

const postSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: ""
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  content: {
    type: String,
    required: true
  },
  postImage: {
    type: String,
    default: ""
  },
  likes: {
    type: Number,
    default: 0
  },
  isLiked: {
    type: [String], // Store liked user IDs as strings
    default: []
  },
  comments: {
    type: [commentSchema],
    default: []
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
