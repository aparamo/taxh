'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={onClick} 
      className="md:hidden border-gray-700 text-white hover:bg-gray-800 hover:text-white"
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Open menu</span>
    </Button>
  );
};

export default MenuButton;
