import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const { sentiment, topic } = req.body;

  res.json({
    status: "logged",
    sentiment,
    topic
  });
});

export default router;
