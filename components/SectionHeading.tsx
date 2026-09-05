"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Each word rises out of its own clipped line, a beat apart. It's the same
 * gesture as the hero name, reused at a smaller scale so the two read as
 * one idea rather than two effects.
 */
function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-block">
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden py-[0.06em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: delay + i * 0.07, ease: EASE }}
          >
            {word}
            {/* A trailing space inside the clip keeps word gaps intact. */}
            {i < text.split(" ").length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Left-aligned section header: a numbered mono eyebrow, a title, and an
 * optional line of context. The number takes the section's hue and the rule
 * draws itself in on reveal — a small, repeated gesture that ties the six
 * sections together instead of decorating each one differently.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="flex items-center gap-3"
      >
        <span className="eyebrow" style={{ color: "var(--section-accent)" }}>
          {index}
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          className="h-px w-8 origin-left"
          style={{ background: "var(--section-accent)", opacity: 0.5 }}
        />
        <span className="eyebrow">{eyebrow}</span>
      </motion.div>

      <h2 className="h2 mt-4">
        <WordReveal text={title} delay={0.08} />
      </h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
          className="lede mt-3"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
