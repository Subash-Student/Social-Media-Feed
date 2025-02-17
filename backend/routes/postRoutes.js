
import express from 'express';
import multer from 'multer';
import {
    createPost,
    fetchPosts,
    toggleLike,
    addPostComment,
    fetchUserPosts,
} from '../controller/postController.js'; 

const postRouter = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// 1. Create Post: Add new post with text and optional image
postRouter.post('/add-post', upload.single('image'), createPost);

// 2. Get Posts: Fetch all posts with sorting and filtering
postRouter.get('/posts', fetchPosts);

// 3. Like/Unlike Post: Toggle like status
postRouter.post('/posts/:postId/like', toggleLike);

// 4. Add Comment: Add a comment to a post
postRouter.post('/posts/:postId/comments', addPostComment);

// 5. Get User Posts: Retrieve posts by a specific user
postRouter.get('/users/:userId/posts', fetchUserPosts);

export default postRouter;
