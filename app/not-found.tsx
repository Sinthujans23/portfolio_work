import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1 className="h1 mt-4">Page not found</h1>
        <p className="lede mt-4">
          That page doesn&apos;t exist, or it moved somewhere else.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Back home
          </Link>
          <Link href="/#contact" className="btn btn-ghost">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
