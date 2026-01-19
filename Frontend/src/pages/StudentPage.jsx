import React, { useState } from "react";
import Chat from "../components/Chat.jsx";
import ScheduleForm from "../components/ScheduleForm.jsx";
import Wellness from "../components/Wellness.jsx";
import ReminderSignup from "../components/ReminderSignup.jsx";
import StudyPlan from "../components/StudyPlan.jsx";

export default function StudentPage() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);

  return (
    <div>
      {/* Header row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Student</h1>
          <p className="text-sm text-slate-300">
            Chat, schedules, wellness, study plans, reminders
          </p>
        </div>

        <button
          onClick={() => setLang((v) => (v === "en" ? "es" : "en"))}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
          type="button"
        >
          {lang === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <Chat lang={lang} messages={messages} setMessages={setMessages} />
        </Card>

        <Card>
          <ScheduleForm lang={lang} />
        </Card>

        <Card>
          <Wellness lang={lang} />
        </Card>

        {/* Full-width blocks */}
        <Card className="lg:col-span-3">
          <StudyPlan lang={lang} />
        </Card>

        <Card className="lg:col-span-3">
          <ReminderSignup lang={lang} />
        </Card>
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.03] p-4",
        "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
