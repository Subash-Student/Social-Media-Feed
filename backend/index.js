import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/db.js";
import { Server } from "socket.io";
import http from "http";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import connectDB from "./config/db.js";


const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials for Socket.io
  },
});

// CORS configuration for Express
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
    credentials: true, // Allow credentials
  })
);

app.use(express.json());

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('likePost', (postId) => {
    io.emit('postLiked', postId);
  });

  socket.on('commentPost', (postId) => {
    io.emit('postCommented', postId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.use("/api/users", userRouter);
app.use("/api",postRouter);


connectDB()


// Start the server
server.listen(PORT, () => {
  console.log(`Server Started At http://localhost:${PORT}`);
});