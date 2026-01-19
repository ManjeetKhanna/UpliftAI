import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { useAuth } from "../state/auth.jsx";
import { Link } from "react-router-dom";

const COLORS = ["#FF8042", "#00C49F", "#0088FE", "#8884d8", "#82ca9d"];

export default function Staff() {
  const { token, user } = useAuth();
  const roleNormalized = String(user?.role || "").toLowerCase();

  const [summary, setSummary] = useState(null);
  const [sentimentTrend, setSentimentTrend] = useState([]);
  const [plansTrend, setPlansTrend] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStaffData = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [summaryRes, sentimentRes, plansRes, peakRes, recentRes] =
        await Promise.all([
          fetch("/api/staff/summary?days=7", { headers }),
          fetch("/api/staff/sentiment-trend?days=14", { headers }),
          fetch("/api/staff/plans-trend?days=14", { headers }),
          fetch("/api/staff/peak-hours?days=7", { headers }),
          fetch("/api/staff/recent?limit=20", { headers }),
        ]);

      const summaryData = await summaryRes.json();
      const sentimentData = await sentimentRes.json();
      const plansData = await plansRes.json();
      const peakData = await peakRes.json();
      const recentData = await recentRes.json();

      if (!summaryRes.ok) throw new Error(summaryData?.error || "Failed to load summary");
      if (!sentimentRes.ok) throw new Error(sentimentData?.error || "Failed to load sentiment trend");
      if (!plansRes.ok) throw new Error(plansData?.error || "Failed to load plans trend");
      if (!peakRes.ok) throw new Error(peakData?.error || "Failed to load peak hours");
      if (!recentRes.ok) throw new Error(recentData?.error || "Failed to load recent logs");

      setSummary(summaryData);
      setSentimentTrend(sentimentData.data || []);
      setPlansTrend(plansData.data || []);
      setPeakHours(peakData.data || []);
      setRecentLogs(recentData.logs || []);
    } catch (e) {
      setError(e?.message || "Failed to load staff analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && roleNormalized === "staff") fetchStaffData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, roleNormalized]);

  const categoryData = useMemo(() => {
    if (!summary?.categoryCounts) return [];
    return Object.entries(summary.categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [summary]);

  // Gate
  if (!token || roleNormalized !== "staff") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <TopBar right={<LinkBtn to="/student">Student</LinkBtn>} />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Card>
            <div className="text-lg font-black">Staff Dashboard</div>
            <p className="mt-2 text-slate-300">
              You must be logged in as <b>staff</b> to view analytics.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopBar
        right={
          <div className="flex items-center gap-2">
            <LinkBtn to="/student">Student</LinkBtn>
            <button
              onClick={fetchStaffData}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-blue-500/20 px-3 py-2 text-sm font-extrabold hover:bg-blue-500/30 disabled:opacity-60"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
        }
      />

      <main className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-extrabold">Staff Dashboard</div>
              <div className="text-xs text-slate-400">
                Anonymous sentiment, categories, and usage trends
              </div>
            </div>
            <div className="text-xs text-slate-400">{user?.email || ""}</div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
            {error}
          </div>
        )}

        {/* Insights */}
        <Card className="mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-extrabold">Insights</div>
            <div className="text-xs text-slate-400">
              Last {summary?.days || 7} days • Total messages:{" "}
              <b>{summary?.totalMessages ?? 0}</b>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            <MiniPanel title="Category Counts">
              <ul className="list-disc pl-5 text-sm text-slate-300">
                {summary?.categoryCounts
                  ? Object.entries(summary.categoryCounts).map(([k, v]) => (
                      <li key={k}>
                        {k}: <b>{v}</b>
                      </li>
                    ))
                  : <li>No data</li>}
              </ul>
            </MiniPanel>

            <MiniPanel title="Sentiment Counts">
              <ul className="list-disc pl-5 text-sm text-slate-300">
                {summary?.sentimentCounts
                  ? Object.entries(summary.sentimentCounts).map(([k, v]) => (
                      <li key={k}>
                        {k}: <b>{v}</b>
                      </li>
                    ))
                  : <li>No data</li>}
              </ul>
            </MiniPanel>
          </div>
        </Card>

        {/* Charts (FIXED HEIGHTS) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Category Distribution">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={110} label>
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Sentiment Over Time">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentTrend} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="positive" stroke="#00C49F" />
                  <Line type="monotone" dataKey="neutral" stroke="#8884d8" />
                  <Line type="monotone" dataKey="negative" stroke="#FF8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Study Plans Generated">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={plansTrend} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#0088FE" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Peak Usage Hours (UTC)">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHours} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Recent */}
        <Card className="mt-4">
          <div className="text-sm font-extrabold">Recent Student Messages (Anonymized)</div>

          {recentLogs.length === 0 ? (
            <p className="mt-2 text-slate-300">No recent messages.</p>
          ) : (
            <div className="mt-3 grid gap-3">
              {recentLogs.map((log) => (
                <div key={log._id} className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-extrabold">
                      {log.category || "General"}{" "}
                      <span className="font-semibold text-slate-400">
                        ({log.sentiment || "neutral"})
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-200">{log.content}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

/* ---------- Small UI building blocks ---------- */

function TopBar({ right }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15 text-blue-200 font-black">
            U
          </div>
          <div className="leading-tight">
            <div className="text-sm font-black">UpliftAI</div>
            <div className="text-xs text-slate-400">Staff</div>
          </div>
        </div>
        {right}
      </div>
    </header>
  );
}

function LinkBtn({ to, children }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

function Card({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${className}`}>
      {children}
    </section>
  );
}

function MiniPanel({ title, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <div className="text-sm font-extrabold">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-extrabold">{title}</div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
