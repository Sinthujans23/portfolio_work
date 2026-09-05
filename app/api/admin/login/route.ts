import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, createSession, isProduction } from "@/lib/admin-auth";

const notFound = () => NextResponse.json({ error: "Not available" }, { status: 404 });

export async function POST(request: Request) {
  if (isProduction()) return notFound();

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (typeof password !== "string" || !checkPassword(password)) {
    // Small delay so a wrong guess isn't instant. Not real rate limiting —
    // that would need a store — but it removes the free retry loop.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSession(), {
    httpOnly: true, // not readable from JS, so an XSS can't lift it
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

/**
 * Sign out. Clears the cookie. The token is signed rather than stored, so it
 * stays technically valid until it expires — acceptable for a local editor,
 * and changing ADMIN_PASSWORD invalidates every outstanding one immediately.
 */
export async function DELETE() {
  if (isProduction()) return notFound();

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
