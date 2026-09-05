import { getSupabase, isSupabaseConfigured } from "./supabase";
import {
  personalInfo as staticProfile,
  skills as staticSkills,
  education as staticEducation,
  projects as staticProjects,
  type Project,
} from "./data";

/**
 * The site's content, from Supabase when it has rows and from lib/data.ts
 * otherwise.
 *
 * The fallback is not defensive padding — it is what keeps the site correct
 * in three real situations: no .env.local (a fresh clone), the schema applied
 * but not yet seeded, and Supabase unreachable during a deploy. A portfolio
 * that renders blank because a database was empty is worse than one that
 * ignores the database.
 *
 * Failures are logged rather than swallowed, so an empty table shows up in
 * the build output instead of quietly serving stale content.
 */

export type Profile = typeof staticProfile;
export type SkillGroup = (typeof staticSkills)[number];
export type Education = (typeof staticEducation)[number];

function note(what: string, detail?: unknown) {
  // Visible in `next build` output and the dev server log.
  console.warn(`[content] ${what}${detail ? ` — ${String(detail)}` : ""}; using local data`);
}

export async function getProfile(): Promise<Profile> {
  const db = getSupabase();
  if (!db) return staticProfile;

  const [{ data: row, error }, { data: facts }] = await Promise.all([
    // limit(1) rather than eq("id", 1): profile is a singleton, and matching
    // on a literal id ties this query to the id's type. It broke against a
    // table whose id was a uuid.
    db.from("profile").select("*").limit(1).maybeSingle(),
    db.from("profile_facts").select("label, value").order("sort_order"),
  ]);

  if (error) return note("profile query failed", error.message), staticProfile;
  if (!row) return note("profile table is empty"), staticProfile;

  return {
    ...staticProfile, // keeps any field the table doesn't carry
    name: row.name,
    shortName: row.short_name,
    role: row.role,
    location: row.location,
    email: row.email,
    phone: row.phone ?? staticProfile.phone,
    github: row.github_url ?? staticProfile.github,
    linkedin: row.linkedin_url ?? staticProfile.linkedin,
    university: row.university ?? staticProfile.university,
    degree: row.degree ?? staticProfile.degree,
    cgpa: row.cgpa ?? staticProfile.cgpa,
    tagline: row.tagline,
    bio: row.bio?.length ? row.bio : staticProfile.bio,
    interests: row.interests?.length ? row.interests : staticProfile.interests,
    facts: facts?.length ? facts : staticProfile.facts,
  };
}

export async function getProjects(): Promise<Project[]> {
  const db = getSupabase();
  if (!db) return staticProjects;

  const { data, error } = await db
    .from("projects")
    .select("id, title, context, summary, detail, stack, is_team, is_featured, repo_url, live_url")
    .order("sort_order");

  if (error) return note("projects query failed", error.message), staticProjects;
  if (!data?.length) return note("projects table is empty"), staticProjects;

  return data.map((r) => ({
    id: r.id,
    title: r.title,
    context: r.context,
    summary: r.summary,
    detail: r.detail ?? [],
    stack: r.stack ?? [],
    team: r.is_team,
    featured: r.is_featured,
    // Omitted rather than null, so the Links component keeps hiding buttons.
    ...(r.repo_url ? { repo: r.repo_url } : {}),
    ...(r.live_url ? { live: r.live_url } : {}),
  }));
}

export async function getSkills(): Promise<SkillGroup[]> {
  const db = getSupabase();
  if (!db) return staticSkills;

  // One query, not one per group: the join returns items nested per group.
  const { data, error } = await db
    .from("skill_groups")
    .select("name, note, skills(name, sort_order)")
    .order("sort_order")
    .order("sort_order", { referencedTable: "skills" });

  if (error) return note("skills query failed", error.message), staticSkills;
  if (!data?.length) return note("skill_groups table is empty"), staticSkills;

  return data.map((g) => ({
    group: g.name,
    items: (g.skills ?? []).map((s: { name: string }) => s.name),
    ...(g.note ? { note: g.note } : {}),
  }));
}

export async function getEducation(): Promise<Education[]> {
  const db = getSupabase();
  if (!db) return staticEducation;

  const { data, error } = await db
    .from("education")
    .select("degree, institution, location, period, status, note, education_results(label, value, sort_order)")
    .order("sort_order")
    .order("sort_order", { referencedTable: "education_results" });

  if (error) return note("education query failed", error.message), staticEducation;
  if (!data?.length) return note("education table is empty"), staticEducation;

  return data.map((e) => ({
    degree: e.degree,
    institution: e.institution,
    location: e.location ?? "",
    period: e.period,
    status: e.status,
    note: e.note ?? "",
    ...(e.education_results?.length
      ? {
          breakdown: e.education_results.map((r: { label: string; value: string }) => ({
            label: r.label,
            value: r.value,
          })),
        }
      : {}),
  })) as Education[];
}

export { isSupabaseConfigured };
