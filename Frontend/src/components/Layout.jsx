import React, { useMemo, useState } from "react";
import { useAuth } from "../state/auth.jsx";
import { useLocation, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [open, setOpen] = useState(false);

  const role = String(user?.role || "").toLowerCase(); // "student" | "staff"
  const portalLabel = role === "staff" ? "Staff Portal" : "Student Portal";

  const items = useMemo(() => {
    const base = [];
    if (role === "student") base.push({ label: "Student", path: "/student" });
    if (role === "staff") base.push({ label: "Staff", path: "/staff" });
    // Add more later:
    // base.push({ label: "Settings", path: "/settings" });
    return base;
  }, [role]);

  const go = (path) => {
    setOpen(false);
    nav(path);
  };

  const isActive = (path) => loc.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Left: brand + menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
              aria-label="Menu"
              type="button"
            >
              ☰
            </button>

            <div className="leading-tight">
              <div className="text-base font-extrabold tracking-wide">UpliftAI</div>
              <div className="text-xs text-slate-300">{portalLabel}</div>
            </div>
          </div>

          {/* Right: logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                nav("/login");
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10 transition"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Drawer / Menu */}
        {open && (
          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-3">
              {items.length === 0 ? (
                <span className="text-sm text-slate-300">
                  Login to see navigation.
                </span>
              ) : (
                items.map((it) => (
                  <button
                    key={it.path}
                    onClick={() => go(it.path)}
                    className={[
                      "rounded-xl px-3 py-2 text-sm font-semibold transition border",
                      isActive(it.path)
                        ? "border-white/20 bg-white/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    ].join(" ")}
                    type="button"
                  >
                    {it.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </header>

      {/* Page container */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {children}
        </div>
      </main>
    </div>
  );
}
