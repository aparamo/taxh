'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/game/store';
import { multimillionaireScenario } from '@/game/data/scenarios';
import { checkObjectiveCompletion } from '@/game/logic/validation';

export default function TutorialPage() {
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
      title: 'Bienvenido',
      content: (
        <div className="space-y-4">
          <p className="text-lg">{multimillionaireScenario.description}</p>
          <div className="bg-game-background-darker p-4 rounded-lg">
            <h3 className="font-bold mb-2">Tu Objetivo:</h3>
            <p>{multimillionaireScenario.tutorialObjective.description}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Seleccionar País',
      content: (
        <div className="space-y-4">
          <p>Elige un país paraíso fiscal donde establecer tus estructuras. Cada país tiene diferentes niveles de secreto y riesgo.</p>
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-game-background-dark p-4">
              <div className="text-2xl mb-2">🇻🇬</div>
              <h3 className="font-bold">BVI</h3>
              <p className="text-sm text-gray-400">Alto secreto</p>
            </Card>
            <Card className="bg-game-background-dark p-4">
              <div className="text-2xl mb-2">🇵🇦</div>
              <h3 className="font-bold">Panamá</h3>
              <p className="text-sm text-gray-400">Alto riesgo</p>
            </Card>
            <Card className="bg-game-background-dark p-4">
              <div className="text-2xl mb-2">🇨🇭</div>
              <h3 className="font-bold">Suiza</h3>
              <p className="text-sm text-gray-400">Banca privada</p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: 'Tu Primera Transacción',
      content: (
        <div className="space-y-4">
          <p>Usa mecanismos para lavar dinero. Cada mecanismo tiene diferentes costos, capacidades y riesgos.</p>
          <div className="space-y-2">
            <Card className="bg-game-background-dark p-4">
              <h3 className="font-bold">Sociedad Fantasma</h3>
              <p className="text-sm text-gray-400">$5,000 setup • 85% éxito</p>
            </Card>
            <Card className="bg-game-background-dark p-4">
              <h3 className="font-bold">Fideicomiso</h3>
              <p className="text-sm text-gray-400">$15,000 setup • 90% éxito</p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: 'Monitorear el Heat',
      content: (
        <div className="space-y-4">
          <p>El &quot;Heat&quot; (riesgo) aumenta con cada transacción. Vigila los niveles de:</p>
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-game-background-dark p-4 text-center">
              <div className="text-red-500 font-bold">Legal</div>
              <div className="text-2xl">{gameState.heat.legal.toFixed(1)}%</div>
            </Card>
            <Card className="bg-game-background-dark p-4 text-center">
              <div className="text-yellow-500 font-bold">Media</div>
              <div className="text-2xl">{gameState.heat.media.toFixed(1)}%</div>
            </Card>
            <Card className="bg-game-background-dark p-4 text-center">
              <div className="text-blue-500 font-bold">Político</div>
              <div className="text-2xl">{gameState.heat.political.toFixed(1)}%</div>
            </Card>
          </div>
          <p className="text-sm text-gray-400">Si el heat total alcanza 100%, pierdes.</p>
        </div>
      ),
    },
    {
      title: '¡Listo para Jugar!',
      content: (
        <div className="space-y-4">
          <p>Ya conoces lo básico. Completa el tutorial y luego podrás jugar libremente.</p>
          {gameState.currentObjective && checkObjectiveCompletion(gameState.currentObjective, gameState) && (
            <div className="bg-green-500/10 border border-green-500 p-4 rounded-lg">
              <p className="text-sm font-bold text-green-400">
                ¡Objetivo completado! Puedes continuar jugando en modo libre.
              </p>
            </div>
          )}
          <div className="bg-primary-500/10 border border-primary-500 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Recuerda:</strong> Este es un juego educativo. Todo está basado en casos reales de investigaciones periodísticas.
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
    <div className="min-h-screen bg-game-background-darker text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Tutorial</h1>
          <div className="flex gap-2 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded ${
                  index <= currentStep ? 'bg-primary-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-game-background-dark p-6 md:p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-white">{steps[currentStep].title}</h2>
          <div className="min-h-[300px] text-gray-300">{steps[currentStep].content}</div>

          <div className="flex justify-between pt-8">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="border-gray-700 text-white hover:bg-gray-800 hover:text-white"
            >
              Saltar Tutorial
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {currentStep === steps.length - 1 ? 'Comenzar' : 'Siguiente'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
