import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // frontend origin
    credentials: true, // allow cookies (access_token)
  },
});

export const socketHandler = (socket) => {
  // Mark all messages from `senderId` to `receiverId` as read
  socket.on("markMessagesAsRead", async ({ senderId, receiverId }) => {
    try {
      await Message.updateMany(
        {
          senderId,
          receiverId,
          read: false,
        },
        { $set: { read: true } }
      );
      console.log(`Marked messages from ${senderId} to ${receiverId} as read`);
      // Notify sender that messages were read
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", { from: receiverId });
      }
    } catch (err) {
      console.error("Failed to mark messages as read:", err.message);
    }
  });
};

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send event to all the connected clients - multicast to clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socketHandler(socket);

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io, app, server };
