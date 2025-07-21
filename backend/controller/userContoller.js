import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier"
import User from "../model/User.js";


export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // ✅ Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create and save the user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("❌ Error in registerUser:", error.message);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};




export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Find user by email using Mongoose
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid Email or Password" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Email or Password" });
    }

    // ✅ Create JWT Token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Optional: token expiry
    );

    const token = setEncryptedToken(jwtToken); // optional wrapper

    res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("❌ Error in loginUser:", error.message);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};


export const getUserData = async (req, res) => {
  const id = req.id; // assuming this comes from a verified JWT middleware

  try {
    // ✅ Fetch user by MongoDB _id
    const user = await User.findById(id).select("-password"); // exclude password from result

    if (!user) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error("❌ Error in getUserData:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const editProfile = async (req, res) => {
  const id = req.id; // Assuming extracted from JWT middleware
  const { username, email } = req.body;

  try {
    // ✅ Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    let profilePic = user.profilePic;

    // ✅ If file is uploaded, handle it
    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file);
        if (!uploadResult?.success) {
          return res.status(500).json({ error: "Image upload failed" });
        }
        profilePic = uploadResult.url;
      } catch (err) {
        console.error("❌ Image upload error:", err.message);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, profilePic },
      { new: true } // return the updated user
    );

    if (!updatedUser) {
      return res.status(400).json({ error: "No changes made to profile" });
    }

    res.status(200).json({ message: "Profile updated", user: updatedUser });

  } catch (error) {
    console.error("❌ Error editing profile:", error.message);
    res.status(500).json({ error: "Failed to edit profile" });
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




export function setEncryptedToken(token) {
  const encryptedToken = CryptoJS.AES.encrypt(token, process.env.SECRETKEY).toString();
  return encryptedToken;
}