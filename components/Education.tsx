import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import type { Education } from "@/lib/content";

export default function Education({ education }: { education: Education[] }) {
  return (
    <section
      id="education"
      className="section"
      style={{ "--section-accent": "var(--c-amber)" } as React.CSSProperties}
    >
      <div className="wrap">
        <SectionHeading index="04" eyebrow="Education" title="Academic background" />

        <ol className="border-t" style={{ borderColor: "var(--border)" }}>
          {education.map((item, i) => (
            <Reveal as="li" key={item.degree} delay={i * 0.05}>
              <div
                className="row grid gap-x-10 gap-y-4 border-b py-10 md:grid-cols-[10rem_minmax(0,1fr)]"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <p className="mono row-meta" style={{ color: "var(--text-3)" }}>
                    {item.period}
                  </p>
                  <p
                    className="mt-2 inline-flex items-center gap-1.5 text-xs"
                    style={{ color: "var(--text-3)" }}
                  >
                    <span
                      className="row-marker h-1.5 w-1.5 rounded-full"
                      style={{
                        background:
                          item.status === "In progress"
                            ? "var(--section-accent)"
                            : "var(--border-strong)",
                      }}
                      aria-hidden
                    />
                    {item.status}
                  </p>
                </div>

                <div>
                  <h3 className="h3">{item.degree}</h3>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-3)" }}>
                    {item.institution} · {item.location}
                  </p>
                  <p className="mt-4 text-sm" style={{ color: "var(--text-2)", maxWidth: "62ch" }}>
                    {item.note}
                  </p>

                  {item.breakdown && (
                    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                      {item.breakdown.map(({ label, value }) => (
                        <div key={label}>
                          <dt className="eyebrow">{label}</dt>
                          <dd
                            className="mono mt-1 text-base"
                            style={{ color: "var(--section-accent)" }}
                          >
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
