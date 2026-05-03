const express = require("express");
const http = require("http");
const https = require("https");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
// mongoUrl = "mongodb+srv://akashmungase99_db_user:UgkmQxEWEG7S1nwK@cluster0.2qmxojo.mongodb.net/chatdb?retryWrites=true&w=majority&appName=Cluster0";
// mongoUrl = "mongodb+srv://akashmungase99_db_user:UgkmQxEWEG7S1nwK@cluster0.2qmxojo.mongodb.net/?appName=Cluster0";

// ─── MongoDB connection ───────────────────────────────────────
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));
// ─── Message schema ───────────────────────────────────────────
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  time: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

// ─── REST endpoint: load old messages ────────────────────────
app.get("/messages", async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 }).limit(50);
  res.json(messages);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("sendMessage", async (data) => {
    const message = {
      user: data.user,
      text: data.text,
      time: new Date().toLocaleTimeString()
    };

    // ─── Save to MongoDB ──────────────────────────────────────
    await Message.create(message);

    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Server running on", PORT));

// ─── Self ping to prevent Render sleep ───────────────────────
setInterval(() => {
  https.get("https://backend-real-time-data.onrender.com", (res) => {
    console.log("Self ping:", res.statusCode);
  }).on("error", (e) => console.log("Ping error:", e.message));
}, 14 * 60 * 1000);