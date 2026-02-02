import React, { useMemo, useRef, useState } from "react";
import { t } from "../utils/i18n.js";
import { apiFetch } from "../utils/api.js";

export default function Chat({ lang = "en", messages, setMessages }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const suggested = useMemo(
    () => [
      "I’m stressed about finals. Help me plan today.",
      "Which classes are hardest for me to focus on and why?",
      "Make me a plan for this week with work + commute.",
      "How do I start when I feel overwhelmed?",
    ],
    []
  );

  const send = async (msg) => {
    const content = (msg ?? text).trim();
    if (!content || loading) return;

    setLoading(true);
    setText("");

    const next = [...messages, { role: "user", content }];
    setMessages(next);

    try {
      const data = await apiFetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: content, lang }),
      });

      const assistant = data.reply || data.message || "(no response)";
      setMessages([...next, { role: "assistant", content: assistant }]);

      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch (e) {
      setMessages([
        ...next,
        { role: "assistant", content: `⚠️ ${e.message || "Failed to send"}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.h2}>{t("chatTitle", lang)}</h2>
      <p style={styles.sub}>{t("chatSubtitle", lang)}</p>

      <div style={styles.suggestWrap}>
        {suggested.map((s) => (
          <button key={s} style={styles.suggestBtn} onClick={() => send(s)} type="button">
            {s}
          </button>
        ))}
      </div>

      <div style={styles.box}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 10, opacity: 0.98 }}>
            <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 2 }}>
              {m.role === "user" ? "You" : "UpliftAI"}
            </div>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{m.content}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={styles.row}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("chatPlaceholder", lang)}
          style={styles.input}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button style={styles.btn} onClick={() => send()} disabled={loading} type="button">
          {loading ? (t("loading", lang) || "Loading...") : (t("send", lang) || "Send")}
        </button>
      </div>
    </div>
  );
}

const styles = {
  h2: { fontSize: 18, fontWeight: 900, marginBottom: 6 },
  sub: { marginTop: 0, marginBottom: 10, opacity: 0.8, fontSize: 13, lineHeight: 1.4 },

  suggestWrap: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  suggestBtn: {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    padding: "8px 10px",
    color: "white",
    fontSize: 12,
    cursor: "pointer",
    opacity: 0.9,
  },

  box: {
    height: 260,
    overflow: "auto",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.18)",
    padding: 12,
    marginBottom: 10,
  },
  row: { display: "flex", gap: 10, alignItems: "center" },
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
