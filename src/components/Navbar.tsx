import Link from 'next/link';
import { useEffect, useState } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      let current = 'home';
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const offsetTop = el.offsetTop;
          if (scrollPos >= offsetTop) {
            current = section.id;
          }
        }
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-sm shadow-md z-50">
      <ul className="flex justify-center space-x-6 p-4">
        {sections.map((section) => (
          <li key={section.id}>
            <Link href={`#${section.id}`} scroll={false}>
              <a
                className={`text-gray-700 hover:text-blue-600 transition-colors ${{
                  active: active === section.id,
                }[active === section.id ? 'active' : '']}`}
              >
                {section.label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
