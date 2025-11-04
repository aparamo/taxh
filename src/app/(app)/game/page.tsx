'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/game/store';
import { motion } from 'motion/react';
import { GameRole } from '@/game/types';
import { RealCaseSelector } from '@/components/game/RealCaseSelector';

export default function GameLobbyPage() {
  const router = useRouter();
  const initializeGame = useGameStore((state) => state.initializeGame);
  const tutorialComplete = useGameStore((state) => state.tutorialComplete);
  const [showRealCases, setShowRealCases] = useState(false);

  const handleStartGame = (role: GameRole) => {
    initializeGame(role);
    router.push('/game/play'); // Go directly to play page - tutorial overlay will show
  };

  return (
    <div className="min-h-screen bg-game-background-darker text-white p-4 md:p-8">
      <motion.div 
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center space-y-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">Selecciona tu Rol</h1>
          <p className="text-gray-400">Elige quién serás en este mundo de finanzas opacas</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Multimillionaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={tutorialComplete ? { y: -5 } : undefined}
          >
            <Card className={`bg-game-background-dark border-primary-500 border-2 p-6 space-y-4 transition-colors ${tutorialComplete ? 'cursor-pointer hover:border-primary-400' : ''}`}>
              <div className="text-4xl">💰</div>
              <h2 className="text-2xl font-bold text-primary-500">Multimillonario</h2>
              {!tutorialComplete && (
                <div className="bg-primary-500/20 border border-primary-500/50 rounded px-2 py-1 text-xs text-primary-300 inline-block">
                  Disponible para Tutorial
                </div>
              )}
              <p className="text-gray-400 text-sm">
                Has heredado $5 millones en efectivo que necesitas legitimar. Elige estructuras offshore para proteger tu patrimonio.
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div>• Fondos iniciales: $5M</div>
                <div>• Heat inicial: Bajo</div>
                <div>• Mecanismos: Básicos a avanzados</div>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => handleStartGame('multimillionaire')}
                  className="w-full bg-primary-500 hover:bg-primary-600"
                >
                  Seleccionar
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Cartel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={tutorialComplete ? { y: -5 } : undefined}
          >
            <Card className={`bg-game-background-dark border-red-500 border-2 p-6 space-y-4 transition-colors ${tutorialComplete ? 'cursor-pointer hover:border-red-400' : 'opacity-60'}`}>
              <div className="text-4xl">💊</div>
              <h2 className="text-2xl font-bold text-red-500">Organización de Tráfico</h2>
              {!tutorialComplete && (
                <div className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-xs text-gray-400 inline-block">
                  Completa el Tutorial para desbloquear
                </div>
              )}
              <p className="text-gray-400 text-sm">
                Lava grandes volúmenes de dinero ilícito rápidamente. Mecanismos de alto riesgo y alto volumen.
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div>• Fondos iniciales: $10M</div>
                <div>• Heat inicial: Alto</div>
                <div>• Ventaja: +30% capacidad</div>
                <div>• Desventaja: +25% heat generado</div>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => handleStartGame('cartel')}
                  disabled={!tutorialComplete}
                  className={`w-full ${tutorialComplete ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                  {tutorialComplete ? 'Seleccionar' : 'Bloqueado'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Multinational */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={tutorialComplete ? { y: -5 } : undefined}
          >
            <Card className={`bg-game-background-dark border-blue-500 border-2 p-6 space-y-4 transition-colors ${tutorialComplete ? 'cursor-pointer hover:border-blue-400' : 'opacity-60'}`}>
              <div className="text-4xl">🏢</div>
              <h2 className="text-2xl font-bold text-blue-500">Corporación Multinacional</h2>
              {!tutorialComplete && (
                <div className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-xs text-gray-400 inline-block">
                  Completa el Tutorial para desbloquear
                </div>
              )}
              <p className="text-gray-400 text-sm">
                Optimización fiscal agresiva. Usa precios de transferencia y estructuras complejas para minimizar impuestos.
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div>• Fondos iniciales: $50M</div>
                <div>• Heat inicial: Muy bajo</div>
                <div>• Ventaja: Estructuras avanzadas</div>
                <div>• Desventaja: Escrutinio fiscal</div>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => handleStartGame('multinational')}
                  disabled={!tutorialComplete}
                  className={`w-full ${tutorialComplete ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                  {tutorialComplete ? 'Seleccionar' : 'Bloqueado'}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Real Cases Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-game-background-dark border-2 border-yellow-500/70 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📚</div>
                <div>
                  <h2 className="text-2xl font-bold text-yellow-400">Casos Reales</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Juega casos históricos famosos basados en hechos reales
                  </p>
                </div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded px-3 py-1 text-xs text-yellow-300 font-semibold">
                Basado en hechos reales
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Experimenta escándalos reales de corrupción y evasión fiscal. Sigue los pasos históricos o crea tu propio camino. 
              Recibe consejos de un &quot;asesor corrupto&quot; y compara tus decisiones con lo que realmente sucedió.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => setShowRealCases(true)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                Ver Casos Disponibles
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Real Case Selector Modal */}
      {showRealCases && (
        <RealCaseSelector
          isOpen={showRealCases}
          onClose={() => setShowRealCases(false)}
        />
      )}
    </div>
  );
}
