import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import chatRoutes from "./routes/chat.js";
import scheduleRoutes from "./routes/schedule.js";
import sentimentRoutes from "./routes/sentiment.js";
import staffRoutes from "./routes/staff.js";
import reminderRoutes from "./routes/reminders.js";
import emailTestRoutes from "./routes/emailTest.js";
import remindersTestRoutes from "./routes/remindersTest.js";
import authRoutes from "./routes/auth.js";
import studyPlanRoutes from "./routes/studyPlan.js";

import { requireAuth, requireRole } from "./middleware/auth.js";

const app = express();

/**
 * ✅ CORS (Vercel + local)
 * Set these in Lightsail .env:
 * FRONTEND_ORIGIN=https://your-vercel-domain.vercel.app
 * (optional) FRONTEND_ORIGIN_2=http://localhost:5173
 */
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.FRONTEND_ORIGIN_2 || "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (curl / server-to-server)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Rate limit only on /chat
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Rate limit exceeded",
    reply: "Too many requests. Please wait a bit and try again.",
  },
});
app.use("/chat", chatLimiter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "UpliftAI backend running" });
});

// Public routes
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/sentiment-log", sentimentRoutes);
app.use("/reminders", reminderRoutes);
app.use("/reminders-test", remindersTestRoutes);
app.use("/study-plan", studyPlanRoutes);

// Debug routes (optional)
app.use("/debug", emailTestRoutes);

// ✅ Staff routes protected
app.use("/staff", requireAuth, requireRole("staff"), staffRoutes);

export default app;