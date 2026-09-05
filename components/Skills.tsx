"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import type { SkillGroup } from "@/lib/content";

// One hue per group, so the eye can tell the five rows apart at a glance.
const HUES = ["var(--c-blue)", "var(--c-violet)", "var(--c-teal)", "var(--c-amber)", "var(--c-rose)"];

export default function Skills({ skills }: { skills: SkillGroup[] }) {
  return (
    <section
      id="skills"
      className="section"
      style={
        { background: "var(--bg-subtle)", "--section-accent": "var(--c-teal)" } as React.CSSProperties
      }
    >
      <div className="wrap">
        <SectionHeading
          index="03"
          eyebrow="Skills"
          title="What I build with"
          description="Grouped by what I reach for, not rated out of a hundred."
        />

        <dl className="border-t" style={{ borderColor: "var(--border)" }}>
          {skills.map(({ group, items, note }, gi) => {
            const hue = HUES[gi % HUES.length];
            return (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: gi * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group grid gap-x-10 gap-y-3 border-b py-6 md:grid-cols-[10rem_minmax(0,1fr)]"
                style={{ borderColor: "var(--border)", "--section-accent": hue } as React.CSSProperties}
              >
                <dt className="flex items-start gap-3">
                  <motion.span
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: 0.1 + gi * 0.05 }}
                    className="mt-1 h-4 w-0.5 shrink-0 origin-top rounded-full"
                    style={{ background: hue }}
                    aria-hidden
                  />
                  <span>
                    <span className="eyebrow">{group}</span>
                    {note && (
                      <span className="mt-1 block text-xs" style={{ color: "var(--text-3)" }}>
                        {note}
                      </span>
                    )}
                  </span>
                </dt>

                <dd className="flex flex-wrap gap-1.5">
                  {items.map((item, i) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.32, delay: gi * 0.05 + i * 0.035 }}
                      whileHover={{ y: -2 }}
                      className="tag"
                    >
                      {item}
                    </motion.span>
                  ))}
                </dd>
              </motion.div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
