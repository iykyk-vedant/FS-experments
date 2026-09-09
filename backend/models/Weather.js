const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    temperature: {
      type: Number,
      required: true
    },
    condition: {
      type: String,
      required: true
    },
    humidity: {
      type: Number
    },
    windSpeed: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Weather", weatherSchema);
