'use client';

import Logo from '../Logo';
import LocaleSwitcher from '../Header/LocaleSwitcher';
import NavLink from '@/components/NavLink';
import MenuButton from '../MenuButton';
import {useTranslations} from 'next-intl';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const t = useTranslations('Navigation');
  
  return (
    <nav className="flex items-center justify-between p-4 max-w-5xl mx-auto w-full">
      <Logo />
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="/">{t('home')}</NavLink>
        <NavLink href="/about">{t('about')}</NavLink>
      </div>
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        <MenuButton onClick={onMenuClick} />
      </div>
    </nav>
  );
};

export default Navbar;
