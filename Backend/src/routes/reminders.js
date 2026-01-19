import express from "express";
import crypto from "crypto";
import Reminder from "../models/Reminder.js";
import { DateTime } from "luxon";

const router = express.Router();

// Create or update a reminder
router.post("/", async (req, res) => {
  try {
    const { email, lang = "en", localTime, timeZone } = req.body;

    if (!email || !localTime || !timeZone) {
      return res.status(400).json({ error: "email, localTime, timeZone are required" });
    }

    // Validate localTime format HH:MM
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.test(localTime);
    if (!match) return res.status(400).json({ error: "localTime must be HH:MM (24h)" });

    // Convert today's localTime in user's timezone to UTC HH:MM
    const [hh, mm] = localTime.split(":").map(Number);

    const now = DateTime.now().setZone(timeZone);
    if (!now.isValid) return res.status(400).json({ error: "Invalid timeZone" });

    const localDateTime = now.set({ hour: hh, minute: mm, second: 0, millisecond: 0 });
    const utcDateTime = localDateTime.toUTC();
    const timeUtc = utcDateTime.toFormat("HH:mm");

    const normalizedEmail = email.toLowerCase().trim();

    // Upsert so user can change time later
    const existing = await Reminder.findOne({ email: normalizedEmail });

    if (existing) {
      existing.lang = lang;
      existing.localTime = localTime;
      existing.timeZone = timeZone;
      existing.timeUtc = timeUtc;
      existing.isActive = true;
      await existing.save();

      return res.json({ ok: true, updated: true, timeUtc });
    }

    const unsubscribeToken = crypto.randomBytes(24).toString("hex");

    await Reminder.create({
      email: normalizedEmail,
      lang,
      localTime,
      timeZone,
      timeUtc,
      isActive: true,
      unsubscribeToken,
    });

    return res.json({ ok: true, created: true, timeUtc });
  } catch (err) {
    console.error("reminders route error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Unsubscribe
router.get("/unsubscribe", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token");

    const r = await Reminder.findOne({ unsubscribeToken: token });
    if (!r) return res.status(404).send("Not found");

    r.isActive = false;
    await r.save();

    return res.send("You have been unsubscribed. ✅");
  } catch (err) {
    console.error("unsubscribe error:", err);
    return res.status(500).send("Server error");
  }
});

export default router;
