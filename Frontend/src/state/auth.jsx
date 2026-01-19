import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);

function decodeJwt(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    return t ? decodeJwt(t) : null;
  });

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    if (typeof token !== "string") {
      // safety: never store non-string token
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
      return;
    }

    localStorage.setItem("token", token);
    setUser(decodeJwt(token));
  }, [token]);

  // ✅ this is what Login.jsx should call
  const login = (tokenString) => setToken(tokenString);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
