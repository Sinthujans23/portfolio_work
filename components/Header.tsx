"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import { goToSection, goToTop } from "@/lib/nav";
import ThemeToggle from "./ThemeToggle";

// Mirrors the --section-accent each section sets, so the nav pill takes on
// the colour of the section you're actually in.
const SECTION_HUES: Record<string, string> = {
  about: "var(--c-blue)",
  work: "var(--c-violet)",
  skills: "var(--c-teal)",
  education: "var(--c-amber)",
  contact: "var(--c-rose)",
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Empty means "in the hero" — the observer below only ever fires on
  // entry, so scrolling back up would otherwise leave the last section
  // highlighted and Home never lit again.
  const atTop = active === "";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 120) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    navLinks.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    goToSection(href);
  };

  const home = () => {
    setOpen(false);
    goToTop();
  };

  return (
    <>
      <a href="#main" className="skip-link btn btn-primary btn-sm">
        Skip to content
      </a>

      {/* Transparent over the hero so the aurora shows through, glass once
          content starts passing underneath. */}
      <header
        className={`fixed inset-x-0 top-0 z-50 ${scrolled ? "glass" : ""}`}
        style={{
          background: scrolled ? undefined : "transparent",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        }}
      >
        <div className="wrap flex h-16 items-center justify-between gap-6">
          {/* "Home" is not a section, so it stays out of navLinks — those ids
              drive the IntersectionObserver and there is no #home element.
              It highlights whenever the hero is in view instead. */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              home();
            }}
            aria-current={atTop ? "true" : undefined}
            className="rounded-md text-[0.9375rem] font-semibold tracking-tight no-underline transition-colors"
            style={{ color: atTop ? "var(--text)" : "var(--text-3)" }}
          >
            Home
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
            {navLinks.map(({ label, href }) => {
              const id = href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(href);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className="relative rounded-md px-3 py-1.5 text-[0.8125rem] no-underline transition-colors"
                  style={{ color: isActive ? "var(--text)" : "var(--text-3)" }}
                >
                  {/* A single pill that slides between links, rather than one
                      that fades in and out per item. */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md"
                      style={{
                        background: `color-mix(in srgb, ${SECTION_HUES[id] ?? "var(--accent)"} 12%, transparent)`,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="/cv.pdf" download className="btn btn-ghost btn-sm hidden md:inline-flex">
              Résumé
            </a>
            <button
              type="button"
              className="icon-btn md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="glass fixed inset-0 top-16 z-40 md:hidden"
          >
            <nav className="wrap flex flex-col py-6" aria-label="Sections">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  home();
                }}
                className="border-b py-4 text-lg no-underline"
                style={{ borderColor: "var(--border)" }}
              >
                Home
              </a>
              {navLinks.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(href);
                  }}
                  className="border-b py-4 text-lg no-underline"
                  style={{ borderColor: "var(--border)" }}
                >
                  {label}
                </a>
              ))}
              <a href="/cv.pdf" download className="btn btn-primary mt-6">
                Download résumé
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
