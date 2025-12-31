import React from "react";

function Wellness() {
  const tips = [
    "Take 5 deep breaths",
    "Step outside for 10 minutes",
    "Stretch for 5 minutes",
    "Write down one positive thing"
  ];

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h2>Wellness Toolbox</h2>
      <ul>
        {tips.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}

export default Wellness;
