// ─────────────────────────────────────────────────────────────
// Single source of truth for every piece of content on the site.
// Everything here is taken from the CV — nothing is embellished.
//
// ⚠️ Search for `TODO` before deploying: the project repo links are
// the only placeholders left.
// ─────────────────────────────────────────────────────────────

import projectsData from "@/content/projects.json";

export const personalInfo = {
  name: "Denusha Thavaruban",
  shortName: "Denusha",
  role: "Software Engineering Undergraduate",
  location: "Sri Lanka",

  email: "denushadenu12@gmail.com",
  phone: "+94 75 371 7693",
  github: "https://github.com/denusha1",
  linkedin: "https://linkedin.com/in/denushathavaruban",

  university: "University of Moratuwa",
  degree: "BSc (Hons) in Information Technology & Management",
  cgpa: "3.53 / 4.00",

  // One line: what you do, and what you are looking for.
  tagline:
    "Third-year Information Technology & Management undergraduate at the University of Moratuwa, building full-stack web applications with React, Next.js, Node.js and REST APIs. Looking for a software engineering internship.",

  // Two short paragraphs. Concrete over adjectives.
  bio: [
    "I'm a third-year Information Technology & Management undergraduate at the University of Moratuwa, currently at a 3.53 CGPA. Most of what I know about building software came from projects rather than lectures — designing the data model, writing the REST API, and then living with the frontend decisions I made two weeks earlier.",
    "The work I've spent the most time on is a performance management system, where I owned the evaluation and approval workflow: the multi-level review chain, the status model underneath it, and the screens reviewers actually use. Alongside web development I'm working through data science and machine learning with NumPy, pandas and scikit-learn. I'm looking for an internship where I can keep building next to engineers who will tell me when I'm wrong.",
  ],

  // Facts a reader can verify, not self-assessed scores.
  facts: [
    { label: "Studying", value: "BSc (Hons) IT & Management" },
    { label: "University", value: "University of Moratuwa" },
    { label: "CGPA", value: "3.53 / 4.00" },
    { label: "Status", value: "Seeking an internship" },
  ],

  interests: [
    "Data science & statistical analysis",
    "AI, machine learning & data-driven problem solving",
  ],
};

// Grouped the way the CV groups them. No percentages — a self-assigned
// "React 88%" is not information a reader can act on.
export const skills: { group: string; items: string[]; note?: string }[] = [
  {
    group: "Programming",
    items: ["JavaScript", "TypeScript", "Python", "Java", "C"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "Angular", "Tailwind CSS"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Express.js", "Spring Boot", "Ballerina"],
  },
  {
    group: "Databases",
    items: ["MongoDB", "MySQL", "PostgreSQL"],
  },
  {
    group: "Cloud & DevOps",
    items: ["AWS", "Docker", "Kubernetes", "Vercel"],
    note: "Kubernetes at a basic level",
  },
  {
    group: "Data & ML",
    items: ["NumPy", "pandas", "scikit-learn", "Matplotlib", "Plotly"],
  },
  {
    group: "Tools & Design",
    items: ["Git & GitHub", "VS Code", "Jupyter Notebook", "Figma", "Photoshop"],
  },
];

export type Project = {
  id: string;
  title: string;
  context: string;
  /** Team projects say "My contribution" over the bullets, so a reader
   *  never has to guess which parts were actually yours. */
  team?: boolean;
  summary: string;
  detail: string[];
  stack: string[];
  featured?: boolean;
  repo?: string;
  live?: string;
};

// Projects live in content/projects.json so the dev-only editor at /admin
// can rewrite them. Everything else on the site is still edited here.
export const projects = projectsData as Project[];

export const education = [
  {
    degree: "BSc (Hons) in Information Technology & Management",
    institution: "University of Moratuwa",
    location: "Moratuwa, Sri Lanka",
    period: "2023 — Present",
    status: "In progress",
    note: "CGPA 3.53 / 4.00.",
    breakdown: [
      { label: "Semester 1", value: "3.68" },
      { label: "Semester 2", value: "3.69" },
      { label: "Semester 3", value: "3.22" },
    ],
  },
  {
    degree: "GCE Advanced Level — Physical Science",
    institution: "J/Vembadi Girls' High School",
    location: "Jaffna, Sri Lanka",
    period: "2020 — 2022",
    status: "Completed",
    note: "Physical Science stream.",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];
