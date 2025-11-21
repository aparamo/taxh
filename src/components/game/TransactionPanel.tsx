'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/game/store';
import { getSelectedCountry } from './CountrySelector';
import { getMechanismById } from '@/game/data/mechanisms';
import { getCountryById } from '@/game/data/countries';
import { formatCurrency } from '@/game/logic/validation';
import { calculateTransactionFees, calculateHeatGeneration, determineScrutinyLevel } from '@/game/logic/transactions';
import { motion, AnimatePresence } from 'motion/react';
import { InfoButton } from './InfoButton';
import { getTransactionPatternContent } from '@/game/data/educationalContent';
import { Badge } from '@/components/ui/badge';
import {useTranslations} from 'next-intl';
import { translateStoreMessage } from '@/game/utils/translateStoreMessage';

interface TransactionPanelProps {
  mechanismId: string;
}

export function TransactionPanel({ mechanismId }: TransactionPanelProps) {
  const t = useTranslations('Game.TransactionPanel');
  const tStore = useTranslations('Game.Store.messages');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastSuccessfulAmount, setLastSuccessfulAmount] = useState<number | null>(null);
  
  const executeTransaction = useGameStore((state) => state.executeTransaction);
  const activateEnhancement = useGameStore((state) => state.activateEnhancement);
  const totalFunds = useGameStore((state) => state.totalFunds);
  const heat = useGameStore((state) => state.heat);
  const role = useGameStore((state) => state.role);
  const activeEnhancements = useGameStore((state) => state.activeEnhancements);
  const mechanism = getMechanismById(mechanismId);
  
  // Calculate estimated costs and heat before transaction
  const estimatedCosts = useMemo(() => {
    const selectedCountry = getSelectedCountry();
    if (!mechanism || !selectedCountry || !amount) return null;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return null;
    
    const fees = calculateTransactionFees(amountNum, mechanism);
    const totalCost = amountNum + fees;
    const country = getCountryById(selectedCountry);
    if (!country) return null;
    
    const activeEnhancements = useGameStore.getState().activeEnhancements;
    const scrutinyLevel = determineScrutinyLevel(heat.total, country.riskLevel);
    const estimatedHeat = calculateHeatGeneration(amountNum, mechanism, country, scrutinyLevel, role, activeEnhancements);
    
    return {
      amount: amountNum,
      fees,
      totalCost,
      estimatedHeat,
      scrutinyLevel,
      country,
    };
  }, [amount, mechanism, heat.total, role]);

  const handleExecute = async () => {
    const selectedCountry = getSelectedCountry();
    
    if (!selectedCountry) {
      setMessage({ type: 'error', text: t('errors.selectCountryFirst') });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setMessage({ type: 'error', text: t('errors.invalidAmount') });
      return;
    }

    if (!mechanism) {
      setMessage({ type: 'error', text: t('errors.invalidMechanism') });
      return;
    }

    if (mechanism.launderCapacity === 0) {
      // Get mechanism name for error message
      const mechanismName = mechanism.name; // Will be translated in display
      setMessage({ 
        type: 'error', 
        text: t('enhancement.cannotProcess', { name: mechanismName })
      });
      return;
    }

    if (amountNum > mechanism.launderCapacity) {
      setMessage({ 
        type: 'error', 
        text: t('errors.exceedsCapacity', { capacity: formatCurrency(mechanism.launderCapacity) })
      });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const result = executeTransaction(amountNum, mechanismId, selectedCountry);
      
      if (result.success) {
        setMessage({ type: 'success', text: translateStoreMessage(tStore, result.message) });
        setLastSuccessfulAmount(amountNum);
        setAmount(''); // Clear input on success
      } else {
        setMessage({ type: 'error', text: translateStoreMessage(tStore, result.message) });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : t('errors.unknownError')
      });
    } finally {
      setIsProcessing(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const selectedCountry = getSelectedCountry();
  const canAfford = mechanism ? totalFunds >= mechanism.fees.setup + (parseFloat(amount) || 0) * (1 + mechanism.fees.transaction) : false;
  
  // Check if mechanism can launder (has capacity > 0)
  const canLaunder = mechanism && mechanism.launderCapacity > 0;

  return (
    <Card 
      className="bg-game-background-darker border-primary-500/30 p-4 text-white"
      data-tutorial-target="transaction-panel"
    >
      <h4 className="font-bold mb-3 text-white">
        {canLaunder ? t('executeTransaction') : t('activateMechanism')}
      </h4>
      <div className="space-y-3">
        {!canLaunder && mechanism && (
          <>
            {activeEnhancements.includes(mechanismId) ? (
              <motion.div 
                className="p-3 rounded bg-green-500/20 border border-green-500/50 text-sm text-green-300"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-semibold mb-1">✓ {t('enhancement.active', { name: mechanism.name })}</p>
                <p className="text-xs text-green-200/80">
                  {t('enhancement.activeDescription')}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                className="p-3 rounded bg-blue-500/20 border border-blue-500/50 text-sm text-blue-300"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-semibold mb-2">{t('enhancement.supportMechanism')}</p>
                <p className="text-xs text-blue-200/80 mb-3">
                  {t('enhancement.supportDescription', { name: mechanism.name })}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-300">{t('enhancement.activationCost')}</span>
                    <span className="text-white font-semibold">{formatCurrency(mechanism.fees.setup)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">{t('enhancement.heatGenerated')}</span>
                    <span className="text-yellow-300">+{mechanism.heatGeneration.toFixed(1)}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
        {!selectedCountry && (
          <motion.p 
            className="text-sm text-yellow-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            ⚠️ {t('enhancement.warning')}
          </motion.p>
        )}
        
        {canLaunder && (
          <div>
            <label className="text-sm text-gray-400 block mb-1">{t('amount')}</label>
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
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">
                {t('maxCapacity')} {formatCurrency(mechanism.launderCapacity)}
              </p>
              {/* Quick amount suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {[0.25, 0.5, 0.75, 1.0].map((multiplier) => {
                  const suggestedAmount = Math.floor(mechanism.launderCapacity * multiplier);
                  return (
                    <button
                      key={multiplier}
                      type="button"
                      onClick={() => setAmount(suggestedAmount.toString())}
                      className="text-xs px-2 py-1 bg-game-background-dark border border-gray-700 rounded hover:border-primary-500/50 hover:bg-primary-500/10 transition-colors text-gray-300"
                    >
                      {t(`quickAmounts.${(multiplier * 100).toString()}` as never)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        )}
        
        {/* Cost Breakdown */}
        {estimatedCosts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-game-background-dark rounded p-3 space-y-2 border border-gray-700"
          >
            <div className="text-xs font-semibold text-gray-400 mb-2">{t('costBreakdown.title')}</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('costBreakdown.amount')}</span>
                <span className="text-white">{formatCurrency(estimatedCosts.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('costBreakdown.fees')}</span>
                <span className="text-yellow-400">
                  {formatCurrency(estimatedCosts.fees - mechanism!.fees.setup)}
                </span>
              </div>
              {estimatedCosts.fees > mechanism!.fees.setup && (
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('costBreakdown.fees')}</span>
                  <span className="text-yellow-400">{formatCurrency(mechanism!.fees.setup)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
                <span className="text-white font-semibold">{t('costBreakdown.total')}</span>
                <span className="text-white font-bold">{formatCurrency(estimatedCosts.totalCost)}</span>
              </div>
            </div>
            
            {/* Estimated Heat */}
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="text-xs font-semibold text-gray-400 mb-2">{t('costBreakdown.estimatedHeat')}</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('costBreakdown.legal')}</span>
                  <Badge variant="outline" className="text-xs">
                    +{estimatedCosts.estimatedHeat.legal.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('costBreakdown.media')}</span>
                  <Badge variant="outline" className="text-xs">
                    +{estimatedCosts.estimatedHeat.media.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('costBreakdown.political')}</span>
                  <Badge variant="outline" className="text-xs">
                    +{estimatedCosts.estimatedHeat.political.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
                  <span className="text-white font-semibold">{t('costBreakdown.totalHeat')}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-bold ${
                      estimatedCosts.estimatedHeat.total > 10 
                        ? 'border-red-500 text-red-400' 
                        : estimatedCosts.estimatedHeat.total > 5
                        ? 'border-yellow-500 text-yellow-400'
                        : 'border-green-500 text-green-400'
                    }`}
                  >
                    +{estimatedCosts.estimatedHeat.total.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-400">{t('costBreakdown.level')}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      estimatedCosts.scrutinyLevel === 'high' 
                        ? 'border-red-500 text-red-400' 
                        : 'border-green-500 text-green-400'
                    }`}
                  >
                    {estimatedCosts.scrutinyLevel === 'high' ? t('costBreakdown.high') : t('costBreakdown.low')}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Success probability estimate */}
            {mechanism && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs font-semibold text-gray-400 mb-1">{t('costBreakdown.successProbability')}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-game-background-darker rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${
                        (estimatedCosts.scrutinyLevel === 'high' 
                          ? mechanism.successRateHigh 
                          : mechanism.successRateLow) > 0.7
                          ? 'bg-green-500'
                          : (estimatedCosts.scrutinyLevel === 'high' 
                            ? mechanism.successRateHigh 
                            : mechanism.successRateLow) > 0.5
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${(estimatedCosts.scrutinyLevel === 'high' 
                          ? mechanism.successRateHigh 
                          : mechanism.successRateLow) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-xs text-white font-semibold">
                    {Math.round((estimatedCosts.scrutinyLevel === 'high' 
                      ? mechanism.successRateHigh 
                      : mechanism.successRateLow) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

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

        {!canLaunder && mechanism && !activeEnhancements.includes(mechanismId) && (
          <>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={async () => {
                  const selectedCountry = getSelectedCountry();
                  if (!selectedCountry) {
                    setMessage({ type: 'error', text: t('errors.selectCountryFirst') });
                    return;
                  }

                  setIsProcessing(true);
                  setMessage(null);

                  try {
                    const result = activateEnhancement(mechanismId, selectedCountry);
                    if (result.success) {
        setMessage({ type: 'success', text: translateStoreMessage(tStore, result.message) });
      } else {
        setMessage({ type: 'error', text: translateStoreMessage(tStore, result.message) });
      }
                  } catch (error) {
                    setMessage({ 
                      type: 'error', 
                      text: error instanceof Error ? error.message : 'Error desconocido' 
                    });
                  } finally {
                    setIsProcessing(false);
                    setTimeout(() => setMessage(null), 5000);
                  }
                }}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white min-h-[44px]"
                disabled={!selectedCountry || isProcessing || (mechanism && totalFunds < mechanism.fees.setup)}
              >
                {isProcessing ? t('processing') : t('activate') + ` por ${formatCurrency(mechanism?.fees.setup || 0)}`}
              </Button>
            </motion.div>

            {mechanism && totalFunds < mechanism.fees.setup && (
              <motion.p 
                className="text-xs text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {t('insufficientFunds')}
              </motion.p>
            )}
          </>
        )}

        {canLaunder && (
          <>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleExecute}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white min-h-[44px]"
                disabled={!amount || !selectedCountry || isProcessing || !canAfford}
              >
                {isProcessing ? t('processing') : t('execute')}
              </Button>
            </motion.div>

            {!canAfford && amount && (
              <motion.p 
                className="text-xs text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {t('insufficientFunds')}
              </motion.p>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
