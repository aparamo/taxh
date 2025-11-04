import Link from 'next/link';
import Logo from '../Logo';

const Footer = () => {
  return (
    <footer className="bg-game-background-darker border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-8">
          <Link href="/about" className="text-base text-gray-400 hover:text-primary-500 transition-colors">
            Acerca de
          </Link>

        </nav>
        <div className="text-center text-xs text-gray-500 space-y-1">
          <div>Desarrollado con &lt;3 por adri.com.mx</div>
          <div>Dedicación especial para Boris, Héctor, José Manuel y mis demás compas.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
