'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/game/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Clock, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { getRealCaseById } from '@/game/data/realCases';
import { formatCurrency } from '@/game/logic/validation';
import { getCountryById } from '@/game/data/countries';
import { getMechanismById } from '@/game/data/mechanisms';
import { motion, AnimatePresence } from 'motion/react';
import {useTranslations} from 'next-intl';
import { RealCaseNameDisplay, CountryNameDisplay, MechanismNameDisplay } from '@/game/utils/translations';

export function CaseProgressTracker() {
  const t = useTranslations('Game.CaseProgressTracker');
  const realCaseId = useGameStore((state) => state.realCaseId);
  const transactions = useGameStore((state) => state.transactions);
  const assets = useGameStore((state) => state.assets);
  // For real cases, always start expanded, otherwise use localStorage
  const [isExpanded, setIsExpanded] = useState(realCaseId ? true : false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const trackerRef = useRef<HTMLDivElement>(null);
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // For real cases, always start expanded
  useEffect(() => {
    if (realCaseId) {
      setIsExpanded(true);
    }
  }, [realCaseId]);

  // Calculate default position (bottom-left)
  const getDefaultPosition = useCallback((expanded: boolean = isExpanded): { x: number; y: number } => {
    if (typeof window === 'undefined') return { x: 16, y: 16 };
    
    if (isMobile) {
      // Mobile: bottom left, above tutorial if present
      return { 
        x: 16, 
        y: window.innerHeight - (expanded ? 400 : 80) - 16 
      };
    } else {
      // Desktop: bottom-left
      return { 
        x: 16, 
        y: window.innerHeight - (expanded ? 500 : 80) - 16 
      };
    }
  }, [isMobile, isExpanded]);
  
  // Update position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (position && typeof window !== 'undefined') {
        // Validate position is still on screen after resize
        const trackerWidth = isMobile ? window.innerWidth - 32 : 400;
        const trackerHeight = isExpanded ? (isMobile ? 400 : 500) : 80;
        const maxX = window.innerWidth - trackerWidth - 16;
        const maxY = window.innerHeight - trackerHeight - 16;
        
        const newX = Math.max(16, Math.min(position.x, maxX));
        const newY = Math.max(16, Math.min(position.y, maxY));
        
        if (newX !== position.x || newY !== position.y) {
          const newPosition = { x: newX, y: newY };
          setPosition(newPosition);
          savePosition(newX, newY);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, isMobile, isExpanded]);

  // Load saved position from localStorage (hooks must be called before early returns)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosition = localStorage.getItem('case-progress-tracker-position');
      if (savedPosition) {
        try {
          const { x, y } = JSON.parse(savedPosition);
          // Validate saved position is still on screen
          if (x >= 0 && y >= 0 && x < window.innerWidth && y < window.innerHeight) {
            setPosition({ x, y });
          } else {
            // Invalid position, use default
            setPosition(getDefaultPosition());
          }
        } catch {
          // Invalid saved position, use default
          setPosition(getDefaultPosition());
        }
      } else {
        // No saved position, use default
        setPosition(getDefaultPosition());
      }
      
      // Only load saved state if not in a real case (real cases should always start open)
      if (!realCaseId) {
        const savedExpanded = localStorage.getItem('case-progress-tracker-expanded');
        if (savedExpanded !== null) {
          setIsExpanded(savedExpanded === 'true');
        }
      }
    }
  }, [realCaseId, isMobile, getDefaultPosition]);
  
  // Update position when expanded state changes (to account for height change)
  useEffect(() => {
    if (position && typeof window !== 'undefined') {
      // If current position would put it off-screen, adjust
      const trackerHeight = isExpanded ? (isMobile ? 400 : 500) : 80;
      const maxY = window.innerHeight - trackerHeight - 16;
      
      if (position.y > maxY) {
        const newPosition = { ...position, y: Math.max(16, maxY) };
        setPosition(newPosition);
        savePosition(newPosition.x, newPosition.y);
      }
    }
  }, [isExpanded, isMobile, position]);

  // Save position to localStorage
  const savePosition = (x: number, y: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('case-progress-tracker-position', JSON.stringify({ x, y }));
    }
  };

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[data-no-drag]')) {
      return;
    }

    if (trackerRef.current && position) {
      const rect = trackerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      setIsDragging(true);
      setDragStart({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      
      // Prevent default for touch to avoid scrolling
      if ('touches' in e) {
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && trackerRef.current && position) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        const trackerWidth = trackerRef.current.offsetWidth || (isMobile ? window.innerWidth - 32 : 400);
        const trackerHeight = trackerRef.current.offsetHeight || (isExpanded ? (isMobile ? 400 : 500) : 80);
        const maxX = typeof window !== 'undefined' ? window.innerWidth - trackerWidth - 16 : 0;
        const maxY = typeof window !== 'undefined' ? window.innerHeight - trackerHeight - 16 : 0;
        
        const constrainedX = Math.max(16, Math.min(newX, maxX));
        const constrainedY = Math.max(16, Math.min(newY, maxY));
        
        const newPosition = { x: constrainedX, y: constrainedY };
        setPosition(newPosition);
        savePosition(constrainedX, constrainedY);
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && trackerRef.current && position && e.touches.length > 0) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;
        
        const trackerWidth = trackerRef.current.offsetWidth || (isMobile ? window.innerWidth - 32 : 400);
        const trackerHeight = trackerRef.current.offsetHeight || (isExpanded ? (isMobile ? 400 : 500) : 80);
        const maxX = typeof window !== 'undefined' ? window.innerWidth - trackerWidth - 16 : 0;
        const maxY = typeof window !== 'undefined' ? window.innerHeight - trackerHeight - 16 : 0;
        
        const constrainedX = Math.max(16, Math.min(newX, maxX));
        const constrainedY = Math.max(16, Math.min(newY, maxY));
        
        const newPosition = { x: constrainedX, y: constrainedY };
        setPosition(newPosition);
        savePosition(constrainedX, constrainedY);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position, isMobile, isExpanded]);

  const toggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (typeof window !== 'undefined') {
      localStorage.setItem('case-progress-tracker-expanded', String(newExpanded));
    }
  };

  // Early returns after all hooks
  if (!realCaseId) {
    return null;
  }

  const realCase = getRealCaseById(realCaseId);
  if (!realCase) {
    return null;
  }

  // Calculate progress by matching player actions to historical steps
  const totalSteps = realCase.historicalSteps.length;
  
  // Match transactions and asset purchases to historical steps
  let completedSteps = 0;
  const stepMatches: boolean[] = [];
  
  realCase.historicalSteps.forEach((step, index) => {
    let matched = false;
    
    // Check if we have transactions that match this step's pattern
    if (index < transactions.length) {
      const tx = transactions[index];
      // Check if transaction country or mechanism matches
      if (tx.destinationCountry === step.country || tx.mechanism === step.mechanism) {
        matched = true;
      } else if (transactions.length > index) {
        // If we have more transactions than this step, consider it potentially matched
        matched = true;
      }
    }
    
    // For asset purchase steps, check if we have matching assets
    if (step.action.toLowerCase().includes('compra') || step.action.toLowerCase().includes('yate') || 
        step.action.toLowerCase().includes('propiedad') || step.action.toLowerCase().includes('arte')) {
      if (assets.length > index) {
        matched = true;
      }
    }
    
    stepMatches.push(matched);
    if (matched) {
      completedSteps++;
    }
  });
  
  // Fallback: if we have transactions but haven't matched steps, use transaction count
  if (transactions.length > 0 && completedSteps === 0) {
    completedSteps = Math.min(transactions.length, totalSteps);
  }
  
  const progressPercentage = Math.min((completedSteps / totalSteps) * 100, 100);

  // Determine which historical step we're on
  const currentStepIndex = Math.min(completedSteps, totalSteps - 1);
  const currentStep = realCase.historicalSteps[currentStepIndex];

  // Don't render until position is calculated
  if (position === null) {
    return null;
  }

  return (
    <motion.div
      ref={trackerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMobile ? 'calc(100vw - 32px)' : 'min(400px, calc(100vw - 32px))',
        maxWidth: isMobile ? 'none' : '400px',
        zIndex: isDragging ? 60 : 50,
      }}
      data-case-progress-tracker="true"
      data-expanded={isExpanded ? 'true' : 'false'}
    >
      <Card className="bg-game-background-dark border-yellow-500/50 border-2 shadow-2xl w-full">
        {/* Header - draggable area */}
        <div 
          className="flex items-center justify-between p-3 border-b border-yellow-500/30 cursor-grab"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <GripVertical className="w-4 h-4 text-yellow-400/50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm mb-1">{t('title')}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-yellow-400 border-yellow-500/50 text-xs">
                  <RealCaseNameDisplay caseId={realCaseId} fallbackName={realCase.name} className="text-xs" />
                </Badge>
                <p className="text-xs text-gray-400 truncate">{realCase.protagonist} • {realCase.period}</p>
              </div>
            </div>
          </div>
          <button
            onClick={toggleExpand}
            className="ml-4 p-2 hover:bg-yellow-500/20 rounded transition-colors border border-yellow-500/30 hover:border-yellow-500/50 flex-shrink-0"
            data-no-drag
            aria-label={isExpanded ? t('collapseMenu') : t('expandMenu')}
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-yellow-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-yellow-400" />
            )}
          </button>
        </div>

        {/* Content - collapsible */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto" data-no-drag>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{t('historicalProgress')}</span>
                    <span className="text-white">{completedSteps}/{totalSteps} {t('steps')}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Current Step Indicator */}
                {currentStep && (
                  <div className="bg-game-background-darker rounded p-3 border border-yellow-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-400">{t('currentStep')}</span>
                    </div>
                    <p className="text-xs text-white font-semibold mb-1">{currentStep.action}</p>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>{t('year')} <strong className="text-white">{currentStep.year}</strong></div>
                      <div>{t('historicalAmount')} <strong className="text-primary-400">{formatCurrency(currentStep.amount)}</strong></div>
                      <div>{t('country')} <strong className="text-white">{currentStep.country}</strong></div>
                    </div>
                  </div>
                )}

                {/* Historical Steps Timeline */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase">{t('historicalSteps')}</h4>
                  {realCase.historicalSteps.map((step, index) => {
                    const isCompleted = stepMatches[index] || index < completedSteps;
                    const isCurrent = index === currentStepIndex && !isCompleted;
                    
                    return (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`p-2 rounded border ${
                          isCurrent
                            ? 'bg-yellow-500/10 border-yellow-500/50'
                            : isCompleted
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-game-background-darker border-gray-700 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {isCompleted ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-white">{step.year}</span>
                              {isCurrent && (
                                <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-500/50">
                                  {t('current')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-300 mb-1">{step.action}</p>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(step.amount)} • {step.country}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Final Outcome Warning */}
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-red-300">
                      <strong>{t('historicalResult')}</strong> {realCase.finalOutcome.caught ? t('caught') : t('controversial')}
                      <br />
                      <span className="text-red-400/80">{realCase.finalOutcome.consequences}</span>
                    </div>
                  </div>
                </div>

                {/* What to Do Guide */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mt-4">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0">💡</div>
                    <h4 className="text-sm font-semibold text-blue-400">{t('whatToDo')}</h4>
                  </div>
                  <div className="text-xs text-blue-200 space-y-2">
                    {currentStep && (
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-300">{t('currentStepLabel')}</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>
                            <strong>{t('selectCountry')}</strong>{' '}
                            <CountryNameDisplay 
                              countryId={currentStep.country} 
                              fallbackName={getCountryById(currentStep.country)?.name || currentStep.country}
                              className="inline"
                            />
                            {realCase.coreCountries.includes(currentStep.country) && (
                              <span className="text-blue-400 ml-1">{t('historicalCountry')}</span>
                            )}
                          </li>
                          <li>
                            <strong>{t('selectMechanism')}</strong>{' '}
                            <MechanismNameDisplay 
                              mechanismId={currentStep.mechanism}
                              fallbackName={getMechanismById(currentStep.mechanism)?.name || currentStep.mechanism}
                              className="inline"
                            />
                            {realCase.coreMechanisms.includes(currentStep.mechanism) && (
                              <span className="text-blue-400 ml-1">{t('historicallyUsed')}</span>
                            )}
                            {(() => {
                              const country = getCountryById(currentStep.country);
                              const isAvailable = country?.availableMechanisms.includes(currentStep.mechanism);
                              return !isAvailable ? (
                                <span className="text-red-400 ml-1 text-xs">{t('notAvailable')}</span>
                              ) : null;
                            })()}
                          </li>
                          <li>
                            <strong>{t('executeTransaction')}</strong> {t('trySimilarAmount', {amount: formatCurrency(currentStep.amount)})}
                            {currentStep.amount === 0 && (
                              <span className="text-gray-400 ml-1 text-xs">{t('event')}</span>
                            )}
                          </li>
                        </ol>
                        <p className="text-blue-300/80 mt-2 italic">
                          {t('tip')}
                        </p>
                        {(() => {
                          const country = getCountryById(currentStep.country);
                          const isAvailable = country?.availableMechanisms.includes(currentStep.mechanism);
                          if (!isAvailable && country) {
                            const availableMechanisms = country.availableMechanisms
                              .map(id => getMechanismById(id)?.name || id)
                              .join(', ');
                            return (
                              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 mt-2">
                                <p className="text-xs text-yellow-300">
                                  <strong>{t('alternative')}</strong> {t('alternativeDescription', {
                                    mechanism: getMechanismById(currentStep.mechanism)?.name || currentStep.mechanism,
                                    country: country.name,
                                    available: availableMechanisms || t('none')
                                  })}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                    {!currentStep && (
                      <div>
                        <p className="text-blue-300/80">
                          {t('followSteps')}
                        </p>
                      </div>
                    )}
                    {realCase.advisorHints.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-500/20">
                        <p className="font-semibold text-blue-300 mb-2">{t('advisorHints')}</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {realCase.advisorHints.slice(0, 2).map((hint, index) => (
                            <li key={index} className="text-blue-200/90">
                              {hint.hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
