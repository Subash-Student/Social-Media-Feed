import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/db.js";
import { Server } from "socket.io";
import http from "http";
import userRouter from "./routes/userRoutes.js";

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
io.on("connection", (socket) => {
  console.log("userConnected:", socket.id);

  socket.on("newComment", (data) => {
    io.emit("updateComments", data);
  });

  socket.on("likePost", (data) => {
    io.emit("updateLikes", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.use("/api/users", userRouter);

// Start the server
server.listen(PORT, () => {
  console.log(`Server Started At http://localhost:${PORT}`);
});