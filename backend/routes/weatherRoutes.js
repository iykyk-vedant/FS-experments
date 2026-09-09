const express = require("express");
const router = express.Router();
const Weather = require("../models/Weather");

// 1. CREATE WEATHER
router.post("/", async (req, res) => {
  try {
    const weather = await Weather.create(req.body);
    res.status(201).json(weather);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. GET ALL WEATHERS
router.get("/", async (req, res) => {
  try {
    const weathers = await Weather.find();
    res.status(200).json(weathers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. GET WEATHER BY ID
router.get("/:id", async (req, res) => {
  try {
    const weather = await Weather.findById(req.params.id);
    if (!weather) {
      return res.status(404).json({ message: "Weather record not found" });
    }
    res.status(200).json(weather);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. UPDATE WEATHER
router.put("/:id", async (req, res) => {
  try {
    const weather = await Weather.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!weather) {
      return res.status(404).json({ message: "Weather record not found" });
    }
    res.status(200).json(weather);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. DELETE WEATHER
router.delete("/:id", async (req, res) => {
  try {
    const weather = await Weather.findByIdAndDelete(req.params.id);
    if (!weather) {
      return res.status(404).json({ message: "Weather record not found" });
    }
    res.status(200).json({ message: "Weather record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
