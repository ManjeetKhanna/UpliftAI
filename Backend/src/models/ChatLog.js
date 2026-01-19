import mongoose from "mongoose";

const chatLogSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    language: { type: String, enum: ["en", "es"], default: "en" },

    // analytics fields (only meaningful for role="user", but ok to store)
    sentiment: { type: String, default: "neutral" },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

export default mongoose.model("ChatLog", chatLogSchema);
