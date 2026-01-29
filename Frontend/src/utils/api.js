export function getApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL || "";
  return raw.replace(/\/$/, ""); // trim trailing slash
}

/**
 * apiFetch("/api/auth/login", {...})
 * - Always uses VITE_API_BASE_URL
 * - Safe JSON parsing (shows readable errors)
 */
export async function apiFetch(path, options = {}) {
  const base = getApiBase();

  // ensure leading slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${cleanPath}`;

  const res = await fetch(url, options);

  // Try JSON, else fall back to text (so HTML errors don't crash)
  const contentType = res.headers.get("content-type") || "";
  let payload;
  if (contentType.includes("application/json")) {
    payload = await res.json().catch(() => null);
  } else {
    const text = await res.text().catch(() => "");
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
