"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Hash, Search, Zap } from "lucide-react";
import { navLinks } from "@/lib/data";
import type { Profile } from "@/lib/content";
import { goToSection, goToTop } from "@/lib/nav";

type Item = { label: string; kind: "section" | "action"; run: () => void };

const SECTIONS: Item[] = [
  // Home is the hero, which has no id to scroll to — it is the top.
  {
    label: "Home",
    kind: "section",
    run: goToTop,
  },
  ...navLinks.map(({ label, href }) => ({
    label,
    kind: "section" as const,
    run: () => goToSection(href),
  })),
];

// Actions depend on the profile, which now comes from the database, so they
// are built per render rather than at module scope.
function buildActions(profile: Profile): Item[] {
  return [
    {
      label: "Download résumé",
      kind: "action",
      run: () => {
        const a = document.createElement("a");
        a.href = "/cv.pdf";
        a.download = "";
        a.click();
      },
    },
    { label: "Send email", kind: "action", run: () => window.open(`mailto:${profile.email}`) },
    { label: "Open GitHub", kind: "action", run: () => window.open(profile.github, "_blank") },
    { label: "Open LinkedIn", kind: "action", run: () => window.open(profile.linkedin, "_blank") },
  ];
}

export default function CommandPalette({ personalInfo }: { personalInfo: Profile }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...SECTIONS, ...buildActions(personalInfo)].filter((i) =>
      i.label.toLowerCase().includes(q)
    );
  }, [query, personalInfo]);

  const select = (item: Item) => {
    item.run();
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % Math.max(items.length, 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + items.length) % Math.max(items.length, 1));
    }
    if (e.key === "Enter" && items[cursor]) select(items[cursor]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="glass w-full max-w-md overflow-hidden rounded-xl"
            style={{
              border: "1px solid var(--border-strong)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
            }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <Search size={16} style={{ color: "var(--text-3)" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Jump to a section…"
                aria-label="Search sections and actions"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--text)" }}
              />
            </div>

            <div className="max-h-72 overflow-y-auto py-1.5">
              {items.length === 0 ? (
                <p className="py-8 text-center text-sm" style={{ color: "var(--text-3)" }}>
                  No matches
                </p>
              ) : (
                items.map((item, i) => (
                  <button
                    key={item.label}
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => select(item)}
                    className="flex w-full cursor-pointer items-center gap-3 border-none px-4 py-2 text-left"
                    style={{
                      background: cursor === i ? "var(--bg-subtle)" : "transparent",
                      color: "var(--text)",
                    }}
                  >
                    {item.kind === "section" ? (
                      <Hash size={13} style={{ color: "var(--text-3)" }} />
                    ) : (
                      <Zap size={13} style={{ color: "var(--accent)" }} />
                    )}
                    <span className="text-sm">{item.label}</span>
                    {cursor === i && (
                      <CornerDownLeft size={13} className="ml-auto" style={{ color: "var(--text-3)" }} />
                    )}
                  </button>
                ))
              )}
            </div>

            <div
              className="flex items-center justify-between px-4 py-2"
              style={{ borderTop: "1px solid var(--border)", background: "var(--bg-subtle)" }}
            >
              <span className="mono text-[0.7rem]" style={{ color: "var(--text-3)" }}>
                ↑↓ navigate · ↵ select · esc close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
