'use client';

import { HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { EducationalDialog } from './EducationalDialog';
import { EducationalContent } from '@/game/data/educationalContent';
import { cn } from '@/lib/utils';

interface InfoButtonProps {
  content: EducationalContent;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPulseOnMount?: boolean;
}

export function InfoButton({ 
  content, 
  size = 'sm',
  className,
  showPulseOnMount = false,
}: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownPulse, setHasShownPulse] = useState(false);

  useEffect(() => {
    if (showPulseOnMount && !hasShownPulse) {
      const timer = setTimeout(() => setHasShownPulse(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [showPulseOnMount, hasShownPulse]);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'bg-primary-500/20 hover:bg-primary-500/30',
          'text-primary-400 hover:text-primary-300',
          'border border-primary-500/30',
          'transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-game-background-dark',
          sizeClasses[size],
          className
        )}
        aria-label={`Más información sobre ${content.title}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={
          showPulseOnMount && !hasShownPulse
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }
            : {}
        }
        transition={
          showPulseOnMount && !hasShownPulse
            ? {
                duration: 1.5,
                repeat: 2,
                ease: 'easeInOut',
              }
            : { duration: 0.2 }
        }
      >
        <HelpCircle size={iconSize[size]} />
      </motion.button>

      {isOpen && (
        <EducationalDialog
          content={content}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
