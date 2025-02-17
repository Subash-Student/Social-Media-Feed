import db from "../config/db.js";

const createPostsTable = `
CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createLikeTable = `
CREATE TABLE IF NOT EXISTS likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
`;

const createCommentsTable = `
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

db.query(createPostsTable, (err, result) => {
    if (err) {
        console.error('Error creating posts table:', err);
    } else {
        console.log('Posts table ready');
    }
});

db.query(createLikeTable, (err, result) => {
    if (err) {
        console.error('Error creating likes table:', err);
    } else {
        console.log('Likes table ready');
    }
});

db.query(createCommentsTable, (err, result) => {
    if (err) {
        console.error('Error creating comments table:', err);
    } else {
        console.log('Comments table ready');
    }
});


const addPost = (user_id, content, image, callback) => {
    const query = 'INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)';
    db.query(query, [user_id, content, image], callback);
};

// 2. Fetch all posts with sorting and filtering
const getPosts = (sort = 'newest', user_id = null, callback) => {
    let query = 'SELECT * FROM posts';
    if (user_id) {
        query += ' WHERE user_id = ?';
    }

    // Sorting
    if (sort === 'newest') {
        query += ' ORDER BY created_at DESC';
    } else if (sort === 'oldest') {
        query += ' ORDER BY created_at ASC';
    }

    db.query(query, [user_id], callback);
};

// 3. Check if a user has liked a post
const checkLikeStatus = (user_id, post_id, callback) => {
    const query = 'SELECT * FROM likes WHERE user_id = ? AND post_id = ?';
    db.query(query, [user_id, post_id], callback);
};

// 4. Like a post
const likePost = (user_id, post_id, callback) => {
    const query = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)';
    db.query(query, [user_id, post_id], callback);
};

// 5. Unlike a post
const unlikePost = (user_id, post_id, callback) => {
    const query = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
    db.query(query, [user_id, post_id], callback);
};

// 6. Add a comment to a post
const addComment = (post_id, user_id, comment, callback) => {
    const query = 'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)';
    db.query(query, [post_id, user_id, comment], callback);
};

// 7. Fetch posts by a specific user
const getUserPosts = (user_id, callback) => {
    const query = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC';
    db.query(query, [user_id], callback);
};

export {
    addPost,
    getPosts,
    checkLikeStatus,
    likePost,
    unlikePost,
    addComment,
    getUserPosts,
};


