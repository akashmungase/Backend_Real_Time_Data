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
  },
  pingTimeout: 60000,       // ← add this
  pingInterval: 25000,      // ← add this
  transports: ['websocket', 'polling']  // ← allow polling as fallback
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

const PORT = 8080;

server.listen(PORT, () => {
  console.log("Server running on", PORT);
});