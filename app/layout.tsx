import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import CommandPalette from "@/components/CommandPalette";
import MotionProvider from "@/components/MotionProvider";
import { personalInfo } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

const title = `${personalInfo.name} — ${personalInfo.role}`;
const description =
  "Full-stack developer working with React, Next.js, Node.js and REST APIs. Third-year Information Technology & Management undergraduate at the University of Moratuwa, Sri Lanka, seeking a software engineering internship.";

export const metadata: Metadata = {
  metadataBase: new URL("https://denusha.vercel.app"),
  title: {
    default: title,
    template: `%s — ${personalInfo.shortName}`,
  },
  description,
  authors: [{ name: personalInfo.name }],
  creator: personalInfo.name,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${personalInfo.name} — Portfolio`,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// Runs before paint so the stored theme is applied without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Next 16 no longer overrides `scroll-behavior` on navigation unless
    // `data-scroll-behavior` is set — without it, route changes animate a
    // long smooth scroll instead of jumping to the top.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <MotionProvider>
          {children}
          <CommandPalette />
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
