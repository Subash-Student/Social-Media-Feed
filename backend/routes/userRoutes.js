import express from "express";
import { getUserData, loginUser, registerUser } from "../controller/userContoller.js";
import authMiddleware from "../middleware/auth.js";


const userRouter = express.Router();



userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/profile",authMiddleware,getUserData)

export default userRouter;