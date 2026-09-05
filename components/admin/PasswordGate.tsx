"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

/**
 * Collects the password and hands it to /api/admin/login, which does the
 * comparison. Nothing here knows or checks the password — this component is
 * shipped to the browser, so anything it knew would be public.
 *
 * On success the server sets an httpOnly cookie and router.refresh() re-runs
 * the page on the server, which then renders the editor.
 */
export default function PasswordGate() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Sign in failed.");
        setPassword("");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setBusy(false);
    }
  };

  return (
    <main className="wrap flex min-h-screen items-center justify-center py-16">
      <div className="card w-full p-8" style={{ maxWidth: "22rem" }}>
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Lock size={18} />
        </span>

        <h1 className="h3 mt-5">Edit projects</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>
          Enter the password to continue.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--c-rose)" }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Checking…" : "Unlock"}
          </button>
        </form>

        <p className="mt-6 text-xs" style={{ color: "var(--text-3)" }}>
          Local editor. Set <code>ADMIN_PASSWORD</code> in <code>.env.local</code> to
          change the password.
        </p>
      </div>
    </main>
  );
}
