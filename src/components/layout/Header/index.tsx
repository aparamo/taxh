'use client';

import { useState } from 'react';
import Navbar from '../Navbar';
import MobileNav from '../MobileNav';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="border-b border-gray-800 bg-game-background-dark">
      <Navbar onMenuClick={toggleMobileMenu} />
      {isMobileMenuOpen && <MobileNav onClose={toggleMobileMenu} />}
    </header>
  );
};

export default Header;