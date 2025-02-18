import db from "../config/db.js";

const createPostsTable = `
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    profilePic VARCHAR(255),
    user_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    postImage VARCHAR(255),
    likes INT DEFAULT 0,
    isLiked BOOLEAN DEFAULT FALSE,
    isOnline BOOLEAN DEFAULT TRUE,
    comments JSON
);
`;

// Create the posts table with error handling
db.query(createPostsTable, (err, result) => {
    if (err) {
        console.error('Error creating posts table:', err.message);
        return;
    }
    console.log('✅ Posts table ready');
});

// Get all posts with improved error handling
const getAllPosts = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM posts;';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query in getAllPosts:', err.message);
                return reject(new Error('Failed to retrieve posts. Please try again later.'));
            }
            resolve(results);
        });
    });
};

// Get post by ID with error handling
const getPostById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM posts WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error executing query in getPostById:', err.message);
                return reject(new Error('Failed to retrieve the post. Please try again later.'));
            }
            resolve(results[0]);
        });
    });
};

// Add a new post with error handling
const addPost = (user_id, content, postImage, userName, profilePic) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO posts (user_id, content, postImage, userName, profilePic, likes, isLiked, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const comments = [];
        db.query(query, [user_id, content, postImage, userName, profilePic, 0, false, JSON.stringify(comments)], (err, result) => {
            if (err) {
                console.error('Error executing query in addPost:', err.message);
                reject(new Error('Failed to add post. Please try again later.'));
            } else {
                resolve(result.insertId);
            }
        });
    });
};




// Add a like to a post with error handling
const addLike = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE posts SET likes = likes + 1, isLiked = TRUE WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error executing query in addLike:', err.message);
                return reject(new Error('Failed to like the post. Please try again later.'));
            }
            resolve(result);
        });
    });
};

// Remove a like from a post with error handling
const removeLike = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE posts SET likes = likes - 1, isLiked = FALSE WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error executing query in removeLike:', err.message);
                return reject(new Error('Failed to unlike the post. Please try again later.'));
            }
            resolve(result);
        });
    });
};

// Add a comment to a post with error handling
const addComment = (postId, user, text) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE posts SET comments = JSON_ARRAY_APPEND(comments, "$", ?) WHERE id = ?';
        const comment = { user, text }; 
        db.query(query, [JSON.stringify(comment), postId], (err, result) => {
            if (err) {
                console.error('Error executing query in addComment:', err.message);
                return reject(new Error('Failed to add comment. Please try again later.'));
            }
            resolve(result);
        });
    });
};

// Remove a comment from a post with error handling
const removeComment = (postId, commentIndex) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE posts 
            SET comments = JSON_REMOVE(comments, ?) 
            WHERE id = ?;
        `;
        db.query(query, [`$[${commentIndex}]`, postId], (err, result) => {
            if (err) {
                console.error('Error executing query in removeComment:', err.message);
                return reject(new Error('Failed to remove comment. Please try again later.'));
            }
            resolve(result);
        });
    });
};

export default {
    getAllPosts,
    getPostById,
    addPost,
    addLike,
    removeLike,
    addComment,
    removeComment
};
