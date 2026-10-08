const express = require("express");
const router = express.Router();
const Weather = require("../models/Weather");

router.post("/", async (req, res) => {
  try { res.status(201).json(await Weather.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.get("/", async (req, res) => {
  try { res.json(await Weather.find()); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const w = await Weather.findById(req.params.id);
    w ? res.json(w) : res.status(404).json({ message: "Weather record not found" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const w = await Weather.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    w ? res.json(w) : res.status(404).json({ message: "Weather record not found" });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const w = await Weather.findByIdAndDelete(req.params.id);
    w ? res.json({ message: "Weather record deleted successfully" }) : res.status(404).json({ message: "Weather record not found" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
