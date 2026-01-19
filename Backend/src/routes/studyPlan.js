import express from "express";
import { getStudyPlan } from "../services/aiService.js";
import StudyPlan from "../models/StudyPlan.js";
import { authOptional } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /study-plan
 * Saves the generated plan to MongoDB.
 */
router.post("/", authOptional, async (req, res) => {
  try {
    const {
      language = "en",
      courses = [],
      workHoursPerWeek = 0,
      commuteMinutesPerDay = 0,
      daysPerWeek = 7,
      focus = "",
    } = req.body;

    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ error: "courses must be a non-empty array" });
    }

    // 1) Generate plan with Gemini
    const plan = await getStudyPlan({
      language,
      courses,
      workHoursPerWeek: Number(workHoursPerWeek) || 0,
      commuteMinutesPerDay: Number(commuteMinutesPerDay) || 0,
      daysPerWeek: Number(daysPerWeek) || 7,
      focus: String(focus || ""),
    });

    // 2) Save to DB
    const userId = req.user?.id || "anonymous";

    const saved = await StudyPlan.create({
      userId,
      language,
      courses,
      workHoursPerWeek: Number(workHoursPerWeek) || 0,
      commuteMinutesPerDay: Number(commuteMinutesPerDay) || 0,
      daysPerWeek: Number(daysPerWeek) || 7,
      focus: String(focus || ""),
      overview: plan?.overview || "",
      weeklyPlan: plan?.weeklyPlan || [],
      tips: plan?.tips || [],
      copingToolbox: plan?.copingToolbox || [],
    });

    return res.json({ plan, savedId: saved._id });
  } catch (err) {
    console.error("study-plan route error (full):", err);

    const status = err?.status || err?.response?.status;
    const msg = err?.message || "Unknown error";

    console.error("study-plan error status:", status);
    console.error("study-plan error message:", msg);

    return res.status(500).json({
      error: "Server error",
      debug: { status, msg },
      plan: null,
    });
  }
});

/**
 * GET /study-plan/last
 * Return most recent plan for logged-in user, or anonymous if not logged in.
 */
router.get("/last", authOptional, async (req, res) => {
  try {
    const userId = req.user?.id || "anonymous";

    const last = await StudyPlan.findOne({ userId }).sort({ createdAt: -1 }).lean();

    return res.json({ plan: last || null });
  } catch (err) {
    console.error("study-plan last error:", err?.message || err);
    return res.status(500).json({ error: "Server error", plan: null });
  }
});

export default router;
