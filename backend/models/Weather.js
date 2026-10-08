const mongoose = require("mongoose");

module.exports = mongoose.model("Weather", new mongoose.Schema({
  cityName: { type: String, required: true },
  country: { type: String, required: true },
  temperature: { type: Number, required: true },
  condition: { type: String, required: true },
  humidity: Number,
  windSpeed: Number
}, { timestamps: true }));
