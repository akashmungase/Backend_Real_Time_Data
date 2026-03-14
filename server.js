const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {

    console.log(data);

    // broadcast message to all users
    io.emit("receiveMessage", data);

  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});