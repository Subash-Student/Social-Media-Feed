import express from "express";
import { editProfile, getUserData, loginUser, registerUser } from "../controller/userContoller.js";
import authMiddleware from "../middleware/auth.js";
import multer from "multer";

const userRouter = express.Router();



userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/profile",authMiddleware,getUserData)
userRouter.post("/edit-profile",multer().single("profilePic"),authMiddleware,editProfile)
export default userRouter;