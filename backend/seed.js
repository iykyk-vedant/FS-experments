const mongoose = require("mongoose");
require("dotenv").config();

const Weather = require("./models/Weather");

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/FullStackProject";

const sampleWeather = [
  {
    cityName: "Mumbai",
    country: "India",
    temperature: 32,
    condition: "Sunny",
    humidity: 72,
    windSpeed: 14
  },
  {
    cityName: "New York",
    country: "USA",
    temperature: 19,
    condition: "Partly Cloudy",
    humidity: 58,
    windSpeed: 18
  },
  {
    cityName: "Tokyo",
    country: "Japan",
    temperature: 21,
    condition: "Rainy",
    humidity: 80,
    windSpeed: 12
  },
  {
    cityName: "London",
    country: "UK",
    temperature: 16,
    condition: "Cloudy",
    humidity: 65,
    windSpeed: 20
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI, { dbName: "FullStackProject" });
    console.log("✅ Connected successfully!");

    console.log("Inserting sample weather records...");
    await Weather.deleteMany({});
    const createdWeather = await Weather.insertMany(sampleWeather);
    console.log(`✅ Seeded ${createdWeather.length} weather records`);

    console.log("✨ Database seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
