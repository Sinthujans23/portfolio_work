import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client, or null when the project isn't configured.
 *
 * Returning null rather than throwing is deliberate: the site has to build
 * and render without a database — that is how it worked before, and how a
 * fresh clone with no .env.local still works.
 *
 * The anon key is meant to be public; it ships to the browser by design.
 * Row Level Security is what protects the data, which is why db/schema.sql
 * enables it on every table and grants only SELECT. A service_role key must
 * never appear in a NEXT_PUBLIC_ variable.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: false }, // read-only content; no user sessions
    });
  }
  return client;
}

export const isSupabaseConfigured = Boolean(url && anonKey);
