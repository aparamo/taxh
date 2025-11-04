import Logo from '../Logo';
//import LocaleSwitcher from '../Header/LocaleSwitcher';
import NavLink from '@/components/NavLink';
import MenuButton from '../MenuButton';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <nav className="flex items-center justify-between p-4 max-w-5xl mx-auto w-full">
      <Logo />
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="/">Inicio</NavLink>
        <NavLink href="/about">Acerca de</NavLink>
      </div>
      <div className="flex items-center gap-4">
        {/* <LocaleSwitcher /> */}
        <MenuButton onClick={onMenuClick} />
      </div>
    </nav>
  );
};

export default Navbar;
