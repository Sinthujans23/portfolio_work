import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/admin-auth";

/**
 * Reads and writes content/projects.json for the editor at /admin.
 *
 * Development only. The deployed site is statically prerendered and its
 * filesystem is read-only, so writing there could not work even if it were
 * allowed — and an unauthenticated endpoint that rewrites site content is
 * exactly the thing you do not want on a public URL. The flow is: edit
 * locally, then commit the JSON and deploy.
 *
 * The session check is repeated here rather than left to the page: the page
 * gate only decides what gets rendered, and an API that trusts it would still
 * accept a direct request from anything that can reach the port.
 */

const FILE = path.join(process.cwd(), "content", "projects.json");

const isDev = () => process.env.NODE_ENV !== "production";

const notFound = () =>
  NextResponse.json({ error: "Not available" }, { status: 404 });

const unauthorised = () =>
  NextResponse.json({ errors: ["Not signed in."] }, { status: 401 });

async function signedIn() {
  return isValidSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

type Project = {
  id: string;
  title: string;
  context: string;
  summary: string;
  detail: string[];
  stack: string[];
  team?: boolean;
  featured?: boolean;
  repo?: string;
  live?: string;
};

/** Returns a list of problems; empty means the payload is safe to write. */
function validate(input: unknown): string[] {
  if (!Array.isArray(input)) return ["Payload must be an array of projects."];

  const errors: string[] = [];
  const ids = new Set<string>();

  input.forEach((raw, i) => {
    const p = raw as Partial<Project>;
    const where = `Project ${i + 1}`;

    for (const field of ["id", "title", "context", "summary"] as const) {
      if (typeof p[field] !== "string" || !p[field]?.trim()) {
        errors.push(`${where}: "${field}" is required.`);
      }
    }
    if (p.id) {
      if (!/^[a-z0-9-]+$/.test(p.id)) {
        errors.push(`${where}: id "${p.id}" must be lowercase letters, digits and hyphens.`);
      }
      if (ids.has(p.id)) errors.push(`${where}: duplicate id "${p.id}".`);
      ids.add(p.id);
    }
    for (const field of ["detail", "stack"] as const) {
      if (!Array.isArray(p[field]) || p[field]?.some((x) => typeof x !== "string")) {
        errors.push(`${where}: "${field}" must be a list of strings.`);
      }
    }
    if (!p.stack?.length) errors.push(`${where}: needs at least one stack entry.`);
  });

  // The Work section renders exactly one featured project as the hero card.
  const featured = input.filter((p) => (p as Project).featured).length;
  if (featured > 1) errors.push(`Only one project can be featured (${featured} are).`);
  if (input.length && featured === 0) {
    errors.push("One project must be featured — it becomes the large card.");
  }

  return errors;
}

export async function GET() {
  if (!isDev()) return notFound();
  if (!(await signedIn())) return unauthorised();
  const raw = await readFile(FILE, "utf8");
  return NextResponse.json(JSON.parse(raw));
}

export async function PUT(request: Request) {
  if (!isDev()) return notFound();
  if (!(await signedIn())) return unauthorised();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ errors: ["Body was not valid JSON."] }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length) return NextResponse.json({ errors }, { status: 400 });

  const projects = (body as Project[]).map((p) => ({
    id: p.id.trim(),
    title: p.title.trim(),
    context: p.context.trim(),
    team: Boolean(p.team),
    featured: Boolean(p.featured),
    summary: p.summary.trim(),
    detail: p.detail.map((d) => d.trim()).filter(Boolean),
    stack: p.stack.map((t) => t.trim()).filter(Boolean),
    // Omitted rather than written as "" so the Links component, which tests
    // for presence, keeps hiding the buttons.
    ...(p.repo?.trim() ? { repo: p.repo.trim() } : {}),
    ...(p.live?.trim() ? { live: p.live.trim() } : {}),
  }));

  await writeFile(FILE, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
  return NextResponse.json({ ok: true, count: projects.length });
}
