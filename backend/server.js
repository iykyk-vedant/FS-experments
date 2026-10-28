const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection (optional / graceful fallback)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI, { dbName: "FullStackProject" })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB connection skipped or unavailable:", err.message));
}

// Problem Statement verification endpoint (Exp 7 PS requirement)
app.get("/api", (req, res) => {
  res.json({
    message: "Backend is running inside Docker!"
  });
});

// Root health & metadata endpoint
app.get("/", (req, res) => {
  res.json({
    project: "WeatherCast Full-Stack Docker Application",
    status: "healthy",
    backend: "running inside Docker",
    endpoints: {
      dockerVerification: "/api",
      weatherAPI: "/api/weather"
    }
  });
});

// Weather forecast API routes
app.use("/api/weather", require("./routes/weatherRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
