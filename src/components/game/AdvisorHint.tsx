'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { X, Lightbulb, History } from 'lucide-react';
import { AdvisorHint as AdvisorHintType } from '@/game/data/realCases';

interface AdvisorHintProps {
  hint: AdvisorHintType;
  onDismiss: () => void;
}

export function AdvisorHint({ hint, onDismiss }: AdvisorHintProps) {
  const [showHistorical, setShowHistorical] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 z-50 max-w-md"
    >
      <Card className="bg-yellow-500/10 border-2 border-yellow-500/50 p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="bg-yellow-500/20 rounded-full p-2 flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-yellow-400 mb-1">Consejo del Asesor</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{hint.hint}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-6 w-6 text-gray-400 hover:text-white flex-shrink-0"
              >
                <X size={14} />
              </Button>
            </div>

            {/* Historical Context Toggle */}
            <div className="border-t border-yellow-500/30 pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistorical(!showHistorical)}
                className="w-full text-xs text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10"
              >
                <History size={12} className="mr-2" />
                {showHistorical ? 'Ocultar' : 'Ver'} contexto histórico
              </Button>
              
              <AnimatePresence>
                {showHistorical && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 bg-game-background-darker rounded p-3 border border-yellow-500/20">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        <strong className="text-yellow-400">Lo que realmente pasó:</strong>{' '}
                        {hint.historicalContext}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
