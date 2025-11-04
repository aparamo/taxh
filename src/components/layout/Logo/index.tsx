import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
      <div className="font-bold text-2xl md:text-3xl text-primary-500">TaxH</div>
      <div className="text-xs md:text-sm text-gray-400 text-center">
        Juego educativo para aspirantes a gángsters, corporaciones y políticos corruptos
      </div>
    </Link>
  );
};

export default Logo;
