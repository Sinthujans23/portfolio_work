"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { personalInfo } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

/**
 * The name rises out of a clipped line rather than just fading in. It reads
 * as one deliberate gesture at the top of the page, which is why it is the
 * only element on the site that gets its own animation.
 */
function NameReveal({ text }: { text: string }) {
  return (
    <h1 className="h1 mt-6 overflow-hidden py-[0.12em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
        className="block"
      >
        {text}
      </motion.span>
    </h1>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Depth on scroll: the backdrop trails the content instead of moving with
  // it. Tracked against the hero itself, so it stops costing anything once
  // the section is out of view.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const auroraY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);

  const socials = [
    { Icon: GithubIcon, href: personalInfo.github, label: "GitHub", hue: "var(--c-violet)" },
    { Icon: LinkedinIcon, href: personalInfo.linkedin, label: "LinkedIn", hue: "var(--c-blue)" },
  ];

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88vh] items-center overflow-hidden pt-28 pb-20"
    >
      <motion.div className="dot-grid" style={{ y: gridY }} aria-hidden />
      <motion.div className="aurora" style={{ y: auroraY }} aria-hidden />

      <motion.div
        className="wrap relative z-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
          className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16"
        >
          <div>
            <motion.p
              variants={rise}
              transition={{ duration: 0.5, ease: EASE }}
              className="eyebrow flex items-center gap-2.5"
            >
              <span
                className="pulse-dot inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "#16a34a" }}
                aria-hidden
              />
              Seeking a software engineering internship
            </motion.p>

            <NameReveal text={personalInfo.name} />

            <motion.p
              variants={rise}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-3 text-lg"
              style={{ color: "var(--text-2)" }}
            >
              {personalInfo.role}
              <span className="mx-2" style={{ color: "var(--c-violet)" }}>
                ·
              </span>
              {personalInfo.location}
            </motion.p>

            <motion.p
              variants={rise}
              transition={{ duration: 0.5, ease: EASE }}
              className="lede mt-8"
              style={{ maxWidth: "52ch" }}
            >
              {personalInfo.tagline}
            </motion.p>

            <motion.div
              variants={rise}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <motion.a
                href={`mailto:${personalInfo.email}`}
                className="btn btn-primary"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Mail size={16} />
                Get in touch
              </motion.a>
              <motion.a
                href="/cv.pdf"
                download
                className="btn btn-ghost"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Résumé
              </motion.a>

              <div className="ml-1 flex items-center gap-1">
                {socials.map(({ Icon, href, label, hue }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="icon-btn"
                    style={{ borderColor: "transparent" }}
                    whileHover={{ y: -3, color: hue }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div variants={rise} transition={{ duration: 0.5, ease: EASE }}>
            {/* Sized in CSS, not by the component: `fill` would inline
                width/height/inset and override the crop. */}
            <motion.div
              className="portrait mx-auto w-40 sm:w-44"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.35 }}
            >
              <Image
                src="/profile.jpg"
                alt={`${personalInfo.name}, ${personalInfo.role}`}
                width={1218}
                height={1600}
                sizes="500px"
                priority
              />
            </motion.div>

            {/* Facts, not statistics. Everything here is checkable. */}
            <dl className="card glass glass-edge spotlight mt-8">
              {personalInfo.facts.map(({ label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.6 + i * 0.09, ease: EASE }}
                  className={`group flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="h-5 w-0.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-y-125"
                    style={{
                      background: [
                        "var(--c-blue)",
                        "var(--c-violet)",
                        "var(--c-teal)",
                        "var(--c-amber)",
                      ][i % 4],
                    }}
                    aria-hidden
                  />
                  <div className="flex min-w-0 flex-col">
                    <dt className="eyebrow">{label}</dt>
                    <dd className="text-sm" style={{ color: "var(--text)" }}>
                      {value}
                    </dd>
                  </div>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Two layers on purpose: the outer div carries the scroll-linked
          opacity as a MotionValue, the inner one the one-off entrance.
          Animating `opacity` on a single element while also binding it to a
          MotionValue makes the two fight over the same property. */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
      >
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ color: "var(--text-3)" }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Scroll to about"
          className="block no-underline"
        >
          <motion.span
            className="block"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={18} />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}
