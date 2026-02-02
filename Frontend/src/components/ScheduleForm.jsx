import React, { useMemo, useState } from "react";

// If you have i18n, you can plug it back later.
// For now, keep it stable & clean.

export default function ScheduleForm({ lang = "en" }) {
  const [courses, setCourses] = useState(4);
  const [workHours, setWorkHours] = useState(20);
  const [commute, setCommute] = useState(60);

  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [err, setErr] = useState("");

  const days = useMemo(
    () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    []
  );

  const clampInt = (v, min, max) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, Math.round(n)));
  };

  const makeCourseNames = (count) => {
    // Friendly labels: Course 1, Course 2...
    return Array.from({ length: count }, (_, i) => `Course ${i + 1}`);
  };

  const intensityLabel = (level) => {
    if (level === "heavy") return "Heavy Focus";
    if (level === "medium") return "Medium Focus";
    return "Light Focus";
  };

  const intensityEmoji = (level) => {
    if (level === "heavy") return "🔴";
    if (level === "medium") return "🟡";
    return "🟢";
  };

  const splitWorkAcrossWeekdays = (hoursPerWeek) => {
    // Only Mon–Fri
    const weekdays = 5;
    const total = Math.max(0, hoursPerWeek);

    // Example: 20 => 4hrs/day
    const base = Math.floor(total / weekdays);
    const remainder = total % weekdays;

    // distribute remainder in first few days (Mon, Tue, ...)
    return Array.from({ length: weekdays }, (_, i) => base + (i < remainder ? 1 : 0));
  };

  const pickFocusCourses = (courseList, dayIndex) => {
    // Rotating focus pattern that feels realistic:
    // - Mon: 2 courses (heavy)
    // - Tue: 1 course (medium)
    // - Wed: 1 course (heavy)
    // - Thu: 1 course (medium)
    // - Fri: review of one earlier course (light)
    // - Sat: all courses (assignments/projects)
    // - Sun: light review + planning (no heavy “all courses”)
    const n = courseList.length;
    if (n === 0) return [];

    const mod = (x) => ((x % n) + n) % n;

    if (dayIndex === 0) return [courseList[mod(0)], courseList[mod(1)]]; // Monday
    if (dayIndex === 1) return [courseList[mod(2)]]; // Tuesday
    if (dayIndex === 2) return [courseList[mod(3)]]; // Wednesday
    if (dayIndex === 3) return [courseList[mod(0)]]; // Thursday (review/continue)
    if (dayIndex === 4) return [courseList[mod(1)]]; // Friday (light review)
    if (dayIndex === 5) return [...courseList]; // Saturday
    return [courseList[mod(2)]]; // Sunday (light review + plan)
  };

  const dayIntensity = (dayIndex) => {
    // Simple, believable pattern:
    // Mon heavy, Tue medium, Wed heavy, Thu medium, Fri light, Sat heavy, Sun light
    if (dayIndex === 0) return "heavy";
    if (dayIndex === 1) return "medium";
    if (dayIndex === 2) return "heavy";
    if (dayIndex === 3) return "medium";
    if (dayIndex === 4) return "light";
    if (dayIndex === 5) return "heavy";
    return "light";
  };

  const generate = () => {
    setErr("");

    const c = clampInt(courses, 1, 10);
    const w = clampInt(workHours, 0, 80);
    const m = clampInt(commute, 0, 240);

    const courseList = makeCourseNames(c);
    const workSplit = splitWorkAcrossWeekdays(w); // [Mon..Fri hours]

    const plan = days.map((day, idx) => {
      const intensity = dayIntensity(idx);
      const focusCourses = pickFocusCourses(courseList, idx);

      const items = [];

      // Study block
      if (idx === 5) {
        // Saturday
        items.push(`Deep work: assignments/projects across ${c} course(s)`);
      } else if (idx === 6) {
        // Sunday
        items.push(`Light review: ${focusCourses.join(", ")}`);
        items.push("Plan next week + organize tasks");
      } else {
        // Weekdays
        if (focusCourses.length === 2) {
          items.push(`Study focus: ${focusCourses[0]} + ${focusCourses[1]}`);
        } else {
          items.push(`Study focus: ${focusCourses[0]}`);
        }
      }

      // Work only Mon–Fri if workHours > 0
      if (idx <= 4 && w > 0) {
        const hrs = workSplit[idx] || 0;
        if (hrs > 0) items.push(`Work: ~${hrs} hr`);
      }

      // Commute only when you have work/class (Mon–Fri) and commute > 0
      if (idx <= 4 && m > 0) {
        items.push(`Commute: ${m} min`);
      }

      // Add a small “recovery” note on lighter days
      if (intensity === "light") {
        items.push("Recovery: short walk / early night");
      }

      return {
        day,
        intensity,
        items,
      };
    });

    setWeeklyPlan(plan);
  };

  return (
    <div style={{ padding: 6 }}>
      <div style={{ marginBottom: 10 }}>
        <h2 style={styles.h2}>Academic Schedule Generator</h2>
        <p style={styles.sub}>
          Generates a realistic weekly rhythm based on your load (courses, work, commute).
        </p>
      </div>

      <div style={styles.formGrid}>
        <Field label="Courses">
          <input
            type="number"
            min={1}
            max={10}
            value={courses}
            onChange={(e) => setCourses(e.target.value)}
            style={styles.input}
          />
        </Field>

        <Field label="Work hours/week">
          <input
            type="number"
            min={0}
            max={80}
            value={workHours}
            onChange={(e) => setWorkHours(e.target.value)}
            style={styles.input}
          />
        </Field>

        <Field label="Commute (minutes)">
          <input
            type="number"
            min={0}
            max={240}
            value={commute}
            onChange={(e) => setCommute(e.target.value)}
            style={styles.input}
          />
        </Field>

        <button type="button" onClick={generate} style={styles.btn}>
          Generate Schedule
        </button>
      </div>

      {err && <div style={styles.err}>{err}</div>}

      {weeklyPlan && (
        <div style={{ marginTop: 14 }}>
          <h3 style={styles.h3}>Weekly Plan</h3>

          <div style={{ display: "grid", gap: 10 }}>
            {weeklyPlan.map((d) => (
              <div key={d.day} style={styles.dayCard}>
                <div style={styles.dayTop}>
                  <div style={{ fontWeight: 900 }}>{d.day}</div>
                  <div style={styles.badge}>
                    {intensityEmoji(d.intensity)} {intensityLabel(d.intensity)}
                  </div>
                </div>

                <ul style={styles.list}>
                  {d.items.map((it, i) => (
                    <li key={`${d.day}-${i}`} style={{ marginBottom: 6 }}>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={styles.note}>
            Tip: Use this as a baseline, then adjust based on exams, assignments, and real class times.
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6, fontWeight: 800 }}>
        {label}
      </div>
      {children}
    </label>
  );
}

const styles = {
  h2: { fontSize: 18, fontWeight: 900, margin: 0 },
  h3: { fontSize: 15, fontWeight: 900, margin: "10px 0 10px" },
  sub: { margin: "6px 0 0", opacity: 0.8, fontSize: 13, lineHeight: 1.4 },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    alignItems: "end",
  },

  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  },

  btn: {
    gridColumn: "1 / -1",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(110,168,255,0.25)",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
  },

  err: {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,80,80,0.35)",
    background: "rgba(255,80,80,0.10)",
    color: "#ffd3d3",
    fontSize: 13,
  },

  dayCard: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
  },

  dayTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },

  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    opacity: 0.92,
    fontWeight: 800,
  },

  list: { margin: 0, paddingLeft: 18 },

  note: {
    marginTop: 10,
    opacity: 0.8,
    fontSize: 12.5,
    lineHeight: 1.4,
  },
};