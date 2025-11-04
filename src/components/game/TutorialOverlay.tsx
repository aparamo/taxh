'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';


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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightBox, setHighlightBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [canAdvance, setCanAdvance] = useState(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoAdvancedRef = useRef(false);

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
          className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 w-full max-w-2xl px-4 md:px-0"
          style={{ zIndex: 60, pointerEvents: 'auto' }}
          onClick={(e) => {
            // Only stop propagation on the card itself, not its children
            e.stopPropagation();
          }}
        >
            <Card className="bg-game-background-dark border-primary-500 border-2 shadow-2xl">
              <div className="p-6">
                <div className="flex gap-2 mb-4">
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

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {currentStep.title}
                    </h3>
                    <p className="text-gray-300">
                      {currentStep.description}
                    </p>
                  </div>

                  {currentStep.waitForAction && !canAdvance && (
                    <div className="bg-primary-500/20 border border-primary-500/50 rounded p-3">
                      <p className="text-sm text-primary-300 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        {currentStep.target 
                          ? 'Haz click en el elemento resaltado para continuar'
                          : 'Completa la acción para continuar'}
                      </p>
                    </div>
                  )}

                  {canAdvance && currentStep.waitForAction && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded p-3">
                      <p className="text-sm text-green-300">
                        ✓ ¡Perfecto! Puedes continuar al siguiente paso.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Saltar Tutorial
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canAdvance && currentStep.waitForAction}
                    className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    data-tutorial-target="siguiente-button"
                  >
                    {isLastStep ? 'Comenzar Juego' : 'Siguiente'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
    </>
  );
}
