"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: "0%",
        position: "fixed",
        insetInline: 0,
        top: 0,
        height: "2px",
        // Runs through the section hues in the order you meet them.
        background:
          "linear-gradient(90deg, var(--c-blue), var(--c-violet) 35%, var(--c-teal) 62%, var(--c-amber) 82%, var(--c-rose))",
        zIndex: 60,
      }}
    />
  );
}
