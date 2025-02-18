import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import CryptoJS from "crypto-js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier"

// User Registration
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Add the user
    await User.addUser(username, email, hashedPassword);
    
    res.status(201).json({ message: 'User registered successfully' });
    
  } catch (error) {
    console.error('❌ Error in registerUser:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};


// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Await the result of the Promise
    const user = await User.findUserByEmail(email);

    if (!user) { // Check if no user is found
      return res.status(400).json({ error: 'Invalid Email or Password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Email or Password' });
    }

    // Create JWT Token
    const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    
    const token = setEncryptedToken(jwtToken);

    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.log('❌ Error in loginUser:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};



export const getUserData = async(req,res)=>{
 
  const id = req.id;

  try {
    User.findUserById(id, async (err, result) => {
      if (err) return res.status(500).json({ error: 'Server Error' });
      if (result.length === 0) {
        return res.status(400).json({ error: 'Invalid id' });
      }
  
      const user = result[0];

      res.status(200).json({
        user: result,
      });
    });

  } catch (error) {
    console.log(error)
   return res.status(500).json({ error: 'Internal Server Error' });
  }
}



// Controller (editProfile)
export const editProfile = async(req, res) => {
  const id = req.id; // Assuming the ID is passed via JWT or session
  console.log(req.body);
  const {  username, email } = req.body;
  

  User.findUserById(id, async (err, result) => {
      if (err) return res.status(500).json({ error: 'Server Error' });
      if (result.length === 0) {
          return res.status(400).json({ error: 'Invalid id' });
      }

      const user = result[0];
      
      let { profilePic } = user;

      // Handle image upload if a new file is provided
      if (req.file) {  
          try {
              const imageUploadResult = await uploadImage(req.file);
              if (!imageUploadResult?.success) {
                  return res.status(500).json({ error: 'Image upload failed' });
              }
              profilePic = imageUploadResult.url;
          } catch (error) {
              return res.status(500).json({ error: 'Failed to upload image' });
          }
      }

      try {
          const updateResult = await User.editProfile(id, username, profilePic, email);
          if (updateResult > 0) {
              res.status(200).json({ message: 'Profile Updated' });
          } else {
              res.status(400).json({ error: 'No changes made to profile' });
          }
      } catch (error) {
          console.error('Error editing profile:', error);
          res.status(500).json({ error: 'Failed to edit profile' });
      }
  });
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




export function setEncryptedToken(token) {
  const encryptedToken = CryptoJS.AES.encrypt(token, process.env.SECRETKEY).toString();
  return encryptedToken;
}