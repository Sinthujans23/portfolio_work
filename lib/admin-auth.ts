import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Gate for the local project editor.
 *
 * Server-side on purpose. A password compared in the browser is not a gate —
 * anyone can read it in the bundle or skip the check in devtools. The
 * password never reaches the client; only a signed token does.
 *
 * The token is stateless (an expiry plus an HMAC of it) rather than a random
 * id held in a Set. Next bundles route handlers and server components
 * separately, so a module-level Set is not one shared store: logging in
 * through /api/admin/login populated a different instance than the one
 * /admin read, and the page kept showing the gate while the API accepted the
 * same cookie. Signing sidesteps that, and survives a dev-server restart.
 *
 * Scope: this protects the editor on your own machine. /admin and both APIs
 * 404 under NODE_ENV=production, so nothing here guards a public URL. If the
 * editor were ever exposed publicly this would NOT be sufficient — that needs
 * a real user store, credentials hashed at rest, and rate limiting.
 */

// Overridable so the password isn't a constant in a public repo. Set
// ADMIN_PASSWORD in .env.local to change it.
const FALLBACK_PASSWORD = "sinthu";

const SESSION_MS = 8 * 60 * 60 * 1000;

export const ADMIN_COOKIE = "admin_session";

export const isProduction = () => process.env.NODE_ENV === "production";

const password = () => process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD;

/** Signing key derived from the password, so changing the password
 *  invalidates every outstanding session for free. */
const key = () => createHash("sha256").update(password(), "utf8").digest();

const sign = (payload: string) =>
  createHmac("sha256", key()).update(payload).digest("hex");

/** Compared over SHA-256 digests so the check is constant-time and both
 *  sides are the same length, which timingSafeEqual requires. */
export function checkPassword(input: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(password(), "utf8").digest();
  return timingSafeEqual(a, b);
}

export function createSession(): string {
  const expires = String(Date.now() + SESSION_MS);
  return `${expires}.${sign(expires)}`;
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;

  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;

  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expected = Buffer.from(sign(expires), "hex");
  const given = Buffer.from(signature, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
