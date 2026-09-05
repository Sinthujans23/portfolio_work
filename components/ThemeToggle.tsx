"use client";

import { useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { runViewTransition } from "@/lib/view-transition";

// The `dark` class on <html> is the source of truth — it's set by the inline
// script in the root layout before paint, and by this button afterwards.
// Subscribing to it (rather than mirroring it into state) avoids a setState
// in an effect, and keeps the icon correct no matter who flipped the class.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const next = !dark;
      const root = document.documentElement;

      // Anchor the circular reveal to the button, so the new theme appears
      // to spread from the control the visitor just pressed.
      const rect = e.currentTarget.getBoundingClientRect();
      root.style.setProperty("--tx", `${Math.round(rect.left + rect.width / 2)}px`);
      root.style.setProperty("--ty", `${Math.round(rect.top + rect.height / 2)}px`);

      const apply = () => {
        root.classList.toggle("dark", next);
        try {
          localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
          // Private mode or blocked storage — the theme still applies for this visit.
        }
      };

      // "theme" scopes the circular reveal in globals.css, so section
      // navigation doesn't inherit it. Where the API is missing the helper
      // just applies the change and the CSS colour transitions carry it.
      runViewTransition("theme", apply);
    },
    [dark]
  );

  return (
    <motion.button
      type="button"
      onClick={toggle}
      className="icon-btn overflow-hidden"
      style={{ borderColor: "transparent" }}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      suppressHydrationWarning
      whileHover={{ color: dark ? "var(--c-amber)" : "var(--c-violet)" }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {/* The icons rotate past each other, matching the direction the
          circular theme reveal sweeps. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "sun" : "moon"}
          initial={{ rotate: -75, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 75, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
