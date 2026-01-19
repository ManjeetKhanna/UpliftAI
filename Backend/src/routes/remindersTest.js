import express from "express";
import Reminder from "../models/Reminder.js";
import { sendReminderEmail } from "../services/emailService.js";

const router = express.Router();

router.post("/send-now", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "email is required" });

    const r = await Reminder.findOne({ email, isActive: true }).lean();
    if (!r) return res.status(404).json({ error: "No active reminder for this email" });

    const unsubscribeUrl = `${process.env.APP_BASE_URL}/unsubscribe?token=${r.unsubscribeToken}`;

    const subject = r.lang === "es" ? "Tu recordatorio diario — UpliftAI" : "Your daily reminder — UpliftAI";
    const msg = r.lang === "es"
      ? "Recordatorio rápido: elige 1 tarea pequeña para hoy y 1 acción de bienestar (agua, estiramiento, respiración)."
      : "Quick reminder: pick 1 small academic task for today and 1 wellness action (water, stretch, breathing).";

    const why = r.lang === "es"
      ? "Recibes este correo porque activaste recordatorios diarios en UpliftAI."
      : "You’re receiving this because you opted into daily reminders in UpliftAI.";

    await sendReminderEmail({
      to: r.email,
      subject,
      text: `${msg}\n\n${why}\nUnsubscribe: ${unsubscribeUrl}`,
      html: `<p>${msg}</p><p>${why}</p><p><a href="${unsubscribeUrl}">Unsubscribe</a></p>`,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("send-now error:", err?.response?.body || err?.message || err);
    return res.status(500).json({ ok: false, error: err?.message || "Send failed" });
  }
});

export default router;
