"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { personalInfo } from "@/lib/data";

const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const formConfigured = Boolean(FORM_ID && FORM_ID !== "your_form_id_here");

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Without a form backend configured, hand the message to the visitor's
    // mail client rather than pretending it was delivered.
    if (!formConfigured) {
      const body = `${form.message}\n\n— ${form.name} (${form.email})`;
      window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
        `Portfolio enquiry from ${form.name}`
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      setForm({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const channels = [
    { label: "Email", value: personalInfo.email, href: `mailto:${personalInfo.email}`, Icon: null },
    {
      label: "Phone",
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone.replace(/\s/g, "")}`,
      Icon: null,
    },
    {
      label: "GitHub",
      value: personalInfo.github.replace(/^https?:\/\//, ""),
      href: personalInfo.github,
      Icon: GithubIcon,
    },
    {
      label: "LinkedIn",
      value: personalInfo.linkedin.replace(/^https?:\/\//, ""),
      href: personalInfo.linkedin,
      Icon: LinkedinIcon,
    },
  ];

  return (
    <section
      id="contact"
      className="section"
      style={
        {
          background: "var(--bg-subtle)",
          "--section-accent": "var(--c-rose)",
        } as React.CSSProperties
      }
    >
      <div className="wrap">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title="Get in touch"
          description="I'm looking for a software engineering internship. If you have a role, a question, or a project worth building — email is the fastest way to reach me."
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal>
            <dl className="border-t" style={{ borderColor: "var(--border)" }}>
              {channels.map(({ label, value, href, Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="row flex items-center justify-between gap-4 border-b py-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <dt className="eyebrow flex items-center gap-2">
                    {Icon && <Icon size={13} />}
                    {label}
                  </dt>
                  <dd>
                    <a
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1 text-sm"
                    >
                      {value}
                      <ArrowUpRight size={13} />
                    </a>
                  </dd>
                </motion.div>
              ))}
            </dl>

            <p className="mt-6 text-sm" style={{ color: "var(--text-3)" }}>
              Based in {personalInfo.location}. Open to remote and on-site roles.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            {status === "sent" ? (
              <div className="card flex flex-col items-start gap-3 p-8">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  <Check size={18} />
                </motion.span>
                <h3 className="h3">Message sent</h3>
                <p className="text-sm" style={{ color: "var(--text-2)" }}>
                  Thanks for reaching out — I&apos;ll reply to your email address.
                </p>
                <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={() => setStatus("idle")}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      required
                      autoComplete="name"
                      className="field"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      required
                      autoComplete="email"
                      className="field"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    required
                    rows={6}
                    className="field resize-y"
                    placeholder="What would you like to talk about?"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm" style={{ color: "#dc2626" }}>
                    That didn&apos;t send. Please email me directly at{" "}
                    <a className="link-underline" href={`mailto:${personalInfo.email}`}>
                      {personalInfo.email}
                    </a>
                    .
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === "sending"}
                    whileHover={status === "sending" ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {status === "sending" && (
                      <motion.span
                        className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        aria-hidden
                      />
                    )}
                    {status === "sending" ? "Sending…" : "Send message"}
                  </motion.button>
                  {!formConfigured && (
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      Opens in your mail client.
                    </p>
                  )}
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
