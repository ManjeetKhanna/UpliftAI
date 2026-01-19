import Reminder from "../models/Reminder.js";
import { sendReminderEmail } from "../services/emailService.js";

// Email subject by language
function subject(lang) {
  return lang === "es"
    ? "Tu recordatorio diario — UpliftAI"
    : "Your daily reminder — UpliftAI";
}

// Main reminder body
function body(lang) {
  return lang === "es"
    ? "Hola — pequeño recordatorio: elige 1 tarea académica pequeña para hoy y 1 cosa para tu bienestar (agua, estiramiento, respiración). Tú puedes."
    : "Hi — quick reminder: pick 1 small academic task for today and 1 wellness action (water, stretch, breathing). You’ve got this.";
}

// Why they are receiving this email (important for spam filters)
function whyText(lang) {
  return lang === "es"
    ? "Recibes este correo porque activaste recordatorios diarios en UpliftAI."
    : "You’re receiving this because you opted into daily reminders in UpliftAI.";
}

// Runs every minute from cron
export async function runReminderTick() {
  try {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, "0");
    const mm = String(now.getUTCMinutes()).padStart(2, "0");
    const current = `${hh}:${mm}`;

    console.log("⏱ Reminder tick UTC:", current);

    const due = await Reminder.find({
      isActive: true,
      timeUtc: current,
    }).lean();

    console.log("📬 Reminders due now:", due.length);

    for (const r of due) {
      try {
        const unsubscribeUrl = `${process.env.APP_BASE_URL}/unsubscribe?token=${r.unsubscribeToken}`;

        const text = `${body(r.lang)}

${whyText(r.lang)}
Unsubscribe: ${unsubscribeUrl}`;

        const html = `
          <p>${body(r.lang)}</p>
          <p>${whyText(r.lang)}</p>
          <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
        `;

        await sendReminderEmail({
          to: r.email,
          subject: subject(r.lang),
          text,
          html,
        });

        await Reminder.updateOne(
          { _id: r._id },
          { $set: { lastSentAt: new Date() } }
        );

        console.log("✅ Reminder sent to:", r.email);
      } catch (err) {
        console.error(
          "❌ Reminder send failed for",
          r.email,
          err?.message || err
        );
      }
    }
  } catch (err) {
    console.error("❌ Reminder job failed:", err?.message || err);
  }
}
