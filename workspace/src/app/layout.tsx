import './globals.css';
import Navbar from '@/components/Navbar';
import Seo from '@/components/Seo';

export const metadata = {
  title: 'Portfolio',
  description: 'Personal portfolio showcasing projects and skills',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Global SEO tags */}
        <Seo title={metadata.title} description={metadata.description} />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
