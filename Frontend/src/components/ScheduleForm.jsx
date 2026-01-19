import React, { useState } from "react";
import t from "../utils/i18n.js";

function ScheduleForm({ lang }) {
  const [courses, setCourses] = useState(4);
  const [workHours, setWorkHours] = useState(20);
  const [commuteMinutes, setCommuteMinutes] = useState(60);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async () => {
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courses, workHours, commuteMinutes }),
    });
    const data = await res.json();
    setPlan(data.weeklyPlan);
  };

  return (
    <div>
      <h2 style={h2}>{t("scheduleTitle", lang) || "Schedule Generator"}</h2>

      <div style={grid}>
        <label style={label}>
          {lang === "en" ? "Courses" : "Cursos"}
          <input type="number" value={courses} onChange={(e) => setCourses(Number(e.target.value))} style={input} />
        </label>

        <label style={label}>
          {lang === "en" ? "Work hours/week" : "Horas de trabajo/semana"}
          <input type="number" value={workHours} onChange={(e) => setWorkHours(Number(e.target.value))} style={input} />
        </label>

        <label style={label}>
          {lang === "en" ? "Commute (minutes)" : "Traslado (minutos)"}
          <input type="number" value={commuteMinutes} onChange={(e) => setCommuteMinutes(Number(e.target.value))} style={input} />
        </label>
      </div>

      <button onClick={handleGenerate} style={btn}>
        {lang === "en" ? "Generate Schedule" : "Generar horario"}
      </button>

      {plan && (
        <div style={{ marginTop: 12 }}>
          <h3 style={{ margin: "10px 0", fontSize: 14, fontWeight: 900 }}>
            {lang === "en" ? "Weekly Plan" : "Plan semanal"}
          </h3>
          <div style={{ display: "grid", gap: 10 }}>
            {plan.map((day, i) => (
              <div key={i} style={dayCard}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>{day.day}</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {day.blocks.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const h2 = { margin: 0, marginBottom: 10, fontSize: 16, fontWeight: 900 };

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 };

const label = { display: "grid", gap: 6, fontSize: 12, opacity: 0.9 };

const input = {
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#e8eefc",
  outline: "none",
};

const btn = {
  width: "100%",
  marginTop: 12,
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(110,168,255,0.25)",
  color: "#e8eefc",
  cursor: "pointer",
  fontWeight: 900,
};

const dayCard = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 14,
  padding: 12,
};

export default ScheduleForm;
