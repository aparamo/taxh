'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { HomeGlobe } from '@/components/home/HomeGlobe';
import { useState } from 'react';

export default function HomePage() {
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-game-background-darker text-white flex flex-col">
      {/* Header Section */}
      <motion.div 
        className="text-center space-y-4 py-8 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Paraísos Fiscales
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Un simulador educativo sobre corrupción internacional y lavado de dinero
        </motion.p>
        <motion.div 
          className="pt-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/game">
            <Button 
              size="lg" 
              className="bg-primary-500 hover:bg-primary-600 text-white text-lg px-8 py-6"
            >
              Jugar
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Globe Section - Full Width */}
      <motion.div 
        className="flex-1 w-full px-4 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="w-full h-[600px] md:h-[700px] lg:h-[800px] rounded-lg overflow-hidden border border-gray-800">
          <HomeGlobe 
            selectedCountryId={selectedCountryId}
            onCountrySelect={setSelectedCountryId}
          />
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div 
        className="text-center px-4 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <p className="text-sm text-gray-500">
          Este es un juego educativo. Todo el contenido está basado en casos reales documentados.
        </p>
      </motion.div>
    </div>
  );
}
