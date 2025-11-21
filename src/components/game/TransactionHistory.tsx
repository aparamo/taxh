'use client';

import { useGameStore } from '@/game/store';
import { formatCurrency } from '@/game/logic/validation';
import { getMechanismById } from '@/game/data/mechanisms';
import { MechanismNameDisplay } from '@/game/utils/translations';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';

export function TransactionHistory() {
  const transactions = useGameStore((state) => state.transactions);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay transacciones aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {transactions.slice().reverse().map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-game-background-darker p-3 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-bold text-white">{formatCurrency(tx.amount)}</div>
                <div className="text-sm text-gray-400">
                  {new Date(tx.timestamp).toLocaleString('es-ES')}
                </div>
              </div>
              <Badge
                variant={tx.status === 'completed' ? 'default' : 'destructive'}
                className={tx.status === 'completed' ? 'bg-primary-500 text-white' : 'text-white'}
              >
                {tx.status === 'completed' ? 'Completada' : 'Fallida'}
              </Badge>
            </div>
            <div className="text-sm text-gray-400">
              {tx.destinationCountry} •{' '}
              <MechanismNameDisplay 
                mechanismId={tx.mechanism}
                fallbackName={getMechanismById(tx.mechanism)?.name || tx.mechanism}
                className="inline"
              />
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Comisiones: {formatCurrency(tx.fees)} • Heat: +{tx.heatGenerated.toFixed(1)}%
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
