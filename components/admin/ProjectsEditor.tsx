"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, LogOut, Plus, Trash2 } from "lucide-react";
import type { Project } from "@/lib/data";

/**
 * Dev-only editor for content/projects.json, mounted at /admin.
 *
 * Saving PUTs the whole list to /api/projects, which validates it and
 * rewrites the file. The dev server then hot-reloads the site with the new
 * content. Commit the JSON to publish it — the deployed site is static and
 * cannot be edited from the browser.
 */

type Draft = Omit<Project, "detail" | "stack"> & {
  // Textareas are easier to edit as text; split on save.
  detail: string;
  stack: string;
};

const toDraft = (p: Project): Draft => ({
  ...p,
  detail: p.detail.join("\n"),
  stack: p.stack.join(", "),
});

const fromDraft = (d: Draft): Project => ({
  ...d,
  detail: d.detail.split("\n").map((s) => s.trim()).filter(Boolean),
  stack: d.stack.split(",").map((s) => s.trim()).filter(Boolean),
});

const blank = (): Draft => ({
  id: "",
  title: "",
  context: "Personal project · Full stack",
  team: false,
  featured: false,
  summary: "",
  detail: "",
  stack: "",
  repo: "",
  live: "",
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

export default function ProjectsEditor({ initial }: { initial: Project[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>(initial.map(toDraft));
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  const update = (i: number, patch: Partial<Draft>) => {
    setStatus("idle");
    setDrafts((list) => list.map((d, n) => (n === i ? { ...d, ...patch } : d)));
  };

  // Exactly one project is featured — it renders as the large card, so
  // setting one has to clear the others.
  const setFeatured = (i: number) => {
    setStatus("idle");
    setDrafts((list) => list.map((d, n) => ({ ...d, featured: n === i })));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= drafts.length) return;
    setStatus("idle");
    setDrafts((list) => {
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setOpenIndex(j);
  };

  const add = () => {
    setStatus("idle");
    setDrafts((list) => [...list, blank()]);
    setOpenIndex(drafts.length);
  };

  const remove = (i: number) => {
    setStatus("idle");
    setDrafts((list) => list.filter((_, n) => n !== i));
    setOpenIndex(null);
  };

  const save = async () => {
    setStatus("saving");
    setErrors([]);
    const payload = drafts.map(fromDraft);
    try {
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(
          res.status === 401
            ? ["Session expired — reload the page and sign in again."]
            : data.errors ?? ["Save failed."]
        );
        setStatus("idle");
        return;
      }
      setStatus("saved");
    } catch {
      setErrors(["Could not reach /api/projects — is the dev server running?"]);
      setStatus("idle");
    }
  };

  const signOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  };

  return (
    <main className="wrap py-16" style={{ maxWidth: "52rem" }}>
      <div className="flex items-start justify-between gap-6">
        <p className="eyebrow">Local only</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}>
          <LogOut size={14} />
          Sign out
        </button>
      </div>
      <h1 className="h2 mt-3">Projects</h1>
      <p className="lede mt-3">
        Edits are written to <code>content/projects.json</code>. Commit that file to
        publish them — the deployed site is static and can&apos;t be edited from a
        browser.
      </p>

      <div className="mt-10 space-y-3">
        {drafts.map((d, i) => {
          const open = openIndex === i;
          return (
            <section key={i} className="card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex flex-1 items-center gap-3 border-none bg-transparent text-left"
                  style={{ cursor: "pointer" }}
                  aria-expanded={open}
                >
                  <span className="mono" style={{ color: "var(--text-3)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h3">{d.title || "Untitled project"}</span>
                  {d.featured && (
                    <span className="tag" style={{ color: "var(--accent)" }}>
                      featured
                    </span>
                  )}
                </button>

                <button type="button" className="icon-btn" onClick={() => move(i, -1)} aria-label="Move up">
                  <ChevronUp size={15} />
                </button>
                <button type="button" className="icon-btn" onClick={() => move(i, 1)} aria-label="Move down">
                  <ChevronDown size={15} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => remove(i)}
                  aria-label={`Delete ${d.title || "project"}`}
                  style={{ color: "var(--c-rose)" }}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {open && (
                <div
                  className="space-y-4 border-t px-4 py-5"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor={`title-${i}`}>Title</label>
                      <input
                        id={`title-${i}`}
                        className="field"
                        value={d.title}
                        onChange={(e) =>
                          update(i, {
                            title: e.target.value,
                            // Only auto-fill the id while it is untouched.
                            ...(d.id === "" || d.id === slugify(d.title)
                              ? { id: slugify(e.target.value) }
                              : {}),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor={`id-${i}`}>
                        id <span style={{ color: "var(--text-3)" }}>(lowercase, hyphens)</span>
                      </label>
                      <input
                        id={`id-${i}`}
                        className="field mono"
                        value={d.id}
                        onChange={(e) => update(i, { id: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor={`context-${i}`}>
                      Context <span style={{ color: "var(--text-3)" }}>shown beside the title</span>
                    </label>
                    <input
                      id={`context-${i}`}
                      className="field"
                      value={d.context}
                      onChange={(e) => update(i, { context: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor={`summary-${i}`}>Summary</label>
                    <textarea
                      id={`summary-${i}`}
                      className="field"
                      rows={3}
                      value={d.summary}
                      onChange={(e) => update(i, { summary: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor={`detail-${i}`}>
                      Bullets <span style={{ color: "var(--text-3)" }}>one per line</span>
                    </label>
                    <textarea
                      id={`detail-${i}`}
                      className="field"
                      rows={6}
                      value={d.detail}
                      onChange={(e) => update(i, { detail: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor={`stack-${i}`}>
                      Stack <span style={{ color: "var(--text-3)" }}>comma separated</span>
                    </label>
                    <input
                      id={`stack-${i}`}
                      className="field"
                      value={d.stack}
                      onChange={(e) => update(i, { stack: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor={`repo-${i}`}>Repo URL (optional)</label>
                      <input
                        id={`repo-${i}`}
                        className="field"
                        value={d.repo ?? ""}
                        onChange={(e) => update(i, { repo: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor={`live-${i}`}>Live URL (optional)</label>
                      <input
                        id={`live-${i}`}
                        className="field"
                        value={d.live ?? ""}
                        onChange={(e) => update(i, { live: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 pt-1">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(d.team)}
                        onChange={(e) => update(i, { team: e.target.checked })}
                      />
                      Team project — shows &ldquo;My contribution&rdquo;
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="featured"
                        checked={Boolean(d.featured)}
                        onChange={() => setFeatured(i)}
                      />
                      Featured — the large card
                    </label>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <button type="button" className="btn btn-ghost mt-4" onClick={add}>
        <Plus size={16} />
        Add project
      </button>

      {errors.length > 0 && (
        <ul
          className="card mt-8 space-y-1 p-4 text-sm"
          style={{ borderColor: "var(--c-rose)", color: "var(--c-rose)" }}
        >
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={save}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving…" : "Save to projects.json"}
        </button>
        {status === "saved" && (
          <span className="text-sm" style={{ color: "var(--c-teal)" }}>
            Saved. The site has reloaded with the new content.
          </span>
        )}
      </div>
    </main>
  );
}
