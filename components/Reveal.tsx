"use client";

import { motion } from "framer-motion";

/**
 * A single, quiet entrance used everywhere on the page: a short fade and a
 * 12px rise, once. Keeping one motion vocabulary is what stops a site from
 * feeling like a demo reel.
 */
export default function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "li" | "section";
  className?: string;
}) {
  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}
