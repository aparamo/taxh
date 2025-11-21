'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { mechanisms } from '@/game/data/mechanisms';
import { TransactionPanel } from './TransactionPanel';
import { useGameStore } from '@/game/store';
import { getFilteredMechanisms, getFilteredMechanismsForRealCase } from '@/game/data/filters';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Check } from 'lucide-react';
import { InfoButton } from './InfoButton';
import { getMechanismContent } from '@/game/data/educationalContent';
import {useTranslations} from 'next-intl';

// Helper component to display translated mechanism name
function MechanismNameDisplay({ mechanismId, fallbackName, className = "font-bold text-white" }: { mechanismId: string; fallbackName: string; className?: string }) {
  const t = useTranslations('GameData.Mechanisms');
  try {
    const name = t(`${mechanismId}.name` as never);
    return <h3 className={className}>{name}</h3>;
  } catch {
    return <h3 className={className}>{fallbackName}</h3>;
  }
}

// Helper component to display translated mechanism description
function MechanismDescriptionDisplay({ mechanismId, fallbackDescription, className = "text-sm text-gray-400 mb-3 line-clamp-2" }: { mechanismId: string; fallbackDescription: string; className?: string }) {
  const t = useTranslations('GameData.Mechanisms');
  try {
    const description = t(`${mechanismId}.description` as never);
    return <p className={className}>{description}</p>;
  } catch {
    return <p className={className}>{fallbackDescription}</p>;
  }
}

export function MechanismPanel() {
  const t = useTranslations('Game.MechanismPanel');
  const role = useGameStore((state) => state.role);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const realCaseMode = useGameStore((state) => state.realCaseMode);
  const realCaseId = useGameStore((state) => state.realCaseId);
  const [selectedMechanism, setSelectedMechanism] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isTutorial = gameStatus === 'tutorial';
  
  // CRITICAL: Apply real case filtering ONLY when realCaseMode === true
  let availableMechanisms;
  let coreMechanisms: string[] = [];
  if (realCaseMode && realCaseId) {
    const filtered = getFilteredMechanismsForRealCase(realCaseId);
    availableMechanisms = filtered.all;
    coreMechanisms = filtered.core.map(m => m.id);
  } else {
    availableMechanisms = getFilteredMechanisms(role || 'multimillionaire', isTutorial);
  }
  
  const selectedMechanismData = selectedMechanism
    ? availableMechanisms.find(m => m.id === selectedMechanism) || mechanisms.find(m => m.id === selectedMechanism)
    : null;

  const handleSelectMechanism = (mechanismId: string) => {
    setSelectedMechanism(mechanismId);
    setIsDialogOpen(false);
  };

  return (
    <Card className="bg-game-background-dark border-gray-800 p-4">
      <h2 className="text-xl font-bold mb-4 text-white">{t('title')}</h2>
      
      {/* Currently Selected Mechanism */}
      {selectedMechanismData ? (
        <div className="mb-4">
          <Card className="bg-game-background-darker border-primary-500 border-2 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MechanismNameDisplay mechanismId={selectedMechanismData.id} fallbackName={selectedMechanismData.name} />
              {(() => {
                const mechanismContent = getMechanismContent(selectedMechanismData.id);
                return mechanismContent ? (
                  <InfoButton content={mechanismContent} size="sm" />
                ) : null;
              })()}
            </div>
            <MechanismDescriptionDisplay mechanismId={selectedMechanismData.id} fallbackDescription={selectedMechanismData.description} />
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                {t('badges.setup')} ${selectedMechanismData.baseCost.toLocaleString()}
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                {Math.round(selectedMechanismData.successRateLow * 100)}{t('badges.success')}
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                {t('badges.heat')} +{selectedMechanismData.heatGeneration}%
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                {t('badges.capacity')} ${(selectedMechanismData.launderCapacity / 1000000).toFixed(0)}M/año
              </Badge>
            </div>
          </Card>
        </div>
      ) : (
        <div className="mb-4 text-sm text-gray-400 text-center py-4">
          {t('noMechanismSelected')}
        </div>
      )}

      {/* Open Dialog Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-primary-500 hover:bg-primary-600 text-white"
            data-tutorial-target="mechanism-selector-button"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            {selectedMechanismData ? t('change') : t('select')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-6xl max-h-[90vh] overflow-y-auto bg-game-background-darker border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">{t('dialog.title')}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {t('dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {availableMechanisms.map((mechanism, index) => {
              const isSelected = selectedMechanism === mechanism.id;

              return (
                <motion.div
                  key={mechanism.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className={`bg-game-background-dark p-4 cursor-pointer transition-all hover:border-primary-500 ${
                      isSelected ? 'border-primary-500 border-2' : 'border-gray-700'
                    }`}
                    onClick={() => handleSelectMechanism(mechanism.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MechanismNameDisplay mechanismId={mechanism.id} fallbackName={mechanism.name} className="font-bold text-white text-lg" />
                          {realCaseMode && coreMechanisms.includes(mechanism.id) && (
                            <Badge className="bg-primary-500 text-white text-xs">
                              {t('dialog.historicallyUsed')}
                            </Badge>
                          )}
                          {(() => {
                            const mechanismContent = getMechanismContent(mechanism.id);
                            return mechanismContent ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <InfoButton content={mechanismContent} size="sm" />
                              </div>
                            ) : null;
                          })()}
                          {isSelected && (
                            <Check className="w-5 h-5 text-primary-500" />
                          )}
                        </div>
                        <MechanismDescriptionDisplay mechanismId={mechanism.id} fallbackDescription={mechanism.description} className="text-sm text-gray-400 mb-3" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                            {t('badges.setup')} ${mechanism.baseCost.toLocaleString()}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                            {Math.round(mechanism.successRateLow * 100)}{t('badges.success')} (bajo escrutinio)
                          </Badge>
                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                            {t('badges.heat')} +{mechanism.heatGeneration}% por $1M
                          </Badge>
                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                            {t('badges.capacity')} ${(mechanism.launderCapacity / 1000000).toFixed(0)}M/año
                          </Badge>
                        </div>
                        
                        {mechanism.launderCapacity === 0 && (
                          <Badge variant="outline" className="text-xs text-orange-400 border-orange-600">
                            No lava directamente - mejora otros mecanismos
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Panel for Selected Mechanism */}
      <AnimatePresence>
        {selectedMechanism && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <TransactionPanel mechanismId={selectedMechanism} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
