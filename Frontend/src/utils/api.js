// Frontend/src/utils/api.js

/**
 * Rules:
 * - In PROD (Vercel): always use "/api" (so requests go through Vercel rewrite)
 * - In DEV (local): use VITE_API_BASE_URL if set, else default to http://localhost:5000
 * - Call apiFetch("/auth/login")  (NOT "/api/auth/login")
 */

function normalizeBase(base) {
  const trimmed = (base || "").trim();
  // remove trailing slashes
  return trimmed.replace(/\/+$/, "");
}

function normalizePath(path) {
  const p = (path || "").trim();

  // Ensure leading slash
  let out = p.startsWith("/") ? p : `/${p}`;

  // Prevent "/api/api/..." mistakes:
  // If someone passes "/api/xyz", strip the leading "/api"
  if (out === "/api") return "/";
  if (out.startsWith("/api/")) out = out.slice(4);

  return out;
}

export function getApiBase() {
  // In production (Vercel), always hit the Vercel proxy route
  if (import.meta.env.PROD) return "/api";

  // In development, allow override
  const raw = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return normalizeBase(raw);
}

/**
 * Usage:
 *   apiFetch("/auth/login", { method:"POST", body: JSON.stringify(...) })
 *   apiFetch("/health")
 */
export async function apiFetch(path, options = {}) {
  const base = getApiBase();
  const cleanPath = normalizePath(path);

  const url = `${base}${cleanPath}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // Read as text first so HTML error pages don't crash JSON parsing
  const text = await res.text();

  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    // If backend returns HTML (like Express error page), show readable snippet
    payload = { error: text || `Request failed (${res.status})` };
  }

  if (!res.ok) {
    const msg =
      payload?.error ||
      payload?.message ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return payload;
}
