import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cron from "node-cron";
import { runReminderTick } from "./jobs/reminderJob.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

console.log("Mongo URI loaded:", process.env.MONGODB_URI ? "YES" : "NO");

let cronStarted = false;

async function start() {
  try {
    // ✅ Connect first
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // ✅ Start cron only once DB is ready
    if (!cronStarted) {
      cron.schedule("* * * * *", async () => {
        try {
          await runReminderTick();
        } catch (e) {
          console.error("❌ Reminder tick crashed:", e?.message || e);
        }
      });
      cronStarted = true;
      console.log("✅ Reminder cron started");
    }

    // ✅ Start server (bind publicly for Lightsail)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // fail fast in cloud if DB is wrong
  }
}

start();
