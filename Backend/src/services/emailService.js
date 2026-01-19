import dotenv from "dotenv";
dotenv.config();

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendReminderEmail({ to, subject, text, html }) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    replyTo: process.env.EMAIL_FROM, // helps trust
    subject,
    text,
    html,
  };

  await sgMail.send(msg);
}
