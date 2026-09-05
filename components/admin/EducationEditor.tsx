"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Save, Trash2 } from "lucide-react";
import type { Education } from "@/lib/content";

type ResultDraft = { label: string; value: string };
type EducationDraft = Omit<Education, "breakdown"> & { breakdown: ResultDraft[] };

const toDraft = (item: Education): EducationDraft => ({
  degree: item.degree,
  institution: item.institution,
  location: item.location,
  period: item.period,
  status: item.status,
  note: item.note,
  breakdown: item.breakdown?.map((result) => ({ ...result })) ?? [],
});

const blankResult = (): ResultDraft => ({ label: "", value: "" });
const blankEducation = (): EducationDraft => ({
  degree: "",
  institution: "",
  location: "",
  period: "",
  status: "In progress",
  note: "",
  breakdown: [blankResult()],
});

export default function EducationEditor({ initial }: { initial: Education[] }) {
  const [drafts, setDrafts] = useState<EducationDraft[]>(initial.map(toDraft));
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  const update = (index: number, patch: Partial<EducationDraft>) => {
    setStatus("idle");
    setDrafts((list) => list.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  };

  const updateResult = (educationIndex: number, resultIndex: number, patch: Partial<ResultDraft>) => {
    setStatus("idle");
    setDrafts((list) => list.map((item, itemIndex) => itemIndex === educationIndex
      ? { ...item, breakdown: item.breakdown.map((result, index) => index === resultIndex ? { ...result, ...patch } : result) }
      : item));
  };

  const addEducation = () => {
    setStatus("idle");
    setDrafts((list) => [...list, blankEducation()]);
    setOpenIndex(drafts.length);
  };

  const removeEducation = (index: number) => {
    setStatus("idle");
    setDrafts((list) => list.filter((_, itemIndex) => itemIndex !== index));
    setOpenIndex(null);
  };

  const save = async () => {
    setStatus("saving");
    setErrors([]);
    try {
      const response = await fetch("/api/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drafts),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors ?? [data.error ?? "Save failed."]);
        setStatus("idle");
        return;
      }
      setStatus("saved");
    } catch {
      setErrors(["Could not reach the education API. Is the dev server running?"]);
      setStatus("idle");
    }
  };

  return (
    <section className="mt-16 border-t pt-10" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="eyebrow">Academic record</p>
          <h2 className="h2 mt-2">Education & GPA</h2>
          <p className="lede mt-3">Add future semesters or education entries. Changes are saved to Supabase.</p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={addEducation}>
          <Plus size={15} />
          Add education
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {drafts.map((item, educationIndex) => {
          const open = openIndex === educationIndex;
          return (
            <section key={educationIndex} className="card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3">
                <button
                  type="button"
                  className="flex flex-1 items-center gap-3 border-none bg-transparent text-left"
                  onClick={() => setOpenIndex(open ? null : educationIndex)}
                  aria-expanded={open}
                >
                  <span className="mono" style={{ color: "var(--text-3)" }}>{String(educationIndex + 1).padStart(2, "0")}</span>
                  <span className="h3">{item.degree || "Untitled education"}</span>
                </button>
                <button type="button" className="icon-btn" onClick={() => setOpenIndex(open ? null : educationIndex)} aria-label="Toggle education">
                  {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <button type="button" className="icon-btn" onClick={() => removeEducation(educationIndex)} aria-label="Delete education" style={{ color: "var(--c-rose)" }}>
                  <Trash2 size={15} />
                </button>
              </div>

              {open && (
                <div className="space-y-4 border-t px-4 py-5" style={{ borderColor: "var(--border)" }}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(["degree", "institution", "location", "period", "status", "note"] as const).map((field) => (
                      <div key={field}>
                        <label className="label" htmlFor={`education-${field}-${educationIndex}`}>{field}</label>
                        <input
                          id={`education-${field}-${educationIndex}`}
                          className="field"
                          value={item[field]}
                          onChange={(event) => update(educationIndex, { [field]: event.target.value })}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="label">GPA / results</p>
                        <p className="text-xs" style={{ color: "var(--text-3)" }}>Add a row for each semester or result.</p>
                      </div>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => update(educationIndex, { breakdown: [...item.breakdown, blankResult()] })}>
                        <Plus size={14} /> Add result
                      </button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {item.breakdown.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-center gap-2">
                          <input className="field" placeholder="Semester 4" aria-label="Result label" value={result.label} onChange={(event) => updateResult(educationIndex, resultIndex, { label: event.target.value })} />
                          <input className="field" placeholder="3.50" aria-label="Result value" value={result.value} onChange={(event) => updateResult(educationIndex, resultIndex, { value: event.target.value })} />
                          <button type="button" className="icon-btn shrink-0" onClick={() => update(educationIndex, { breakdown: item.breakdown.filter((_, index) => index !== resultIndex) })} aria-label="Delete result" style={{ color: "var(--c-rose)" }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {errors.length > 0 && (
        <ul className="card mt-6 space-y-1 p-4 text-sm" style={{ borderColor: "var(--c-rose)", color: "var(--c-rose)" }}>
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}

      <div className="mt-6 flex items-center gap-4">
        <button type="button" className="btn btn-primary" onClick={save} disabled={status === "saving"}>
          <Save size={15} />
          {status === "saving" ? "Saving..." : "Save education"}
        </button>
        {status === "saved" && <span className="text-sm" style={{ color: "var(--c-teal)" }}>Saved to Supabase.</span>}
      </div>
    </section>
  );
}
