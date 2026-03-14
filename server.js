const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {

  console.log("User connected", socket.id);

  socket.on("sendMessage", (data) => {

    const message = {
      user: data.user,
      text: data.text,
      time: new Date().toLocaleTimeString()
    };

    io.emit("receiveMessage", message);

  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on", PORT);
});