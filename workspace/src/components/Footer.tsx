import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        <nav className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#home" scroll={false} className="hover:underline">Home</Link>
          <Link href="#about" scroll={false} className="hover:underline">About</Link>
          <Link href="#skills" scroll={false} className="hover:underline">Skills</Link>
          <Link href="#projects" scroll={false} className="hover:underline">Projects</Link>
          <Link href="#contact" scroll={false} className="hover:underline">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
