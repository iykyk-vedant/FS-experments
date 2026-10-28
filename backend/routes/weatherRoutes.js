const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Weather = require("../models/Weather");

// Helper to extract authenticated user from Bearer token
const getAuthUser = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// 1. GET USER-SPECIFIC FAVORITES
router.get("/", async (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    // Guest users have no persisted user favorites
    return res.json([]);
  }

  try {
    // If admin, they can see all favorites, or their own
    const query = { userId: user.id };
    const docs = await Weather.find(query).sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// 2. POST ADD FAVORITE FOR LOGGED-IN USER
router.post("/", async (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ message: "Authentication required to save favorites." });
  }

  try {
    // Avoid saving duplicate city for the same user
    const existing = await Weather.findOne({
      userId: user.id,
      cityName: { $regex: new RegExp(`^${req.body.cityName}$`, "i") }
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const newFavorite = await Weather.create({
      ...req.body,
      userId: user.id
    });
    res.status(201).json(newFavorite);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// 3. GET SINGLE WEATHER RECORD
router.get("/:id", async (req, res) => {
  try {
    const w = await Weather.findById(req.params.id);
    w ? res.json(w) : res.status(404).json({ message: "Weather record not found" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// 4. PUT UPDATE WEATHER RECORD
router.put("/:id", async (req, res) => {
  try {
    const w = await Weather.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    w ? res.json(w) : res.status(404).json({ message: "Weather record not found" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// 5. DELETE FAVORITE (User can only delete their own)
router.delete("/:id", async (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const query = user.role === "admin" 
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: user.id };

    const deleted = await Weather.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ message: "Favorite record not found or not owned by user." });
    }
    res.json({ message: "Weather record deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
