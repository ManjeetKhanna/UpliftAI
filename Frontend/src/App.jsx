import React from "react";
import Chat from "./components/Chat.jsx";
import ScheduleForm from "./components/ScheduleForm.jsx";
import Wellness from "./components/Wellness.jsx";

function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>UpliftAI — Student Micro-Advisor</h1>
      <Chat />
      <ScheduleForm />
      <Wellness />
    </div>
  );
}

export default App;
