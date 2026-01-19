import React from "react";
import Staff from "./Staff.jsx"; // your existing staff dashboard component (in pages/Staff.jsx)

export default function StaffPage() {
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 22, fontWeight: 900 }}>Staff Dashboard</div>
        <div style={{ opacity: 0.8 }}>Anonymous sentiment and categories</div>
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: 14,
        }}
      >
        <Staff />
      </div>
    </div>
  );
}
