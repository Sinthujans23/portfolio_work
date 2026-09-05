import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white py-4 mt-8">
    <div className="container mx-auto text-center">
      © {new Date().getFullYear()} My Portfolio. All rights reserved.
    </div>
  </footer>
);

export default Footer;
