'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/game/Dashboard';
import { CountrySelector } from '@/components/game/CountrySelector';
import { MechanismPanel } from '@/components/game/MechanismPanel';
import { Globe } from '@/components/game/Globe';
import { HeatMeter } from '@/components/game/HeatMeter';
import { EventNotifications } from '@/components/game/EventNotifications';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';
import { AdvisorHint } from '@/components/game/AdvisorHint';
import { CaseProgressTracker } from '@/components/game/CaseProgressTracker';
import { useGameStore } from '@/game/store';
import { formatCurrency } from '@/game/logic/validation';
import { checkObjectiveCompletion } from '@/game/logic/validation';
import { Button } from '@/components/ui/button';
import { getTutorialSteps } from '@/game/data/tutorialSteps';
import { AdvisorHint as AdvisorHintType } from '@/game/data/realCases';
import {useTranslations} from 'next-intl';

export default function PlayPage() {
  const t = useTranslations('Game.PlayPage');
  const router = useRouter();
  const totalFunds = useGameStore((state) => state.totalFunds);
  const launderedAmount = useGameStore((state) => state.launderedAmount);
  const cleanFunds = useGameStore((state) => state.cleanFunds);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const currentObjective = useGameStore((state) => state.currentObjective);
  const completeObjective = useGameStore((state) => state.completeObjective);
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const resetGame = useGameStore((state) => state.resetGame);
  const transactions = useGameStore((state) => state.transactions);
  const assets = useGameStore((state) => state.assets);
  const heat = useGameStore((state) => state.heat);
  const realCaseMode = useGameStore((state) => state.realCaseMode);
  const realCaseId = useGameStore((state) => state.realCaseId);
  const getCurrentRealCase = useGameStore((state) => state.getCurrentRealCase);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTutorialCompletion, setShowTutorialCompletion] = useState(false);
  const [currentAdvisorHint, setCurrentAdvisorHint] = useState<AdvisorHintType | null>(null);
  const [shownHints, setShownHints] = useState<Set<string>>(new Set());
  
  const isTutorialMode = gameStatus === 'tutorial';

  // Show tutorial overlay when in tutorial mode
  useEffect(() => {
    setShowTutorial(isTutorialMode);
  }, [isTutorialMode]);

  // Advisor hint trigger logic for real cases
  useEffect(() => {
    if (!realCaseMode || !realCaseId) return;

    const realCase = getCurrentRealCase();
    if (!realCase || !realCase.advisorHints) return;

    // Evaluate each hint trigger
    realCase.advisorHints.forEach((hint) => {
      const hintKey = `${realCaseId}-${hint.trigger}`;
      
      // Skip if already shown
      if (shownHints.has(hintKey)) return;

      let shouldShow = false;

      switch (hint.trigger) {
        case 'after_first_transaction':
          shouldShow = transactions.length >= 1;
          break;
        case 'when_heat_>30':
          shouldShow = heat.total >= 30;
          break;
        case 'when_heat_>50':
          shouldShow = heat.total >= 50;
          break;
        case 'after_luxury_purchase':
          shouldShow = assets.some((asset) => 
            asset.type === 'yacht' || 
            asset.type === 'mansion' || 
            asset.type === 'luxury_car' || 
            asset.type === 'art'
          );
          break;
        case 'when_clean_funds_>500M':
          shouldShow = cleanFunds >= 500000000;
          break;
        case 'when_clean_funds_>1B':
          shouldShow = cleanFunds >= 1000000000;
          break;
        case 'after_third_transaction':
          shouldShow = transactions.length >= 3;
          break;
        default:
          // Handle custom triggers (e.g., "when_heat_>X")
          const heatMatch = hint.trigger.match(/when_heat_>(\d+)/);
          if (heatMatch) {
            const threshold = parseInt(heatMatch[1], 10);
            shouldShow = heat.total >= threshold;
          }
          break;
      }

      if (shouldShow && !currentAdvisorHint) {
        setCurrentAdvisorHint(hint);
        setShownHints((prev) => {
          const newSet = new Set(prev);
          newSet.add(hintKey);
          return newSet;
        });
      }
    });
  }, [realCaseMode, realCaseId, transactions, assets, heat, cleanFunds, getCurrentRealCase, shownHints, currentAdvisorHint]);

  // Check objective completion
  useEffect(() => {
    if (currentObjective && !currentObjective.completed && gameStatus === 'playing') {
      const state = useGameStore.getState();
      if (checkObjectiveCompletion(currentObjective, state)) {
        completeObjective();
        setGameStatus('won');
      }
    }
  }, [currentObjective, gameStatus, completeObjective, setGameStatus, launderedAmount, totalFunds]);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setGameStatus('playing');
    // Mark tutorial as complete in store
    useGameStore.setState({ tutorialComplete: true });
    
    // Check if objective is also completed
    const state = useGameStore.getState();
    if (currentObjective && checkObjectiveCompletion(currentObjective, state)) {
      completeObjective();
      setShowTutorialCompletion(true);
    }
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
    setGameStatus('playing');
    useGameStore.setState({ tutorialComplete: true });
  };

  const handleGoToGameLobby = () => {
    router.push('/game');
  };

  const handleDismissAdvisorHint = () => {
    setCurrentAdvisorHint(null);
  };

  if (gameStatus === 'lost') {
    return (
      <div className="min-h-screen bg-game-background-darker text-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-5xl font-bold text-red-500">{t('gameOver.title')}</h1>
          <p className="text-xl">{t('gameOver.subtitle')}</p>
          <p className="text-gray-400">{t('gameOver.message')}</p>
          <Button onClick={resetGame} className="bg-primary-500 hover:bg-primary-600 text-white">
            {t('gameOver.restart')}
          </Button>
        </div>
      </div>
    );
  }

  // Show tutorial completion screen if tutorial and objective are both complete
  if (showTutorialCompletion || (gameStatus === 'won' && currentObjective?.id === 'tutorial-complete')) {
    return (
      <div className="min-h-screen bg-game-background-darker text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-5xl font-bold text-primary-500">{t('tutorialComplete.title')}</h1>
          <h2 className="text-2xl font-semibold text-white">{t('tutorialComplete.subtitle')}</h2>
          <p className="text-lg text-gray-300">
            {t('tutorialComplete.message')}
          </p>
          <div className="bg-game-background-dark rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-400">{t('tutorialComplete.progress')}</p>
            <p className="text-white">{t('tutorialComplete.laundered')} <span className="text-primary-500 font-bold">{formatCurrency(launderedAmount)}</span></p>
            {currentObjective && (
              <p className="text-white">
                {t('tutorialComplete.objective')} <span className="text-green-500 font-bold">{t('tutorialComplete.completed')}</span>
              </p>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {t('tutorialComplete.allRolesAvailable')}
          </p>
          <Button 
            onClick={handleGoToGameLobby} 
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 text-lg"
          >
            {t('tutorialComplete.backToLobby')}
          </Button>
        </div>
      </div>
    );
  }

  if (gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-game-background-darker text-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-5xl font-bold text-primary-500">{t('victory.title')}</h1>
          <p className="text-xl">{t('victory.subtitle')}</p>
          <p className="text-gray-400">{t('tutorialComplete.laundered')} {formatCurrency(launderedAmount)}</p>
          <p className="text-sm text-gray-500">{t('victory.note')}</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => setGameStatus('playing')} 
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {t('victory.continue')}
            </Button>
            <Button 
              onClick={resetGame} 
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 hover:text-white"
            >
              {t('victory.restart')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-background-darker text-white flex flex-col">
      {/* Header - Sticky on mobile */}
      <header className="bg-game-background-dark border-b border-gray-800 p-2 sm:p-4 sticky top-0 z-40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <div>
              <div className="text-xs sm:text-sm text-gray-400">{t('header.totalFunds')}</div>
              <div className="text-lg sm:text-2xl font-bold">{formatCurrency(totalFunds)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-400">{t('header.laundered')}</div>
              <div className="text-lg sm:text-2xl font-bold text-primary-500">
                {formatCurrency(launderedAmount)}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <HeatMeter />
          </div>
        </div>
      </header>

      {/* Main Game Area - Responsive Layout */}
      {/* Mobile: Vertical stack */}
      <div className="flex-1 flex flex-col lg:hidden gap-4 p-2 sm:p-4">
        {/* Controls Section */}
        <div className="space-y-3 sm:space-y-4">
          <CountrySelector />
          <MechanismPanel />
          {/* Case Progress Tracker - Only in real case mode */}
          {realCaseMode && <CaseProgressTracker />}
        </div>

        {/* Globe Section - Collapsible on mobile */}
        <div className="bg-game-background-dark rounded-lg min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
          <Globe />
        </div>

        {/* Dashboard Section */}
        <div>
          <Dashboard />
        </div>
      </div>

      {/* Tablet/Desktop: Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 flex-1">
        {/* Left Sidebar - Country & Mechanism Selection */}
        <aside className="lg:col-span-4 space-y-4">
          <CountrySelector />
          <MechanismPanel />
          {/* Case Progress Tracker - Only in real case mode */}
          {realCaseMode && <CaseProgressTracker />}
        </aside>

        {/* Center - Globe Visualization */}
        <main className="lg:col-span-4">
          <div className="bg-game-background-dark rounded-lg h-full min-h-[600px] flex items-center justify-center">
            <Globe />
          </div>
        </main>

        {/* Right Sidebar - Dashboard */}
        <aside className="lg:col-span-4">
          <Dashboard />
        </aside>
      </div>

      {/* Event Notifications */}
      <EventNotifications />

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay
          steps={getTutorialSteps()}
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}

      {/* Advisor Hint */}
      {currentAdvisorHint && (
        <AdvisorHint
          hint={currentAdvisorHint}
          onDismiss={handleDismissAdvisorHint}
        />
      )}
    </div>
  );
}
