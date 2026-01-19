import React, { useState } from "react";
import { useAuth } from "../state/auth.jsx";

export default function StudyPlan({ lang }) {
  const { token } = useAuth();

  const [courseInput, setCourseInput] = useState("CS 5781, DB, ML");
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState(20);
  const [commuteMinutesPerDay, setCommuteMinutesPerDay] = useState(60);
  const [daysPerWeek, setDaysPerWeek] = useState(7);
  const [focus, setFocus] = useState("");

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLast, setLoadingLast] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const generate = async () => {
    setErrMsg("");
    const courses = courseInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    if (courses.length === 0) {
      setErrMsg(lang === "es" ? "Agrega al menos 1 curso." : "Add at least 1 course.");
      return;
    }

    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          language: lang,
          courses,
          workHoursPerWeek,
          commuteMinutesPerDay,
          daysPerWeek,
          focus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setPlan(data.plan);
    } catch (e) {
      setErrMsg(e.message || (lang === "es" ? "Error." : "Error."));
    } finally {
      setLoading(false);
    }
  };

  const loadLast = async () => {
    setErrMsg("");
    setLoadingLast(true);

    try {
      const res = await fetch("/api/study-plan/last", {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      if (!data.plan) {
        setErrMsg(lang === "es" ? "No hay plan guardado aún." : "No saved plan yet.");
        setPlan(null);
        return;
      }

      // data.plan includes DB fields — map to the display shape
      setPlan({
        overview: data.plan.overview || "",
        weeklyPlan: data.plan.weeklyPlan || [],
        tips: data.plan.tips || [],
        copingToolbox: data.plan.copingToolbox || [],
      });

      // Also populate inputs from stored plan context (nice UX)
      if (Array.isArray(data.plan.courses)) setCourseInput(data.plan.courses.join(", "));
      if (typeof data.plan.workHoursPerWeek === "number") setWorkHoursPerWeek(data.plan.workHoursPerWeek);
      if (typeof data.plan.commuteMinutesPerDay === "number") setCommuteMinutesPerDay(data.plan.commuteMinutesPerDay);
      if (typeof data.plan.daysPerWeek === "number") setDaysPerWeek(data.plan.daysPerWeek);
      if (typeof data.plan.focus === "string") setFocus(data.plan.focus);
    } catch (e) {
      setErrMsg(e.message || (lang === "es" ? "Error." : "Error."));
    } finally {
      setLoadingLast(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>
            {lang === "es" ? "Plan de estudio (IA)" : "Study Plan (AI)"}
          </div>
          <div style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>
            {lang === "es"
              ? "Genera un plan semanal realista basado en tus cursos y tu carga de trabajo."
              : "Generate a realistic weekly plan based on your courses and workload."}
          </div>
        </div>

        <button onClick={loadLast} disabled={loadingLast} style={secondaryBtn}>
          {loadingLast ? (lang === "es" ? "Cargando…" : "Loading…") : (lang === "es" ? "Cargar último" : "Load last")}
        </button>
      </div>

      <div style={grid}>
        <Field label={lang === "es" ? "Cursos (separados por coma)" : "Courses (comma-separated)"}>
          <input value={courseInput} onChange={(e) => setCourseInput(e.target.value)} style={input} />
        </Field>

        <Field label={lang === "es" ? "Horas de trabajo/semana" : "Work hours/week"}>
          <input
            type="number"
            value={workHoursPerWeek}
            onChange={(e) => setWorkHoursPerWeek(Number(e.target.value))}
            style={input}
          />
        </Field>

        <Field label={lang === "es" ? "Traslado (minutos/día)" : "Commute (minutes/day)"}>
          <input
            type="number"
            value={commuteMinutesPerDay}
            onChange={(e) => setCommuteMinutesPerDay(Number(e.target.value))}
            style={input}
          />
        </Field>

        <Field label={lang === "es" ? "Días a planear" : "Days to plan"}>
          <input
            type="number"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            style={input}
          />
        </Field>

        <Field label={lang === "es" ? "Enfoque (opcional)" : "Focus (optional)"}>
          <input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            style={input}
            placeholder={lang === "es" ? "ej: exámenes la próxima semana" : "e.g. midterms next week"}
          />
        </Field>
      </div>

      <button onClick={generate} disabled={loading} style={btn}>
        {loading ? (lang === "es" ? "Generando…" : "Generating…") : (lang === "es" ? "Generar plan" : "Generate plan")}
      </button>

      {errMsg && <div style={{ marginTop: 10, color: "#ffb4b4" }}>{errMsg}</div>}

      {plan && (
        <div style={{ marginTop: 14 }}>
          <SectionTitle>{lang === "es" ? "Resumen" : "Overview"}</SectionTitle>
          <Box>{plan.overview}</Box>

          {Array.isArray(plan.weeklyPlan) && plan.weeklyPlan.length > 0 && (
            <>
              <SectionTitle>{lang === "es" ? "Plan semanal" : "Weekly plan"}</SectionTitle>
              <div style={{ display: "grid", gap: 10 }}>
                {plan.weeklyPlan.map((d, idx) => (
                  <Box key={idx}>
                    <div style={{ fontWeight: 900, marginBottom: 6 }}>{d.day}</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {(d.blocks || []).map((b, j) => (
                        <li key={j} style={{ marginBottom: 6 }}>
                          <strong>{b.time}</strong> — {b.task}
                          {b.notes ? <span style={{ opacity: 0.8 }}> ({b.notes})</span> : null}
                        </li>
                      ))}
                    </ul>
                  </Box>
                ))}
              </div>
            </>
          )}

          {Array.isArray(plan.tips) && plan.tips.length > 0 && (
            <>
              <SectionTitle>{lang === "es" ? "Consejos" : "Tips"}</SectionTitle>
              <Box>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {plan.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </Box>
            </>
          )}

          {Array.isArray(plan.copingToolbox) && plan.copingToolbox.length > 0 && (
            <>
              <SectionTitle>{lang === "es" ? "Herramientas de afrontamiento" : "Coping toolbox"}</SectionTitle>
              <Box>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {plan.copingToolbox.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </Box>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", minWidth: 0 }}>
      <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ marginTop: 12, marginBottom: 8, fontSize: 13, fontWeight: 900, opacity: 0.9 }}>
      {children}
    </div>
  );
}

function Box({ children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: 12,
      }}
    >
      {children}
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
  marginTop: 12,
  alignItems: "start",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
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

const secondaryBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#e8eefc",
  cursor: "pointer",
  fontWeight: 900,
};
