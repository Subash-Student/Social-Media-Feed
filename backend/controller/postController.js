import Post from "../model/Post.js"
import User from "../model/User.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier"

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



export const createPost = async(req, res) => {
    const { user_id, content } = req.body;
    let postImage = "";
   
    if(req.file){  
              const result = await uploadImage(req.file);
              if (!result?.success) {
                throw new Error(`${type} upload failed`);
            }
            postImage =  result.url;
    }

    User.findUserById(user_id, async (err, result) => {
        if (err) return res.status(500).json({ error: 'Server Error' });
        if (result.length === 0) {
            return res.status(400).json({ error: 'Invalid id' });
        }

        const user = result[0];
        

        try {
            const postId = await Post.addPost(user_id, content, postImage, user.username, user.profilePic);
            res.status(201).json({ message: 'Post created successfully', postId });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Failed to create post' });
        }
    });
};



export const addLike = async (req, res) => {
    try {
        await Post.addLike(req.params.id,req.params.user_id);
        res.status(200).json({ message: 'Like added' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeLike = async (req, res) => {
    try {
        await Post.removeLike(req.params.id,req.params.user_id);
        res.status(200).json({ message: 'Like removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addComment = async (req, res) => {
    const{user,text} = req.body;
    try {
        await Post.addComment(req.params.id, user,text);
        res.status(201).json({ message: 'Comment added',comment:JSON.stringify({user,text}) });
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


async function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "image-files",
            resource_type: "image",
            public_id: file.originalname, // Optional: Set the public ID
          },
          (error, result) => {
            if (error) {
              console.error("image upload error:", error);
              reject({ success: false });
            } else {
              resolve({ success: true, url: result.secure_url });
            }
          }
        );
    
        // Convert the buffer to a readable stream and pipe it to Cloudinary
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
  }