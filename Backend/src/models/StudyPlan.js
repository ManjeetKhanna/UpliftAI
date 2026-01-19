import mongoose from "mongoose";

const StudyBlockSchema = new mongoose.Schema(
  {
    time: { type: String, default: "" },
    task: { type: String, default: "" },
    durationMinutes: { type: Number, default: 0 },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const StudyDaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    blocks: { type: [StudyBlockSchema], default: [] },
  },
  { _id: false }
);

const StudyPlanSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "anonymous", index: true },
    language: { type: String, default: "en" },

    // Inputs
    courses: { type: [String], default: [] },
    workHoursPerWeek: { type: Number, default: 0 },
    commuteMinutesPerDay: { type: Number, default: 0 },
    daysPerWeek: { type: Number, default: 7 },
    focus: { type: String, default: "" },

    // Output (stored)
    overview: { type: String, default: "" },
    weeklyPlan: { type: [StudyDaySchema], default: [] },
    tips: { type: [String], default: [] },
    copingToolbox: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("StudyPlan", StudyPlanSchema);
