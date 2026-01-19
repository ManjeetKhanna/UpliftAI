import express from "express";
import SentimentLog from "../models/SentimentLog.js";
import { analyzeMessage } from "../services/sentimentService.js";

const router = express.Router();

// POST → log student message
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const { sentiment, category } = analyzeMessage(message);

    const log = await SentimentLog.create({ sentiment, category });
    res.json({ success: true, log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET → aggregated stats for staff dashboard
router.get("/", async (req, res) => {
  try {
    const logs = await SentimentLog.find();

    // Aggregate by category
    const categoryCounts = logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {});

    // Aggregate sentiment over time (daily)
    const sentimentOverTime = logs.reduce((acc, log) => {
      const day = log.timestamp.toISOString().slice(0, 10);
      if (!acc[day]) acc[day] = { positive: 0, neutral: 0, negative: 0 };
      acc[day][log.sentiment] += 1;
      return acc;
    }, {});

    res.json({ categoryCounts, sentimentOverTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
