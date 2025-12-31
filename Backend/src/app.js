import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.js";
import scheduleRoutes from "./routes/schedule.js";
import sentimentRoutes from "./routes/sentiment.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "UpliftAI backend running" });
});

app.use("/chat", chatRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/sentiment-log", sentimentRoutes);

export default app;
