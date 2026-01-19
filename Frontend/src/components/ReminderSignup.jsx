import React, { useMemo, useState } from "react";
import { useAuth } from "../state/auth.jsx";

export default function ReminderSignup({ lang }) {
  const { email: loggedEmail, token } = useAuth();

  const [email, setEmail] = useState(loggedEmail || "");
  const [localTime, setLocalTime] = useState("09:00");
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const label = useMemo(() => {
    return lang === "es"
      ? {
          title: "Recordatorios diarios",
          desc: "Te enviaremos un correo una vez al día a la hora que elijas.",
          email: "Correo",
          time: "Hora",
          tz: "Zona horaria",
          btn: "Activar recordatorio",
          ok: "¡Listo! Recordatorio guardado.",
          err: "No se pudo guardar. Intenta de nuevo.",
          saving: "Guardando…",
        }
      : {
          title: "Daily reminders",
          desc: "We’ll email you once a day at the time you choose.",
          email: "Email",
          time: "Time",
          tz: "Time zone",
          btn: "Enable reminder",
          ok: "Done! Reminder saved.",
          err: "Could not save. Please try again.",
          saving: "Saving…",
        };
  }, [lang]);

  const submit = async () => {
    setStatus({ type: "", msg: "" });
    setLoading(true);

    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email,
          lang,
          localTime,
          timeZone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setStatus({
        type: "ok",
        msg: `${label.ok} (UTC: ${data.timeUtc})`,
      });
    } catch (e) {
      setStatus({ type: "err", msg: e.message || label.err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{label.title}</div>
      <div style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>{label.desc}</div>

      <div style={grid}>
        <Field label={label.email}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
        </Field>

        <Field label={label.time}>
          <input
            type="time"
            value={localTime}
            onChange={(e) => setLocalTime(e.target.value)}
            style={{ ...input, appearance: "none" }}
          />
        </Field>

        <Field label={label.tz}>
          <input value={timeZone} onChange={(e) => setTimeZone(e.target.value)} style={input} />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            Example: America/Los_Angeles
          </div>
        </Field>
      </div>

      <button onClick={submit} disabled={loading} style={btn}>
        {loading ? label.saving : label.btn}
      </button>

      {status.msg && (
        <div style={{ marginTop: 10, color: status.type === "ok" ? "#b8ffcc" : "#ffb4b4" }}>
          {status.msg}
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
