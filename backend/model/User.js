import db from "../config/db.js";

// Create the users table with error handling
const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profilePic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

db.query(createUserTable, (err, result) => {
  if (err) {
    console.error('❌ Error creating users table:', err.message);
  } else {
    console.log('✅ Users table ready');
  }
});

// Add a new user
const addUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, result) => {
      if (err) {
        console.error('❌ Error in addUser:', err.message);
        if (err.code === 'ER_DUP_ENTRY') {
          return reject(new Error('Email already exists. Please use a different email.'));
        }
        return reject(new Error('Failed to add user. Please try again.'));
      }
      resolve(result);
    });
  });
};

// Find a user by email
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
      if (err) {
        console.error('❌ Error in findUserByEmail:', err.message);
        return reject(new Error('Failed to find user. Please try again.'));
      }
      resolve(result[0]); // Return the first matching user
    });
  });
};

// Find a user by ID
const findUserById = (id, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], callback);
};

export default {
  addUser,
  findUserByEmail,
  findUserById
};
