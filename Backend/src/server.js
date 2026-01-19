import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cron from "node-cron";
import { runReminderTick } from "./jobs/reminderJob.js";


dotenv.config();

const PORT = process.env.PORT || 5000;

console.log("Mongo URI loaded:", process.env.MONGODB_URI ? "YES" : "NO");

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// run every minute
cron.schedule("* * * * *", async () => {
  await runReminderTick();
});


app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
