import express from "express";
import ChatLog from "../models/ChatLog.js";
import StudyPlan from "../models/StudyPlan.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * Staff-only endpoints
 * Requires: valid JWT + role=staff
 */
router.use(requireAuth, requireRole("staff"));

/**
 * GET /staff/summary?days=7
 * Returns counts and top categories/sentiment for last N days.
 */
router.get("/summary", async (req, res) => {
  try {
    const days = Number(req.query.days || 7);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const pipeline = [
      { $match: { role: "user", createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          stress: { $sum: { $cond: [{ $eq: ["$category", "Stress"] }, 1, 0] } },
          workload: { $sum: { $cond: [{ $eq: ["$category", "Workload"] }, 1, 0] } },
          motivation: { $sum: { $cond: [{ $eq: ["$category", "Motivation"] }, 1, 0] } },
          pos: { $sum: { $cond: [{ $eq: ["$sentiment", "positive"] }, 1, 0] } },
          neu: { $sum: { $cond: [{ $eq: ["$sentiment", "neutral"] }, 1, 0] } },
          neg: { $sum: { $cond: [{ $eq: ["$sentiment", "negative"] }, 1, 0] } },
        },
      },
    ];

    const [agg] = await ChatLog.aggregate(pipeline);

    return res.json({
      days,
      totalMessages: agg?.totalMessages || 0,
      categoryCounts: {
        Stress: agg?.stress || 0,
        Workload: agg?.workload || 0,
        Motivation: agg?.motivation || 0,
      },
      sentimentCounts: {
        positive: agg?.pos || 0,
        neutral: agg?.neu || 0,
        negative: agg?.neg || 0,
      },
    });
  } catch (err) {
    console.error("staff summary error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /staff/sentiment-trend?days=14
 * Returns per-day counts: positive/neutral/negative.
 */
router.get("/sentiment-trend", async (req, res) => {
  try {
    const days = Number(req.query.days || 14);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await ChatLog.aggregate([
      { $match: { role: "user", createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          positive: { $sum: { $cond: [{ $eq: ["$sentiment", "positive"] }, 1, 0] } },
          neutral: { $sum: { $cond: [{ $eq: ["$sentiment", "neutral"] }, 1, 0] } },
          negative: { $sum: { $cond: [{ $eq: ["$sentiment", "negative"] }, 1, 0] } },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]);

    const formatted = data.map((row) => {
      const mm = String(row._id.m).padStart(2, "0");
      const dd = String(row._id.d).padStart(2, "0");
      return {
        date: `${row._id.y}-${mm}-${dd}`,
        positive: row.positive,
        neutral: row.neutral,
        negative: row.negative,
      };
    });

    return res.json({ days, data: formatted });
  } catch (err) {
    console.error("staff sentiment-trend error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /staff/plans-trend?days=14
 * Counts study plans generated per day.
 */
router.get("/plans-trend", async (req, res) => {
  try {
    const days = Number(req.query.days || 14);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await StudyPlan.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]);

    const formatted = data.map((row) => {
      const mm = String(row._id.m).padStart(2, "0");
      const dd = String(row._id.d).padStart(2, "0");
      return { date: `${row._id.y}-${mm}-${dd}`, count: row.count };
    });

    return res.json({ days, data: formatted });
  } catch (err) {
    console.error("staff plans-trend error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /staff/peak-hours?days=7
 * Returns message counts by hour (UTC).
 */
router.get("/peak-hours", async (req, res) => {
  try {
    const days = Number(req.query.days || 7);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await ChatLog.aggregate([
      { $match: { role: "user", createdAt: { $gte: since } } },
      { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const formatted = data.map((r) => ({
      hour: `${String(r._id).padStart(2, "0")}:00`,
      count: r.count,
    }));

    return res.json({ days, data: formatted });
  } catch (err) {
    console.error("staff peak-hours error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/recent", async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 200);

  const logs = await ChatLog.find({ role: "user" })
    .select("content language sentiment category createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({ logs });
});

export default router;
