"use client";

import { useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { projects, type Project } from "@/lib/data";

function Links({ project }: { project: Project }) {
  if (!project.repo && !project.live) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-4">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-1 text-sm"
        >
          Live site <ArrowUpRight size={14} />
        </a>
      )}
      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-1 text-sm"
        >
          Source <ArrowUpRight size={14} />
        </a>
      )}
    </div>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
          className="tag"
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

/** On a team project, saying so — and labelling which parts were yours —
 *  is what makes the rest of the list believable. */
function DetailList({
  project,
  columns = false,
  markerColor,
}: {
  project: Project;
  columns?: boolean;
  markerColor: string;
}) {
  return (
    <div className="mt-8">
      <p className="eyebrow">{project.team ? "My contribution" : "Highlights"}</p>
      <ul className={`mt-4 gap-x-10 gap-y-4 ${columns ? "grid md:grid-cols-2" : "grid"}`}>
        {project.detail.map((point, i) => (
          <motion.li
            key={point.slice(0, 24)}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="row flex gap-3 text-sm"
          >
            <span
              className="row-marker mt-2 h-1 w-1 shrink-0 rounded-full"
              style={{ background: markerColor }}
              aria-hidden
            />
            <span style={{ color: "var(--text-2)" }}>{point}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default function Work() {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  // Feed the pointer position to the .spotlight gradient. Writing CSS
  // variables keeps this off React's render path — no state, no re-render
  // on every mouse move.
  const trackPointer = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <section
      id="work"
      className="section"
      style={{ "--section-accent": "var(--c-violet)" } as React.CSSProperties}
    >
      <div className="wrap">
        <SectionHeading
          index="02"
          eyebrow="Work"
          title="Projects"
          description="What I've built, and which parts of it were mine."
        />

        {featured && (
          <Reveal>
            <article
              className="card card-hover spotlight overflow-hidden p-7 md:p-10"
              onPointerMove={trackPointer}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="accent-rule mb-7 w-24 origin-left"
                aria-hidden
              />

              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                  {featured.title}
                </h3>
                <p className="mono" style={{ color: "var(--section-accent)" }}>
                  {featured.context}
                </p>
              </div>

              <p className="mt-5" style={{ color: "var(--text-2)", maxWidth: "68ch" }}>
                {featured.summary}
              </p>

              <DetailList project={featured} columns markerColor="var(--section-accent)" />

              <Stack items={featured.stack} />
              <Links project={featured} />
            </article>
          </Reveal>
        )}

        <ul className="mt-16">
          {rest.map((project, i) => (
            <Reveal as="li" key={project.id} delay={i * 0.04}>
              <article
                className="row grid gap-x-10 gap-y-4 border-t py-10 md:grid-cols-[10rem_minmax(0,1fr)]"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="mono row-meta" style={{ color: "var(--text-3)" }}>
                  {project.context}
                </p>

                <div>
                  <h3 className="h3">{project.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-2)", maxWidth: "66ch" }}>
                    {project.summary}
                  </p>

                  <DetailList project={project} markerColor="var(--border-strong)" />

                  <Stack items={project.stack} />
                  <Links project={project} />
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
