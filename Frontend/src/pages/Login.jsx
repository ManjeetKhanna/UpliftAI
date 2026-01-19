import React, { useState } from "react";
import { useAuth } from "../state/auth.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      if (!data.token) throw new Error("No token returned from server");

      // ✅ keep your current working logic
      login(data.token);

      const role = data.role; // backend returns it in your setup
      nav(role === "staff" ? "/staff" : "/student");
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <AuthBackground>
      <div style={card}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.2 }}>
            UpliftAI
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
            Welcome back
          </div>
        </div>

        <form onSubmit={submit}>
          <Field label="Email">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </Field>

          {err && <div style={errorBox}>{err}</div>}

          <button type="submit" style={primaryBtn}>
            Login
          </button>

          <div style={{ marginTop: 12, opacity: 0.85, fontSize: 13 }}>
            New here?{" "}
            <Link to="/register" style={linkStyle}>
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </AuthBackground>
  );
}

function AuthBackground({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url(/bg-study.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#0b1220",
      }}
    >
      {/* Overlay for readability */}
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.72), rgba(0,0,0,0.62), rgba(0,0,0,0.75))",
          padding: 16,
          display: "grid",
          placeItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, fontWeight: 700 }}>
        {label}
      </div>
      {children}
    </label>
  );
}

const card = {
  width: "100%",
  maxWidth: 460,
  color: "#e8eefc",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 18,
  padding: 18,
  boxSizing: "border-box",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
};

const inputStyle = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.07)",
  color: "#e8eefc",
  outline: "none",
  boxSizing: "border-box",
};

const primaryBtn = {
  width: "100%",
  marginTop: 8,
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(110,168,255,0.28)",
  color: "#e8eefc",
  cursor: "pointer",
  fontWeight: 900,
  boxSizing: "border-box",
};

const errorBox = {
  marginTop: 6,
  marginBottom: 6,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,80,80,0.35)",
  background: "rgba(255,80,80,0.10)",
  color: "#ffd3d3",
  fontSize: 13,
};

const linkStyle = {
  color: "#bfe3ff",
  fontWeight: 800,
  textDecoration: "none",
};
