import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";


// User Registration
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    User.findUserByEmail(email, async (err, result) => {
      if (err) return res.status(500).json({ error: 'Server Error' });
      if (result.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Add the user
      User.addUser(username, email, hashedPassword, (err, result) => {
        if (err) return res.status(500).json({ error: 'Registration failed' });
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// User Login
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  User.findUserByEmail(email, async (err, result) => {
    if (err) return res.status(500).json({ error: 'Server Error' });
    if (result.length === 0) {
      return res.status(400).json({ error: 'Invalid Email or Password' });
    }

    // Compare password
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Email or Password' });
    }

    // Create JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  });
};

