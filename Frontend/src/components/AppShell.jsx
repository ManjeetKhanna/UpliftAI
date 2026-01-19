import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function AppShell({ title, subtitle, navItems = [], children }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const activePath = loc.pathname;

  const items = useMemo(() => {
    return navItems.map((it) => ({
      ...it,
      active: activePath === it.to,
    }));
  }, [navItems, activePath]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              ☰
            </button>

            <div>
              <div className="text-base font-black tracking-tight">
                UpliftAI
              </div>
              <div className="text-xs text-slate-400">
                Student Success Micro-Advisor
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-sm font-semibold text-slate-100">
                {user?.email || "Guest"}
              </div>
              <div className="text-xs text-slate-400">
                {user?.role ? `Role: ${user.role}` : "Not logged in"}
              </div>
            </div>

            {user?.role ? (
              <button
                onClick={logout}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside
          className={classNames(
            "rounded-2xl border border-white/10 bg-white/5 p-3 md:block",
            open ? "block" : "hidden"
          )}
        >
          <div className="mb-3 px-2">
            <div className="text-sm font-extrabold text-slate-100">{title}</div>
            {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
          </div>

          <nav className="space-y-1">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={classNames(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold",
                  it.active
                    ? "bg-blue-500/15 text-blue-200 ring-1 ring-blue-500/30"
                    : "text-slate-200 hover:bg-white/10"
                )}
              >
                <span>{it.label}</span>
                {it.badge ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">
                    {it.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-300">
            <div className="font-bold">Privacy-first</div>
            <div className="mt-1 text-slate-400">
              No personal data in staff analytics. Logs are anonymized.
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="space-y-4">
          {children}
        </main>
      </div>
    </div>
  );
}
