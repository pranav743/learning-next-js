import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: "http://localhost:3000" }));

const users = [];
const messages = [];

function addUser({ username, room, socketId }) {
  const user = { username, room, socketId };
  users.push(user);
  return user;
}

function removeUser(socketId) {
  const idx = users.findIndex(u => u.socketId === socketId);
  if (idx !== -1) {
    return users.splice(idx, 1)[0];
  }
}

function getUsersInRoom(room) {
  return users.filter(u => u.room === room);
}

function formatMessage({ username, room, message, isAdmin = false }) {
  return {
    username,
    room,
    message,
    timestamp: new Date().toISOString(),
    isAdmin
  };
}

io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    addUser({ username, room, socketId: socket.id });
    socket.join(room);
    // Welcome message
    socket.emit("message", formatMessage({ username: "Admin", room, message: `Welcome ${username}!`, isAdmin: true }));
    // Broadcast join
    socket.broadcast.to(room).emit("message", formatMessage({ username: "Admin", room, message: `${username} has joined the chat`, isAdmin: true }));
    // Send users list
    io.to(room).emit("roomUsers", getUsersInRoom(room));
  });

  socket.on("sendMessage", ({ message, room, username }) => {
    const msg = formatMessage({ username, room, message });
    messages.push(msg);
    io.to(room).emit("message", msg);
  });

  socket.on("adminBroadcast", ({ message }) => {
    const msg = formatMessage({ username: "Admin", room: null, message, isAdmin: true });
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", formatMessage({ username: "Admin", room: user.room, message: `${user.username} has left the chat`, isAdmin: true }));
      io.to(user.room).emit("roomUsers", getUsersInRoom(user.room));
    }
  });
});

app.get("/", (req, res) => {
  res.send("Chat backend running");
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
