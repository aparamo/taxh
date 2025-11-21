'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/game/store';
import { motion } from 'motion/react';
import { GameRole } from '@/game/types';
import { RealCaseSelector } from '@/components/game/RealCaseSelector';
import {useTranslations} from 'next-intl';

export default function GameLobbyPage() {
  const t = useTranslations('GameLobby');
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
          <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="text-gray-400">{t('subtitle')}</p>
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
              <h2 className="text-2xl font-bold text-primary-500">{t('roles.multimillionaire.title')}</h2>
              {!tutorialComplete && (
                <div className="bg-primary-500/20 border border-primary-500/50 rounded px-2 py-1 text-xs text-primary-300 inline-block">
                  {t('roles.multimillionaire.availableForTutorial')}
                </div>
              )}
              <p className="text-gray-400 text-sm">
                {t('roles.multimillionaire.description')}
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div>• {t('roles.multimillionaire.stats.startingFunds')}</div>
                <div>• {t('roles.multimillionaire.stats.initialHeat')}</div>
                <div>• {t('roles.multimillionaire.stats.mechanisms')}</div>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => handleStartGame('multimillionaire')}
                  className="w-full bg-primary-500 hover:bg-primary-600"
                >
                  {t('roles.multimillionaire.select')}
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
              <h2 className="text-2xl font-bold text-red-500">{t('roles.cartel.title')}</h2>
              {!tutorialComplete && (
                <div className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-xs text-gray-400 inline-block">
                  {t('roles.cartel.locked')}
                </div>
              )}
              <p className="text-gray-400 text-sm">
                {t('roles.cartel.description')}
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div>• {t('roles.cartel.stats.startingFunds')}</div>
                <div>• {t('roles.cartel.stats.initialHeat')}</div>
                <div>• {t('roles.cartel.stats.advantage')}</div>
                <div>• {t('roles.cartel.stats.disadvantage')}</div>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => handleStartGame('cartel')}
                  disabled={!tutorialComplete}
                  className={`w-full ${tutorialComplete ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                  {tutorialComplete ? t('roles.cartel.select') : t('roles.cartel.lockedButton')}
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
              <h2 className="text-2xl font-bold text-blue-500">{t('roles.multinational.title')}</h2>
              {!tutorialComplete && (
                <div className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-xs text-gray-400 inline-block">
                  {t('roles.multinational.locked')}
                </div>
              )}
              <p className="text-gray-400 text-sm">
                {t('roles.multinational.description')}
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div>• {t('roles.multinational.stats.startingFunds')}</div>
                <div>• {t('roles.multinational.stats.initialHeat')}</div>
                <div>• {t('roles.multinational.stats.advantage')}</div>
                <div>• {t('roles.multinational.stats.disadvantage')}</div>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => handleStartGame('multinational')}
                  disabled={!tutorialComplete}
                  className={`w-full ${tutorialComplete ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                  {tutorialComplete ? t('roles.multinational.select') : t('roles.multinational.lockedButton')}
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
                  <h2 className="text-2xl font-bold text-yellow-400">{t('realCases.title')}</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {t('realCases.subtitle')}
                  </p>
                </div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded px-3 py-1 text-xs text-yellow-300 font-semibold">
                {t('realCases.badge')}
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {t('realCases.description')}
            </p>
            <div className="pt-4">
              <Button
                onClick={() => setShowRealCases(true)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                {t('realCases.viewCases')}
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
