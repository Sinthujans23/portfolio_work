import Head from 'next/head';

interface SeoProps {
  title?: string;
  description?: string;
  ogImage?: string; // URL to Open Graph image
}

/**
 * Seo component injects common meta tags into the <head>.
 * It can be used globally (e.g., in layout) or per‑section.
 */
export default function Seo({ title, description, ogImage }: SeoProps) {
  const defaultTitle = 'Portfolio';
  const defaultDescription = 'Personal portfolio showcasing projects and skills';

  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const pageDescription = description ?? defaultDescription;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Head>
  );
}
