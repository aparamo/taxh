'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/game/store';
import { multimillionaireScenario } from '@/game/data/scenarios';
import { checkObjectiveCompletion } from '@/game/logic/validation';
import {useTranslations} from 'next-intl';

export default function TutorialPage() {
  const t = useTranslations('Game.TutorialPage');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const gameState = useGameStore((state) => state);
  const completeObjective = useGameStore((state) => state.completeObjective);

  // Check if objective is completed
  useEffect(() => {
    if (currentStep === 4 && gameState.currentObjective) {
      const isComplete = checkObjectiveCompletion(gameState.currentObjective, gameState);
      if (isComplete && !gameState.currentObjective.completed) {
        completeObjective();
      }
    }
  }, [gameState, currentStep, completeObjective]);

  const steps = [
    {
      title: t('steps.welcome.title'),
      content: (
        <div className="space-y-4">
          <p className="text-lg">{multimillionaireScenario.description}</p>
          <div className="bg-game-background-darker p-4 rounded-lg">
            <h3 className="font-bold mb-2">{t('steps.welcome.yourObjective')}</h3>
            <p>{multimillionaireScenario.tutorialObjective.description}</p>
          </div>
        </div>
      ),
    },
    {
      title: t('steps.selectCountry.title'),
      content: (
        <div className="space-y-4">
          <p>{t('steps.selectCountry.description')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card className="bg-game-background-dark p-3 sm:p-4">
              <div className="text-2xl mb-2">🇻🇬</div>
              <h3 className="font-bold text-sm sm:text-base">BVI</h3>
              <p className="text-xs sm:text-sm text-gray-400">{t('steps.selectCountry.highSecrecy')}</p>
            </Card>
            <Card className="bg-game-background-dark p-3 sm:p-4">
              <div className="text-2xl mb-2">🇵🇦</div>
              <h3 className="font-bold text-sm sm:text-base">Panamá</h3>
              <p className="text-xs sm:text-sm text-gray-400">{t('steps.selectCountry.highRisk')}</p>
            </Card>
            <Card className="bg-game-background-dark p-3 sm:p-4">
              <div className="text-2xl mb-2">🇨🇭</div>
              <h3 className="font-bold text-sm sm:text-base">Suiza</h3>
              <p className="text-xs sm:text-sm text-gray-400">{t('steps.selectCountry.privateBanking')}</p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: t('steps.firstTransaction.title'),
      content: (
        <div className="space-y-4">
          <p>{t('steps.firstTransaction.description')}</p>
          <div className="space-y-2">
            <Card className="bg-game-background-dark p-4">
              <h3 className="font-bold">Sociedad Fantasma</h3>
              <p className="text-sm text-gray-400">$5,000 {t('steps.firstTransaction.setup')} • 85{t('steps.firstTransaction.success')}</p>
            </Card>
            <Card className="bg-game-background-dark p-4">
              <h3 className="font-bold">Fideicomiso</h3>
              <p className="text-sm text-gray-400">$15,000 {t('steps.firstTransaction.setup')} • 90{t('steps.firstTransaction.success')}</p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: t('steps.monitorHeat.title'),
      content: (
        <div className="space-y-4">
          <p>{t('steps.monitorHeat.description')}</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card className="bg-game-background-dark p-3 sm:p-4 text-center">
              <div className="text-red-500 font-bold text-xs sm:text-sm">{t('steps.monitorHeat.legal')}</div>
              <div className="text-xl sm:text-2xl">{gameState.heat.legal.toFixed(1)}%</div>
            </Card>
            <Card className="bg-game-background-dark p-3 sm:p-4 text-center">
              <div className="text-yellow-500 font-bold text-xs sm:text-sm">{t('steps.monitorHeat.media')}</div>
              <div className="text-xl sm:text-2xl">{gameState.heat.media.toFixed(1)}%</div>
            </Card>
            <Card className="bg-game-background-dark p-3 sm:p-4 text-center">
              <div className="text-blue-500 font-bold text-xs sm:text-sm">{t('steps.monitorHeat.political')}</div>
              <div className="text-xl sm:text-2xl">{gameState.heat.political.toFixed(1)}%</div>
            </Card>
          </div>
          <p className="text-sm text-gray-400">{t('steps.monitorHeat.gameOverWarning')}</p>
        </div>
      ),
    },
    {
      title: t('steps.readyToPlay.title'),
      content: (
        <div className="space-y-4">
          <p>{t('steps.readyToPlay.description')}</p>
          {gameState.currentObjective && checkObjectiveCompletion(gameState.currentObjective, gameState) && (
            <div className="bg-green-500/10 border border-green-500 p-4 rounded-lg">
              <p className="text-sm font-bold text-green-400">
                {t('steps.readyToPlay.objectiveCompleted')}
              </p>
            </div>
          )}
          <div className="bg-primary-500/10 border border-primary-500 p-4 rounded-lg">
            <p className="text-sm">
              <strong>{t('steps.readyToPlay.remember')}</strong> {t('steps.readyToPlay.educationalNote')}
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/game/play');
    }
  };

  const handleSkip = () => {
    router.push('/game/play');
  };

  return (
    <div className="min-h-screen bg-game-background-darker text-white p-2 sm:p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
          <div className="flex gap-1.5 sm:gap-2 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 sm:h-2 w-6 sm:w-8 rounded ${
                  index <= currentStep ? 'bg-primary-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-game-background-dark p-4 sm:p-6 md:p-8 text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{steps[currentStep].title}</h2>
          <div className="min-h-[200px] sm:min-h-[300px] text-sm sm:text-base text-gray-300">{steps[currentStep].content}</div>

          <div className="flex justify-between gap-2 sm:gap-4 pt-6 sm:pt-8">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="border-gray-700 text-white hover:bg-gray-800 hover:text-white min-h-[44px] sm:min-h-0 text-xs sm:text-sm px-3 sm:px-4"
            >
              {t('skip')}
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary-500 hover:bg-primary-600 text-white min-h-[44px] sm:min-h-0 text-xs sm:text-sm px-4 sm:px-6 flex-1 sm:flex-initial"
            >
              {currentStep === steps.length - 1 ? t('start') : t('next')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
