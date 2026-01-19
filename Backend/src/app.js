import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.js";
import scheduleRoutes from "./routes/schedule.js";
import sentimentRoutes from "./routes/sentiment.js";
import staffRoutes from "./routes/staff.js";
import rateLimit from "express-rate-limit";
import reminderRoutes from "./routes/reminders.js";
import emailTestRoutes from "./routes/emailTest.js";
import remindersTestRoutes from "./routes/remindersTest.js";
import remindersRoutes from "./routes/reminders.js";
import authRoutes from "./routes/auth.js";
import { requireAuth, requireRole } from "./middleware/auth.js";
import studyPlanRoutes from "./routes/studyPlan.js";


const app = express();

app.use(cors());
app.use(express.json());

// Basic abuse protection (important for free-tier LLMs)
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Rate limit exceeded",
    reply: "Too many requests. Please wait a bit and try again.",
  },
});

// Apply only to chat endpoint (keeps schedule/staff usable)
app.use("/chat", chatLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "UpliftAI backend running" });
});

app.use("/chat", chatRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/sentiment-log", sentimentRoutes);
app.use("/staff", staffRoutes);
app.use("/reminders", reminderRoutes);
app.use("/debug", emailTestRoutes);
app.use("/reminders-test", remindersTestRoutes);
app.use("/reminders", remindersRoutes);
app.use("/auth", authRoutes);
app.use("/staff", requireAuth, requireRole("staff"), staffRoutes);
app.use("/study-plan", studyPlanRoutes);



export default app;
