const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters")
  ],
  registerUser
);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

module.exports = router;
