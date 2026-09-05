import Link from 'next/link';
import { useEffect } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  // Add smooth scroll behavior for hash links (fallback for browsers without CSS scroll-behavior)
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'A') return;
      const href = (target as HTMLAnchorElement).getAttribute('href');
      if (!href?.startsWith('#')) return;
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', href);
      }
    };
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-xl font-bold">Portfolio</div>
          <div className="hidden md:flex space-x-4">
            {sections.map((sec) => (
              <Link key={sec.id} href={`#${sec.id}`} scroll={false} className="text-gray-700 hover:text-gray-900">
                {sec.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
