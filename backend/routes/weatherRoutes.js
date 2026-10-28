const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
let Weather;
try {
  Weather = require("../models/Weather");
} catch (e) {
  Weather = null;
}

// In-memory fallback dataset for seamless offline / non-mongo operation
let inMemoryWeather = [
  { _id: "1", cityName: "Mumbai", country: "India", temperature: 32, condition: "Sunny ☀️", humidity: 72, windSpeed: 14 },
  { _id: "2", cityName: "New York", country: "USA", temperature: 19, condition: "Partly Cloudy ⛅", humidity: 58, windSpeed: 18 },
  { _id: "3", cityName: "Tokyo", country: "Japan", temperature: 21, condition: "Rainy 🌧️", humidity: 80, windSpeed: 12 },
  { _id: "4", cityName: "London", country: "UK", temperature: 16, condition: "Foggy 🌫️", humidity: 75, windSpeed: 15 },
  { _id: "5", cityName: "Paris", country: "France", temperature: 18, condition: "Clear Sky ☀️", humidity: 60, windSpeed: 10 }
];

router.get("/", async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1 && Weather) {
      const docs = await Weather.find();
      if (docs && docs.length > 0) return res.json(docs);
    }
  } catch (err) {
    console.warn("MongoDB query failed, using in-memory weather data:", err.message);
  }
  res.json(inMemoryWeather);
});

router.post("/", async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1 && Weather) {
      const doc = await Weather.create(req.body);
      return res.status(201).json(doc);
    }
  } catch (err) {
    console.warn("MongoDB create failed, using in-memory store:", err.message);
  }
  const newRecord = {
    _id: String(Date.now()),
    cityName: req.body.cityName,
    country: req.body.country || "Unknown",
    temperature: req.body.temperature || 0,
    condition: req.body.condition || "Clear",
    humidity: req.body.humidity || 50,
    windSpeed: req.body.windSpeed || 10
  };
  inMemoryWeather.push(newRecord);
  res.status(201).json(newRecord);
});

router.get("/:id", async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1 && Weather) {
      const w = await Weather.findById(req.params.id);
      if (w) return res.json(w);
    }
  } catch (err) {}
  const item = inMemoryWeather.find((w) => w._id === req.params.id);
  item ? res.json(item) : res.status(404).json({ message: "Weather record not found" });
});

router.put("/:id", async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1 && Weather) {
      const w = await Weather.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (w) return res.json(w);
    }
  } catch (err) {}
  const index = inMemoryWeather.findIndex((w) => w._id === req.params.id);
  if (index !== -1) {
    inMemoryWeather[index] = { ...inMemoryWeather[index], ...req.body };
    return res.json(inMemoryWeather[index]);
  }
  res.status(404).json({ message: "Weather record not found" });
});

router.delete("/:id", async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1 && Weather) {
      const w = await Weather.findByIdAndDelete(req.params.id);
      if (w) return res.json({ message: "Weather record deleted successfully" });
    }
  } catch (err) {}
  const index = inMemoryWeather.findIndex((w) => w._id === req.params.id);
  if (index !== -1) {
    inMemoryWeather.splice(index, 1);
    return res.json({ message: "Weather record deleted successfully" });
  }
  res.status(404).json({ message: "Weather record not found" });
});

module.exports = router;
