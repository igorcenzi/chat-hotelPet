const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const chats = []

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('get_messages', (room) => {
    io.to(room).emit('get_messages', chats.map(chat => chat.room === room))
  })

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("message", (data) => {
    chats.push(data)
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("SERVER RUNNING ON PORT " + (process.env.PORT || 5000));
});
