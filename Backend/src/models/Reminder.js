import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    lang: { type: String, enum: ["en", "es"], default: "en" },

    // Store what the user picked
    localTime: { type: String, required: true },   // "HH:MM" local
    timeZone: { type: String, required: true },    // e.g. "America/Los_Angeles"

    // Store what cron uses
    timeUtc: { type: String, required: true },     // "HH:MM" UTC

    isActive: { type: Boolean, default: true },
    unsubscribeToken: { type: String, required: true, unique: true },
    lastSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
