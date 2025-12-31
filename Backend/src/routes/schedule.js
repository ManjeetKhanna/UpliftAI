import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const { courses, workHours, commuteMinutes } = req.body;

  res.json({
    weeklyPlan: [
      {
        day: "Monday",
        blocks: [
          `Study (${courses} courses)`,
          `Work (${workHours} hrs)`,
          `Commute (${commuteMinutes} min)`
        ]
      }
    ]
  });
});

export default router;
