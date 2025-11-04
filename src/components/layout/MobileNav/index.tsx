'use client';

import { X } from 'lucide-react';
import NavLink from '@/components/NavLink';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  onClose: () => void;
}

const MobileNav = ({ onClose }: MobileNavProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm md:hidden">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>
      <nav className="flex flex-col items-center gap-8 mt-8">
        <NavLink href="/" onClick={onClose}>Home</NavLink>
        <NavLink href="/about" onClick={onClose}>About</NavLink>
      </nav>
    </div>
  );
};

export default MobileNav;
