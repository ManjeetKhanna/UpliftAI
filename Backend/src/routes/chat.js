import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const { message, language } = req.body;

  res.json({
    reply: `UpliftAI received: "${message}"`,
    language: language || "en"
  });
});

export default router;
