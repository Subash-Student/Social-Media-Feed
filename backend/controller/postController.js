import Post from "../model/Post.js"; // Mongoose Post model
import User from "../model/User.js"; // Mongoose User model
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// GET all posts
export const getAllPosts = async (req, res) => {
  try {
    // Find all posts—optionally sort by creation date descending
    const posts = await Post.find().sort({ created_at: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single post by its ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new post
export const createPost = async (req, res) => {
  const { user_id, content } = req.body;
  let postImage = "";

  // Handle image upload if file provided
  if (req.file) {
    const result = await uploadImage(req.file);
    if (!result?.success) {
      return res.status(500).json({ error: "Image upload failed" });
    }
    postImage = result.url;
  }

  try {
    // Using Mongoose to find the user
    const user = await User.findById(user_id);
    if (!user) return res.status(400).json({ error: "Invalid user ID" });

    // Create a new Post document
    const newPost = new Post({
      user_id: user._id,
      userName: user.username,
      profilePic: user.profilePic,
      content,
      postImage,
      likes: 0,
      isLiked: [],
      comments: []
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: "Post created successfully", postId: savedPost._id });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// ADD a like to a post
export const addLike = async (req, res) => {
  const { id: postId, user_id } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check if the user hasn't already liked the post
    if (!post.isLiked.includes(user_id)) {
      post.isLiked.push(user_id);
      post.likes += 1;
      await post.save();
      res.status(200).json({ message: "Like added" });
    } else {
      res.status(400).json({ error: "User already liked this post" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE a like from a post
export const removeLike = async (req, res) => {
  const { id: postId, user_id } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.isLiked.includes(user_id)) {
      // Remove the user ID from the isLiked array
      post.isLiked = post.isLiked.filter((uid) => uid !== user_id);
      post.likes = post.likes > 0 ? post.likes - 1 : 0;
      await post.save();
      res.status(200).json({ message: "Like removed" });
    } else {
      res.status(400).json({ error: "User has not liked this post" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD a comment to a post
export const addComment = async (req, res) => {
  const { user, text } = req.body;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = { user, text };
    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE a comment from a post (by index)
export const removeComment = async (req, res) => {
  try {
    const { postId, commentIndex } = req.params;
    if (!postId || commentIndex === undefined) {
      return res.status(400).json({ message: "postId and commentIndex are required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const index = parseInt(commentIndex);
    if (index < 0 || index >= post.comments.length) {
      return res.status(400).json({ message: "Invalid comment index" });
    }

    post.comments.splice(index, 1);
    await post.save();

    res.status(200).json({ message: "Comment removed" });
  } catch (err) {
    console.error("Error in removeComment controller:", err.message);
    res.status(500).json({ message: "Failed to remove comment. Please try again later." });
  }
};

// Helper function to upload an image to Cloudinary
async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "image-files",
        resource_type: "image",
        public_id: file.originalname, // Optional: set a custom public ID
      },
      (error, result) => {
        if (error) {
          console.error("Image upload error:", error);
          return reject({ success: false });
        } else {
          resolve({ success: true, url: result.secure_url });
        }
      }
    );

    // Convert the buffer to a readable stream and pipe it to Cloudinary
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}
