import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProjectsEditor from "@/components/admin/ProjectsEditor";
import EducationEditor from "@/components/admin/EducationEditor";
import PasswordGate from "@/components/admin/PasswordGate";
import { ADMIN_COOKIE, isValidSession } from "@/lib/admin-auth";
import { getEducation, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Edit projects",
  robots: { index: false, follow: false },
};

// Rendered per request so both guards below are evaluated at runtime rather
// than baked in at build time.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Belt and braces with the same check in the route handlers: in production
  // this page does not exist at all.
  if (process.env.NODE_ENV === "production") notFound();

  // Next 16: cookies() is async — synchronous access was removed.
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;

  // The editor is never sent to the browser unless the session is valid, so
  // the gate can't be skipped from devtools.
  if (!isValidSession(token)) return <PasswordGate />;

  const [projects, education] = await Promise.all([getProjects(), getEducation()]);
  return (
    <>
      <ProjectsEditor initial={projects} />
      <div className="wrap pb-16" style={{ maxWidth: "52rem" }}>
        <EducationEditor initial={education} />
      </div>
    </>
  );
}
