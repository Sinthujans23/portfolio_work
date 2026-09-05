import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import type { Profile } from "@/lib/content";

export default function About({ personalInfo }: { personalInfo: Profile }) {
  return (
    <section
      id="about"
      className="section"
      style={
        { background: "var(--bg-subtle)", "--section-accent": "var(--c-blue)" } as React.CSSProperties
      }
    >
      <div className="wrap">
        <SectionHeading index="01" eyebrow="About" title="How I work" />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <div className="space-y-5" style={{ maxWidth: "62ch" }}>
              {personalInfo.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} style={{ color: "var(--text-2)" }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="eyebrow">Interests</h3>
            <ul className="mt-4">
              {personalInfo.interests.map((interest) => (
                <li
                  key={interest}
                  className="row flex items-start gap-3 border-b py-3 text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--text-2)" }}
                >
                  <span
                    className="row-marker mt-2 h-1 w-1 shrink-0 rounded-full"
                    style={{ background: "var(--border-strong)" }}
                    aria-hidden
                  />
                  {interest}
                </li>
              ))}
            </ul>

            <h3 className="eyebrow mt-10">Currently</h3>
            <p className="mt-4 text-sm" style={{ color: "var(--text-2)" }}>
              Third year of the {personalInfo.degree} at the {personalInfo.university}, and
              available for a software engineering internship.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
