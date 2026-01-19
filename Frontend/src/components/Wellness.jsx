import React, { useState } from "react";
import t from "../utils/i18n.js";

const defaultTips = [
  "Take 5 deep breaths",
  "Step outside for 10 minutes",
  "Stretch for 5 minutes",
  "Write down one positive thing"
];

function Wellness({ lang }) {
  const [coping, setCoping] = useState([...defaultTips]);
  const [newTip, setNewTip] = useState("");

  const addTip = () => {
    if (newTip.trim() === "") return;
    setCoping([...coping, newTip.trim()]);
    setNewTip("");
  };

  const translateTip = (tip) => {
    if (lang === "en") return tip;
    const map = {
      "Take 5 deep breaths": "Respira profundo 5 veces",
      "Step outside for 10 minutes": "Sal afuera por 10 minutos",
      "Stretch for 5 minutes": "Estírate por 5 minutos",
      "Write down one positive thing": "Escribe algo positivo"
    };
    return map[tip] || tip;
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "30px", borderRadius: "5px" }}>
      <h2>{t("wellness", lang)}</h2>

      <ul>
        {coping.map((tip, i) => <li key={i}>{translateTip(tip)}</li>)}
      </ul>

      <input
        type="text"
        placeholder={lang === "en" ? "Add your own tip" : "Agrega tu propio consejo"}
        value={newTip}
        onChange={(e) => setNewTip(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "10px"
        }}
      />
      <button
        onClick={addTip}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#0088FE",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {t("addTip", lang)}
      </button>
    </div>
  );
}

export default Wellness;
