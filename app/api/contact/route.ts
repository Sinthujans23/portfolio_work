import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid name and email." }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: "Enter a message under 5000 characters." }, { status: 400 });
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "Contact service is not configured." }, { status: 503 });
  }

  const { error } = await db.from("contact_messages").insert({ name, email, message });
  if (error) {
    console.error("[contact] insert failed", error.message);
    return NextResponse.json({ error: "Message could not be saved." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}