import React, { useEffect, useMemo, useState } from "react";
import { t } from "../utils/i18n.js";

const STORAGE_KEY = "upliftai_wellness_tips_v1";

export default function Wellness({ lang = "en" }) {
  const defaults = useMemo(
    () => [
      "Take 5 deep breaths",
      "Step outside for 10 minutes",
      "Stretch for 5 minutes",
      "Write down one positive thing",
      "Drink water",
    ],
    []
  );

  const [tips, setTips] = useState(defaults);
  const [custom, setCustom] = useState("");

  // Load once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      // Keep saved tips, but ensure defaults exist at least once
      const merged = [...parsed];
      for (const d of defaults) {
        if (!merged.includes(d)) merged.push(d);
      }
      setTips(merged);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever tips changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tips));
    } catch {
      // ignore (private mode, etc.)
    }
  }, [tips]);

  const addTip = () => {
    const v = custom.trim();
    if (!v) return;
    setTips((prev) => [v, ...prev]);
    setCustom("");
  };

  const removeTip = (idx) => {
    setTips((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ padding: 5 }}>
      <h2 style={styles.h2}>{t("wellness", lang)}</h2>
      <p style={styles.sub}>{t("wellnessHint", lang)}</p>

      <ul style={styles.list}>
        {tips.map((tip, idx) => (
          <li key={`${tip}-${idx}`} style={styles.item}>
            <span>{tip}</span>
            <button onClick={() => removeTip(idx)} style={styles.x} type="button" aria-label="Remove tip">
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div style={styles.row}>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder={t("addYourTip", lang)}
          style={styles.input}
        />
        <button onClick={addTip} style={styles.btn} type="button">
          {t("add", lang)}
        </button>
      </div>
    </div>
  );
}

const styles = {
  h2: { fontSize: 18, fontWeight: 900, marginBottom: 6 },
  sub: { marginTop: 0, marginBottom: 10, opacity: 0.85, fontSize: 13, lineHeight: 1.4 },
  list: { margin: 0, paddingLeft: 16 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  x: {
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer",
    padding: "6px 10px",
    opacity: 0.85,
  },
  row: { display: "flex", gap: 10, marginTop: 10 },
  input: {
    flex: 1,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    outline: "none",
  },
  btn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(110,168,255,0.25)",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
  },
};
