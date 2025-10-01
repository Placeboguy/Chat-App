import express from 'express';
import cors from 'cors';
import "dotenv/config";
import http from 'http';
import { connectDB } from './lib/db.js';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';
import {Server} from 'socket.io';

const app = express();  
const server = http.createServer(app);

//Intialize socket.io
export const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "production" 
            ? ["https://your-frontend-app-name.onrender.com"] 
            : "*",
        credentials: true
    }
});

//store online users
export const userSocketMap = {}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connected", userId);
  if(userId){
    userSocketMap[userId] = socket.id;
  }

  //emit online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
})
});


app.use(express.json({ limit: '4mb' }));
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? ["https://your-frontend-app-name.onrender.com"]
        : "*",
    credentials: true
}));

app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
await connectDB()

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;