import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isProduction, isValidSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type Result = { label: string; value: string };
type EducationInput = {
  degree?: unknown;
  institution?: unknown;
  location?: unknown;
  period?: unknown;
  status?: unknown;
  note?: unknown;
  breakdown?: unknown;
};

const response = (body: object, status = 200) => NextResponse.json(body, { status });

async function authorised() {
  if (isProduction()) return false;
  return isValidSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

function validate(input: unknown): { errors: string[]; rows: Array<{
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  note: string;
  breakdown: Result[];
}> } {
  if (!Array.isArray(input)) return { errors: ["Payload must be an array."], rows: [] };
  const errors: string[] = [];
  const rows = input.map((raw, index) => {
    const item = raw as EducationInput;
    const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
    const row = {
      degree: text(item.degree),
      institution: text(item.institution),
      location: text(item.location),
      period: text(item.period),
      status: text(item.status),
      note: text(item.note),
      breakdown: Array.isArray(item.breakdown)
        ? item.breakdown.map((result) => ({
            label: text((result as Result).label),
            value: text((result as Result).value),
          })).filter((result) => result.label || result.value)
        : [],
    };
    for (const field of ["degree", "institution", "period", "status"] as const) {
      if (!row[field]) errors.push(`Education ${index + 1}: "${field}" is required.`);
    }
    row.breakdown.forEach((result, resultIndex) => {
      if (!result.label || !result.value) {
        errors.push(`Education ${index + 1}, result ${resultIndex + 1}: label and value are required.`);
      }
    });
    return row;
  });
  return { errors, rows };
}

export async function PUT(request: Request) {
  if (!(await authorised())) return response({ error: "Not available" }, 404);
  const db = getSupabaseAdmin();
  if (!db) return response({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured." }, 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response({ errors: ["Body was not valid JSON."] }, 400);
  }
  const { errors, rows } = validate(body);
  if (errors.length) return response({ errors }, 400);

  const { error: deleteResultsError } = await db.from("education_results").delete().not("id", "is", null);
  if (deleteResultsError) return response({ errors: [deleteResultsError.message] }, 502);
  const { error: deleteEducationError } = await db.from("education").delete().not("id", "is", null);
  if (deleteEducationError) return response({ errors: [deleteEducationError.message] }, 502);

  for (const [sortOrder, row] of rows.entries()) {
    const { data: education, error } = await db
      .from("education")
      .insert({
        degree: row.degree,
        institution: row.institution,
        location: row.location || null,
        period: row.period,
        status: row.status,
        note: row.note || null,
        sort_order: sortOrder,
      })
      .select("id")
      .single();
    if (error || !education) return response({ errors: [error?.message ?? "Education save failed."] }, 502);

    if (row.breakdown.length) {
      const { error: resultError } = await db.from("education_results").insert(
        row.breakdown.map((result, resultOrder) => ({
          education_id: education.id,
          label: result.label,
          value: result.value,
          sort_order: resultOrder,
        }))
      );
      if (resultError) return response({ errors: [resultError.message] }, 502);
    }
  }

  return response({ ok: true, count: rows.length });
}