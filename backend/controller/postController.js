
import {
    addPost,
    getPosts,
    checkLikeStatus,
    likePost,
    unlikePost,
    addComment,
    getUserPosts,
} from '../model/Post.js'; 

// Create Post: Add new post with text and optional image
export const createPost = (req, res) => {
    const { user_id, content } = req.body;
    const image = req.file ? req.file.path : null; // Get the uploaded image path

    addPost(user_id, content, image, (err, result) => {
        if (err) {
            console.error('Error creating post:', err);
            return res.status(500).json({ error: 'Failed to create post' });
        }
        res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
    });
};

// Get Posts: Fetch all posts with sorting and filtering
export const fetchPosts = (req, res) => {
    const { sort = 'newest', user_id } = req.query;

    getPosts(sort, user_id, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ error: 'Failed to fetch posts' });
        }
        res.status(200).json(results);
    });
};

// Like/Unlike Post: Toggle like status
export const toggleLike = (req, res) => {
    const { postId } = req.params;
    const { user_id } = req.body;

    checkLikeStatus(user_id, postId, (err, results) => {
        if (err) {
            console.error('Error checking like status:', err);
            return res.status(500).json({ error: 'Failed to toggle like' });
        }

        if (results.length > 0) {
            // Unlike the post
            unlikePost(user_id, postId, (err) => {
                if (err) {
                    console.error('Error unliking post:', err);
                    return res.status(500).json({ error: 'Failed to unlike post' });
                }
                res.status(200).json({ message: 'Post unliked successfully' });
            });
        } else {
            // Like the post
            likePost(user_id, postId, (err) => {
                if (err) {
                    console.error('Error liking post:', err);
                    return res.status(500).json({ error: 'Failed to like post' });
                }
                res.status(200).json({ message: 'Post liked successfully' });
            });
        }
    });
};

// Add Comment: Add a comment to a post
export const addPostComment = (req, res) => {
    const { postId } = req.params;
    const { user_id, comment } = req.body;

    addComment(postId, user_id, comment, (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
            return res.status(500).json({ error: 'Failed to add comment' });
        }
        res.status(201).json({ message: 'Comment added successfully', commentId: result.insertId });
    });
};

// Get User Posts: Retrieve posts by a specific user
export const fetchUserPosts = (req, res) => {
    const { userId } = req.params;

    getUserPosts(userId, (err, results) => {
        if (err) {
            console.error('Error fetching user posts:', err);
            return res.status(500).json({ error: 'Failed to fetch user posts' });
        }
        res.status(200).json(results);
    });
};
