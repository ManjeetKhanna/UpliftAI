import React, { useState } from "react";
import t from "../utils/i18n.js";

function Chat({ lang, messages, setMessages }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const text = message.trim();
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language: lang }),
      });

      const data = await res.json();
      const aiText = data.reply || data.response || "…";
      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: lang === "en" ? "Something went wrong." : "Algo salió mal." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={h2}>{t("chat", lang)}</h2>

      <div style={chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 2 }}>
              {m.role === "user" ? (lang === "en" ? "You" : "Tú") : "UpliftAI"}
            </div>
            <div style={bubble(m.role)}>{m.content}</div>
          </div>
        ))}
        {loading && <em style={{ opacity: 0.8 }}>{lang === "en" ? "Thinking…" : "Pensando…"}</em>}
      </div>

      <div style={inputRow}>
        <input
          type="text"
          value={message}
          placeholder={lang === "en" ? "Type your message..." : "Escribe tu mensaje..."}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={input}
        />
        <button onClick={sendMessage} style={btn}>
          {lang === "en" ? "Send" : "Enviar"}
        </button>
      </div>
    </div>
  );
}

const h2 = { margin: 0, marginBottom: 10, fontSize: 16, fontWeight: 900 };

const chatBox = {
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.03)",
  borderRadius: 14,
  padding: 12,
  height: 280,
  overflowY: "auto",
};

const bubble = (role) => ({
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: role === "user" ? "rgba(110,168,255,0.18)" : "rgba(255,255,255,0.06)",
});

const inputRow = { display: "flex", gap: 8, marginTop: 10 };

const input = {
  flex: 1,
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#e8eefc",
  outline: "none",
};

const btn = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(110,168,255,0.25)",
  color: "#e8eefc",
  cursor: "pointer",
  fontWeight: 900,
  whiteSpace: "nowrap",
};

export default Chat;
