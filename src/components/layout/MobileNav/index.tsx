'use client';

import { X } from 'lucide-react';
import NavLink from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface MobileNavProps {
  onClose: () => void;
}

const MobileNav = ({ onClose }: MobileNavProps) => {
  const t = useTranslations('MobileNav');
  
  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm md:hidden">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">{t('closeMenu')}</span>
        </Button>
      </div>
      <nav className="flex flex-col items-center gap-8 mt-8">
        <NavLink href="/" onClick={onClose}>{t('home')}</NavLink>
        <NavLink href="/about" onClick={onClose}>{t('about')}</NavLink>
      </nav>
    </div>
  );
};

export default MobileNav;
