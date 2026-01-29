import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api.js";

export default function Register() {
  const nav = useNavigate();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      nav("/login");
    } catch (e2) {
      setErr(e2?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div style={card}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.2 }}>
            Create account
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
            Student or Staff access
          </div>
        </div>

        <form onSubmit={submit}>
          <label style={{ display: "block", marginBottom: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, fontWeight: 700 }}>
              Role
            </div>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, fontWeight: 700 }}>
              Email
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, fontWeight: 700 }}>
              Password
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              autoComplete="new-password"
              placeholder="Create a strong password"
            />
          </label>

          {err && <div style={errorBox}>{err}</div>}

          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </button>

          <div style={{ marginTop: 12, opacity: 0.85, fontSize: 13 }}>
            Already have an account?{" "}
            <Link to="/login" style={linkStyle}>
              Login
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
