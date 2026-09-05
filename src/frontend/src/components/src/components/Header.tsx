import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `mx-2 py-1 px-3 rounded hover:bg-gray-200 ${isActive ? 'font-bold bg-gray-200' : ''}`;

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between py-4 px-2">
        <div className="text-xl font-semibold">My Portfolio</div>
        <div className="flex space-x-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/projects" className={linkClass}>Projects</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          <NavLink to="/admin/login" className={linkClass}>Admin</NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
