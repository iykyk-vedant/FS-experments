const express = require("express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO Server with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Security & Parsing Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use((req, res, next) => { req.url = req.url.trim().replace(/%0A|[\r\n]/gi, ""); next(); });
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));

// Real-Time WebSockets Communication (Exp 8)
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Broadcast chat messages to all connected clients
  socket.on("chatMessage", (data) => {
    const payload = typeof data === "string" ? { username: "Student", message: data } : data;
    io.emit("chatMessage", payload);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/FullStackProject";
mongoose.connect(MONGO_URI, { dbName: "FullStackProject" })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err.message));

// Routes
app.get("/", (req, res) => res.json({ 
  message: "Full-Stack WeatherCast Real-Time API with WebSockets is running",
  status: "active" 
}));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
