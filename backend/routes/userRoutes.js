const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// USER + ADMIN (Protected Dashboard)
router.get("/dashboard", protect, (req, res) => {
  res.json({ message: "Welcome to the protected dashboard", user: req.user });
});

// ADMIN ONLY (Protected Admin Route)
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin! You can access this page." });
});

// Profile route
router.get("/profile", protect, (req, res) => {
  res.json({ message: "User profile", user: req.user });
});

module.exports = router;
