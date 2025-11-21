'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllRealCases } from '@/game/data/realCases';
import { useGameStore } from '@/game/store';
import { formatCurrency } from '@/game/logic/validation';
import { AlertTriangle } from 'lucide-react';
import {useTranslations} from 'next-intl';
import { RealCaseNameDisplay, RealCaseSummaryDisplay } from '@/game/utils/translations';

interface RealCaseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RealCaseSelector({ isOpen, onClose }: RealCaseSelectorProps) {
  const t = useTranslations('Game.RealCaseSelector');
  const router = useRouter();
  const loadRealCase = useGameStore((state) => state.loadRealCase);
  const realCases = getAllRealCases();

  const handlePlayCase = (caseId: string) => {
    loadRealCase(caseId);
    onClose();
    router.push('/game/play');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'multimillionaire':
        return 'border-primary-500 text-gray-400';
      case 'cartel':
        return 'border-red-500 text-red-400';
      case 'multinational':
        return 'border-blue-500 text-blue-400';
      default:
        return 'border-gray-500 text-gray-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'multimillionaire':
        return t('roleLabels.multimillionaire');
      case 'cartel':
        return t('roleLabels.cartel');
      case 'multinational':
        return t('roleLabels.multinational');
      default:
        return role;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-game-background-darker border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">{t('title')}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-6">
          {realCases.map((case_, index) => (
            <motion.div
              key={case_.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={`bg-game-background-dark border-2 ${getRoleColor(case_.role)} p-6 space-y-4`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <RealCaseNameDisplay caseId={case_.id} fallbackName={case_.name} className="text-xl font-bold text-white" />
                      <Badge variant="outline" className={`${getRoleColor(case_.role)} bg-transparent`}>
                        {getRoleLabel(case_.role)}
                      </Badge>
                    </div>
                    <p className="text-lg font-semibold text-gray-300">{case_.protagonist}</p>
                    <RealCaseSummaryDisplay caseId={case_.id} fallbackSummary={case_.summary} className="text-sm text-gray-400" />
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div>
                        <p className="text-xs text-gray-400">{t('period')}</p>
                        <p className="text-sm font-semibold text-white">{case_.period}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{t('totalAmount')}</p>
                        <p className="text-sm font-semibold text-white">
                          {formatCurrency(case_.totalAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{t('result')}</p>
                        <p className="text-sm font-semibold text-red-400">
                          {case_.finalOutcome.caught ? t('caught') : t('legalControversial')}
                        </p>
                      </div>
                    </div>

                    {/* Warning about outcome */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded p-3 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-red-300">
                        <strong>{t('warning')}</strong>{' '}
                        {case_.finalOutcome.caught
                          ? t('warningCaught', {
                              amount: formatCurrency(case_.finalOutcome.amountLost),
                              consequences: case_.finalOutcome.consequences
                            })
                          : t('warningControversial', {
                              consequences: case_.finalOutcome.consequences
                            })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => handlePlayCase(case_.id)}
                    className={`${
                      case_.role === 'multimillionaire'
                        ? 'bg-primary-500 hover:bg-primary-600'
                        : case_.role === 'cartel'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    {t('playCase')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {realCases.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>{t('noCasesAvailable')}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
