import React, { useState } from "react";

function ScheduleForm() {
  const [courses, setCourses] = useState(4);
  const [workHours, setWorkHours] = useState(20);
  const [commuteMinutes, setCommuteMinutes] = useState(60);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async () => {
    const res = await fetch("http://localhost:5000/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courses, workHours, commuteMinutes }),
    });
    const data = await res.json();
    setPlan(data.weeklyPlan);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h2>Schedule Generator</h2>
      <label>Courses: <input type="number" value={courses} onChange={e => setCourses(e.target.value)} /></label><br />
      <label>Work Hours: <input type="number" value={workHours} onChange={e => setWorkHours(e.target.value)} /></label><br />
      <label>Commute Minutes: <input type="number" value={commuteMinutes} onChange={e => setCommuteMinutes(e.target.value)} /></label><br />
      <button onClick={handleGenerate}>Generate Schedule</button>

      {plan && (
        <div style={{ marginTop: "10px" }}>
          <h3>Weekly Plan</h3>
          {plan.map((day, i) => (
            <div key={i}>
              <strong>{day.day}</strong>
              <ul>
                {day.blocks.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduleForm;
