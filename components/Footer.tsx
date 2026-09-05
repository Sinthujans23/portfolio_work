"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import type { Profile } from "@/lib/content";

const spring = { type: "spring", stiffness: 400, damping: 22 } as const;

export default function Footer({ personalInfo }: { personalInfo: Profile }) {
  const socials = [
    { Icon: GithubIcon, href: personalInfo.github, label: "GitHub", hue: "var(--c-violet)" },
    { Icon: LinkedinIcon, href: personalInfo.linkedin, label: "LinkedIn", hue: "var(--c-blue)" },
  ];

  return (
    <footer className="relative border-t" style={{ borderColor: "var(--border)" }}>
      {/* Hairline that carries the section palette across the full width. */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--c-blue), var(--c-violet), var(--c-teal), var(--c-amber), var(--c-rose), transparent)",
          opacity: 0.4,
        }}
        aria-hidden
      />

      <div className="wrap flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          © {new Date().getFullYear()} {personalInfo.name}. Built with Next.js and Tailwind CSS.
          {/* Only while running locally — /admin 404s in production, so a
              permanent link would be a dead end on the live site. */}
          {process.env.NODE_ENV !== "production" && (
            <>
              {" · "}
              <a href="/admin" className="link-underline">
                Edit projects
              </a>
            </>
          )}
        </p>

        <div className="flex items-center gap-4">
          {socials.map(({ Icon, href, label, hue }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="no-underline"
              style={{ color: "var(--text-3)" }}
              whileHover={{ y: -3, color: hue }}
              whileTap={{ scale: 0.92 }}
              transition={spring}
            >
              <Icon size={17} />
            </motion.a>
          ))}

          <motion.a
            href={`mailto:${personalInfo.email}`}
            className="text-xs no-underline"
            style={{ color: "var(--text-3)" }}
            whileHover={{ color: "var(--c-teal)" }}
            transition={{ duration: 0.2 }}
          >
            {personalInfo.email}
          </motion.a>

          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="icon-btn"
            style={{ width: "2rem", height: "2rem" }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            transition={spring}
          >
            <ArrowUp size={15} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
