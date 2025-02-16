import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();


// Middleware to check for authorized user
const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
   
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
    }

    try {
        const encryptedToken = getDecryptedToken(token);

        // Verify token with USER secret
        jwt.verify(String(encryptedToken),process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return res.json({success:false,message:err.message});
            }
            req.id = user.id;
            next();
        })
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(500).json({ success: false, message: "An error occurred during authentication." });
    }
};

function getDecryptedToken(encryptedToken) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.SECRETKEY);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedToken) {
            throw new Error("Decryption failed");
        }

        return decryptedToken;
    } catch (error) {
        throw new Error("Malformed token or decryption failed");
    }
}

export default authMiddleware;