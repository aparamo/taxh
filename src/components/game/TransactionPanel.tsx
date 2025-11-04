'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/game/store';
import { getSelectedCountry } from './CountrySelector';
import { getMechanismById } from '@/game/data/mechanisms';
import { formatCurrency } from '@/game/logic/validation';
import { motion, AnimatePresence } from 'motion/react';
import { InfoButton } from './InfoButton';
import { getTransactionPatternContent } from '@/game/data/educationalContent';

interface TransactionPanelProps {
  mechanismId: string;
}

export function TransactionPanel({ mechanismId }: TransactionPanelProps) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastSuccessfulAmount, setLastSuccessfulAmount] = useState<number | null>(null);
  
  const executeTransaction = useGameStore((state) => state.executeTransaction);
  const totalFunds = useGameStore((state) => state.totalFunds);
  const mechanism = getMechanismById(mechanismId);

  const handleExecute = async () => {
    const selectedCountry = getSelectedCountry();
    
    if (!selectedCountry) {
      setMessage({ type: 'error', text: 'Por favor selecciona un país primero' });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setMessage({ type: 'error', text: 'Ingresa una cantidad válida' });
      return;
    }

    if (!mechanism) {
      setMessage({ type: 'error', text: 'Mecanismo no válido' });
      return;
    }

    if (amountNum > mechanism.launderCapacity) {
      setMessage({ 
        type: 'error', 
        text: `La cantidad excede la capacidad del mecanismo (${formatCurrency(mechanism.launderCapacity)})` 
      });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const result = executeTransaction(amountNum, mechanismId, selectedCountry);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setLastSuccessfulAmount(amountNum);
        setAmount(''); // Clear input on success
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error desconocido' 
      });
    } finally {
      setIsProcessing(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const selectedCountry = getSelectedCountry();
  const canAfford = mechanism ? totalFunds >= mechanism.fees.setup + (parseFloat(amount) || 0) * (1 + mechanism.fees.transaction) : false;

  return (
    <Card 
      className="bg-game-background-darker border-primary-500/30 p-4 text-white"
      data-tutorial-target="transaction-panel"
    >
      <h4 className="font-bold mb-3 text-white">Ejecutar Transacción</h4>
      <div className="space-y-3">
        {!selectedCountry && (
          <motion.p 
            className="text-sm text-yellow-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            ⚠️ Selecciona un país primero
          </motion.p>
        )}
        
        <div>
          <label className="text-sm text-gray-400 block mb-1">Cantidad (USD)</label>
          <motion.input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-game-background-dark border border-gray-700 rounded px-3 py-2 text-white"
            placeholder="1000000"
            disabled={isProcessing || !selectedCountry}
            whileFocus={{ borderColor: '#10b981', scale: 1.01 }}
          />
          {mechanism && (
            <p className="text-xs text-gray-500 mt-1">
              Capacidad máxima: {formatCurrency(mechanism.launderCapacity)}
            </p>
          )}
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded text-sm space-y-2 ${
                message.type === 'success' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              <div>{message.text}</div>
              {message.type === 'success' && lastSuccessfulAmount && (() => {
                const transactionContent = getTransactionPatternContent(lastSuccessfulAmount);
                if (transactionContent) {
                  return (
                    <div className="flex items-center gap-2 pt-2 border-t border-green-500/20">
                      <span className="text-xs text-green-300">
                        Similar a <strong>{transactionContent.realCase?.name}</strong> donde se movieron montos similares
                      </span>
                      <InfoButton content={transactionContent} size="sm" />
                    </div>
                  );
                }
                return null;
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleExecute}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white"
            disabled={!amount || !selectedCountry || isProcessing || !canAfford}
          >
            {isProcessing ? 'Procesando...' : 'Ejecutar'}
          </Button>
        </motion.div>

        {!canAfford && amount && (
          <motion.p 
            className="text-xs text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Fondos insuficientes
          </motion.p>
        )}
      </div>
    </Card>
  );
}
