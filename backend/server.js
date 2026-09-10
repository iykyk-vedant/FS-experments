const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/FullStackProject";

mongoose
  .connect(MONGO_URI, {
    dbName: "FullStackProject",
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });

// Health check / Welcome route
app.get("/", (req, res) => {
  res.send("Full Stack API is Running");
});

// Mount Routes
app.use("/api/weather", weatherRoutes);

// Server Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
