import express from "express";
import { analyzeMessage } from "../services/sentimentService.js";
import ChatLog from "../models/ChatLog.js";
import { getAiReply } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, language = "en" } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const trimmed = message.trim();

    // Sentiment & category from student message
    const { sentiment, category } = analyzeMessage(trimmed);

    // Save student message
    await ChatLog.create({
      role: "user",
      content: trimmed,
      language,
      sentiment,
      category,
    });

    // AI reply (Gemini via aiService.js)
    const aiReply = await getAiReply({ message: trimmed, language });

    // Save assistant reply
    await ChatLog.create({
      role: "assistant",
      content: aiReply,
      language,
    });

    return res.json({ reply: aiReply, sentiment, category });
  } catch (err) {
    console.error("chat route error (full):", err);
    return res.status(500).json({
      error: "Server error",
      reply: "Sorry — I’m having trouble responding right now. Please try again.",
    });
  }
});

export default router;
