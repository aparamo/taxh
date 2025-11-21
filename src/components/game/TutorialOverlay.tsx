'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import {useTranslations} from 'next-intl';


export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  action?: () => void; // Action to execute when step is completed
  checkComplete?: () => boolean; // Function to check if step is complete
  waitForAction?: boolean; // If true, wait for user action before advancing
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export function TutorialOverlay({ steps, onComplete, onSkip }: TutorialOverlayProps) {
  const t = useTranslations('Game.TutorialOverlay');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightBox, setHighlightBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [canAdvance, setCanAdvance] = useState(false);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoAdvancedRef = useRef(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  // Update highlight position when target changes
  useEffect(() => {
    if (!currentStep?.target) {
      setHighlightBox(null);
      return;
    }

    const updateHighlight = () => {
      const element = document.querySelector(currentStep.target!);
      if (element) {
        const rect = element.getBoundingClientRect();
        // getBoundingClientRect() already accounts for scroll, and we use fixed positioning
        // so coordinates should be relative to viewport
        if (rect.width > 0 && rect.height > 0) {
        setHighlightBox({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
        } else {
          setHighlightBox(null);
        }
      } else {
        setHighlightBox(null);
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight, true);

    // Reset auto-advance flag when step changes
    hasAutoAdvancedRef.current = false;

    // Check if step is complete
    if (currentStep.waitForAction) {
      // PERFORMANCE: Use requestAnimationFrame for smoother checking
      let rafId: number;
      const checkCompletion = () => {
        if (currentStep.checkComplete?.() && !hasAutoAdvancedRef.current) {
          setCanAdvance(true);
          hasAutoAdvancedRef.current = true;
          
          // Clear any existing timeout
          if (autoAdvanceTimeoutRef.current) {
            clearTimeout(autoAdvanceTimeoutRef.current);
          }
          
          // Auto-advance to next step after a short delay to show the completion
          autoAdvanceTimeoutRef.current = setTimeout(() => {
            setCurrentStepIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              if (nextIndex < steps.length) {
                return nextIndex;
              }
              return prevIndex;
            });
            setCanAdvance(false);
          }, 1000); // Small delay to show the completion state
        } else {
          rafId = requestAnimationFrame(checkCompletion);
        }
      };
      rafId = requestAnimationFrame(checkCompletion);
      
      // Store the rafId so we can clean it up
      checkIntervalRef.current = rafId as unknown as NodeJS.Timeout;
    } else {
      setCanAdvance(true);
    }

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight, true);
      if (checkIntervalRef.current) {
        // PERFORMANCE: Handle both interval and RAF cleanup
        if (typeof checkIntervalRef.current === 'number') {
          cancelAnimationFrame(checkIntervalRef.current);
        } else {
          clearInterval(checkIntervalRef.current);
        }
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, [currentStep, steps]);

  const handleNext = () => {
    if (!canAdvance && currentStep.waitForAction) return;

    // Execute step action if provided
    if (currentStep.action) {
      currentStep.action();
    }

    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
      setCanAdvance(false);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!currentStep) return null;

  // Never render dark overlay - it blocks clicks
  // Only show pulsing border (if target exists) and instruction card
  return (
    <>
      {/* Pulsing border around highlighted element - no blocking */}
      {highlightBox && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 40 }}>
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
            <motion.rect
              x={highlightBox.x - 6}
              y={highlightBox.y - 6}
              width={highlightBox.width + 12}
              height={highlightBox.height + 12}
              fill="none"
              stroke="#eab308"
              strokeWidth="4"
              rx="12"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      )}
      
      {/* Instruction Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-0 left-0 right-0 md:bottom-8 md:left-auto md:right-8 md:w-auto md:max-w-2xl md:translate-x-0 w-full px-2 sm:px-4 md:px-0"
          style={{ zIndex: 60, pointerEvents: 'auto' }}
          onClick={(e) => {
            // Only stop propagation on the card itself, not its children
            e.stopPropagation();
          }}
        >
            <Card className="bg-game-background-dark border-primary-500 border-2 shadow-2xl rounded-t-2xl md:rounded-2xl max-h-[85vh] md:max-h-none overflow-hidden flex flex-col">
              {/* Mobile Collapsible Header */}
              {isMobile && (
                <div 
                  className="flex items-center justify-between p-3 border-b border-primary-500/30 cursor-pointer"
                  onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex gap-1 flex-1 min-w-0">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded ${
                            index <= currentStepIndex
                              ? 'bg-primary-500'
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                      {currentStepIndex + 1}/{steps.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-xs text-white font-semibold truncate max-w-[120px]">
                      {currentStep.title}
                    </span>
                    {isMobileCollapsed ? (
                      <ChevronUp className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              )}

              {/* Content - collapsible on mobile */}
              <AnimatePresence>
                {(!isMobile || !isMobileCollapsed) && (
                  <motion.div
                    initial={isMobile ? { height: 0, opacity: 0 } : undefined}
                    animate={isMobile ? { height: 'auto', opacity: 1 } : undefined}
                    exit={isMobile ? { height: 0, opacity: 0 } : undefined}
                    transition={{ duration: 0.2 }}
                    className="overflow-y-auto flex-1"
                  >
                    <div className="p-4 sm:p-6">
                      {!isMobile && (
                        <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          {steps.map((_, index) => (
                            <div
                              key={index}
                              className={`h-1.5 sm:h-1 flex-1 rounded ${
                                index <= currentStepIndex
                                  ? 'bg-primary-500'
                                  : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      <div className="space-y-3 sm:space-y-4">
                        {!isMobile && (
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                              {currentStep.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                              {currentStep.description}
                            </p>
                          </div>
                        )}

                        {isMobile && (
                          <div>
                            <h3 className="text-base font-bold text-white mb-2">
                              {currentStep.title}
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {currentStep.description}
                            </p>
                          </div>
                        )}

                  {currentStep.waitForAction && !canAdvance && (
                    <div className="bg-primary-500/20 border border-primary-500/50 rounded p-2 sm:p-3">
                      <p className="text-xs sm:text-sm text-primary-300 flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{currentStep.target 
                          ? t('clickHighlighted')
                          : t('completeAction')}</span>
                      </p>
                    </div>
                  )}

                        {canAdvance && currentStep.waitForAction && (
                          <div className="bg-green-500/20 border border-green-500/50 rounded p-2 sm:p-3">
                            <p className="text-xs sm:text-sm text-green-300">
                              {t('perfectContinue')}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSkip}
                          className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <X className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">{t('skip')}</span>
                        </Button>
                        <Button
                          onClick={handleNext}
                          disabled={!canAdvance && currentStep.waitForAction}
                          className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-0 text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-initial"
                          data-tutorial-target="siguiente-button"
                        >
                          <span>{isLastStep ? t('startGame') : t('next')}</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </AnimatePresence>
    </>
  );
}
