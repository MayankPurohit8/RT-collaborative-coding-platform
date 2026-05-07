import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.get("/", (req, res) => {
  res.send("hello world");
});

let rooms = {};

io.on("connection", (socket) => {
  socket.on("create-room", ({ roomId, username }) => {
    socket.join(roomId);
    rooms[roomId] = { users: [{ id: socket.id, username }] };
    socket.to(roomId).emit("receive-message", `${username} joined the room`);
  });

  socket.on("join-room", ({ roomId, username }) => {
    if (!rooms[roomId]) {
      socket.emit("error", { message: "Room does not exist" });
      console.log("room does not exist");
      return;
    } else {
      socket.join(roomId);
      socket.to(roomId).emit("receive-message", `${username} joined the room`);
      rooms[roomId].users.push({ id: socket.id, username });

      console.log("socket connected to room ", roomId);
    }
  });

  socket.on("code-change", ({ value, roomId }) => {
    console.log(value);
    socket.to(roomId).emit("code-update", { value });
  });

  socket.on("send-message", ({ message, roomId }) => {
    socket.to(roomId).emit("receive-message", { newChat: message });
    console.log(message);
  });
});

server.listen(3000);
