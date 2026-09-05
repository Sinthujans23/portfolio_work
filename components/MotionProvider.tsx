"use client";

import { MotionConfig } from "framer-motion";

/**
 * The `prefers-reduced-motion` block in globals.css only neutralises CSS
 * animations and transitions. Framer Motion writes transforms straight to
 * the element on every frame, so none of the reveals, parallax or springs
 * were covered by it. `reducedMotion="user"` makes Framer honour the OS
 * setting too — transform and layout animations are dropped, opacity is
 * kept, so content still appears rather than staying invisible.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
