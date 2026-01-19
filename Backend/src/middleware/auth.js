import jwt from "jsonwebtoken";

/**
 * Require authentication (protected APIs)
 * Alias: requireAuth
 */
export function authRequired(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Optional auth (anonymous allowed)
 * Alias: authOptional
 */
export function authOptional(req, _res, next) {
  const header = req.headers.authorization;

  if (!header) {
    req.user = null;
    return next();
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }

  return next();
}

/**
 * Role guard
 * Usage: requireRole("staff")
 */
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

/** Backwards-compatible aliases (so your app.js keeps working) */
export const requireAuth = authRequired;
