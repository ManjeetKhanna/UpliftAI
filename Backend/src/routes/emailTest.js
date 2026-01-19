import express from "express";
import { sendReminderEmail } from "../services/emailService.js";

const router = express.Router();

router.post("/send-test", async (req, res) => {
  try {
    const { to } = req.body;
    if (!to) return res.status(400).json({ error: "to is required" });

    await sendReminderEmail({
      to,
      subject: "UpliftAI Test Email",
      text: "If you received this, SendGrid is working.",
      html: "<p>If you received this, SendGrid is working.</p>",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("send-test error:", err?.response?.body || err?.message || err);
    return res.status(500).json({
      ok: false,
      error: err?.message || "Send failed",
      details: err?.response?.body || null,
    });
  }
});

export default router;
