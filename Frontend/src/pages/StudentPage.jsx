import React, { useState } from "react";
import Chat from "../components/Chat.jsx";
import ScheduleForm from "../components/ScheduleForm.jsx";
import Wellness from "../components/Wellness.jsx";
import ReminderSignup from "../components/ReminderSignup.jsx";
import StudyPlan from "../components/StudyPlan.jsx";
import { t } from "../utils/i18n.js";

export default function StudentPage() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);

  return (
    <div>
      {/* Header row: keeps title centered, button on right */}
      <div className="mb-6 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="hidden sm:block" />

        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {t("studentTitle", lang)}
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            {t("studentSubtitle", lang)}
          </p>
        </div>

        <div className="flex justify-center sm:justify-end">
          <button
            onClick={() => setLang((v) => (v === "en" ? "es" : "en"))}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
            type="button"
          >
            {lang === "en" ? t("switchToSpanish", lang) : t("switchToEnglish", lang)}
          </button>
        </div>
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
