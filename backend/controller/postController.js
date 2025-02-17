import Post from "../model/Post.js"
import User from "../model/User.js";

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts(); 
        res.status(200).json({posts});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getPostById = async (req, res) => {
    try {
        const post = await Post.getPostById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// export const addPost = async (req, res) => {
//     try {
//         const postId = await Post.addPost(req.body);
//         res.status(201).json({ id: postId, ...req.body });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

export const createPost = (req, res) => {
    const { user_id, content } = req.body;
    const postImage = req.file ? req.file.path : null; // Get the uploaded image path

    User.findUserById(user_id, async (err, result) => {
        if (err) return res.status(500).json({ error: 'Server Error' });
        if (result.length === 0) {
          return res.status(400).json({ error: 'Invalid id' });
        }
    
        const user = result[0];

        Post.addPost(user_id, content, postImage,user.username,user.profilepic, (err, result) => {
            if (err) {
                console.error('Error creating post:', err);
                return res.status(500).json({ error: 'Failed to create post' });
            }
            res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
        });
 } )
};


export const addLike = async (req, res) => {
    try {
        await Post.addLike(req.params.id);
        res.status(200).json({ message: 'Like added' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeLike = async (req, res) => {
    try {
        await Post.removeLike(req.params.id);
        res.status(200).json({ message: 'Like removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addComment = async (req, res) => {
    try {
        await Post.addComment(req.params.id, req.body);
        res.status(201).json({ message: 'Comment added' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller: Adjusted to use postId and commentIndex
export const removeComment = async (req, res) => {
    try {
        const { postId, commentIndex } = req.params;
        if (!postId || commentIndex === undefined) {
            return res.status(400).json({ message: 'postId and commentIndex are required' });
        }
        await Post.removeComment(postId, commentIndex);
        res.status(200).json({ message: 'Comment removed' });
    } catch (err) {
        console.error('Error in removeComment controller:', err.message);
        res.status(500).json({ message: 'Failed to remove comment. Please try again later.' });
    }
};
