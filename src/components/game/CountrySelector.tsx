'use client';

import * as React from 'react';
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
import { countries } from '@/game/data/countries';
import { useGameStore } from '@/game/store';
import { getFilteredCountries, getFilteredCountriesForRealCase } from '@/game/data/filters';
import { motion, AnimatePresence } from 'motion/react';
import { Globe2, Check, ChevronDown } from 'lucide-react';
import { InfoButton } from './InfoButton';
import { getCountryContent } from '@/game/data/educationalContent';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {useTranslations} from 'next-intl';

// Helper component to display translated country name
function CountryNameDisplay({ countryId, fallbackName, className = "font-bold text-white text-lg" }: { countryId: string; fallbackName: string; className?: string }) {
  const t = useTranslations('GameData.Countries');
  try {
    const name = t(`${countryId}.name` as never);
    return <h3 className={className}>{name}</h3>;
  } catch {
    return <h3 className={className}>{fallbackName}</h3>;
  }
}

// Helper component to display translated country description
function CountryDescriptionDisplay({ countryId, fallbackDescription, className = "text-sm text-gray-400 mb-3" }: { countryId: string; fallbackDescription: string; className?: string }) {
  const t = useTranslations('GameData.Countries');
  try {
    const description = t(`${countryId}.description` as never);
    return <p className={className}>{description}</p>;
  } catch {
    return <p className={className}>{fallbackDescription}</p>;
  }
}

// Global state for selected country (shared between components)
let selectedCountryId: string | null = null;
const countryListeners = new Set<() => void>();

export function setSelectedCountry(countryId: string | null) {
  selectedCountryId = countryId;
  // Also store in window for Globe component
  if (typeof window !== 'undefined') {
    (window as { __selectedCountry?: string | null }).__selectedCountry = countryId;
  }
  countryListeners.forEach(listener => listener());
}

export function getSelectedCountry(): string | null {
  return selectedCountryId;
}

export function CountrySelector() {
  const t = useTranslations('Game.CountrySelector');
  const activeCountries = useGameStore((state) => state.activeCountries);
  const role = useGameStore((state) => state.role);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const realCaseMode = useGameStore((state) => state.realCaseMode);
  const realCaseId = useGameStore((state) => state.realCaseId);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [showCountryDisplay, setShowCountryDisplay] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  // Detect mobile
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Show country display when country is selected, hide after delay or on scroll
  React.useEffect(() => {
    if (selectedCountryId) {
      setShowCountryDisplay(true);
      
      // Auto-hide after 5 seconds on mobile, 8 seconds on desktop
      // But only if user hasn't interacted with transaction panel
      let hideTimeout: NodeJS.Timeout;
      
      const scheduleHide = () => {
        hideTimeout = setTimeout(() => {
          // Check if transaction panel is active (has focus or mechanism selected)
          const transactionInput = document.querySelector('[data-tutorial-target="transaction-panel"] input[type="number"]') as HTMLInputElement;
          const isTransactionActive = transactionInput && (document.activeElement === transactionInput || transactionInput.value);
          
          if (!isTransactionActive) {
            setShowCountryDisplay(false);
          }
        }, isMobile ? 5000 : 8000);
      };
      
      scheduleHide();
      
      // Hide on scroll (but allow re-showing if needed)
      const handleScroll = () => {
        const transactionInput = document.querySelector('[data-tutorial-target="transaction-panel"] input[type="number"]') as HTMLInputElement;
        const isTransactionActive = transactionInput && (document.activeElement === transactionInput || transactionInput.value);
        
        if (!isTransactionActive) {
          setShowCountryDisplay(false);
        }
      };
      
      // Show when transaction input is focused
      const handleTransactionFocus = () => {
        setShowCountryDisplay(true);
        clearTimeout(hideTimeout);
        scheduleHide();
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('touchmove', handleScroll, { passive: true });
      
      // Listen for focus on transaction input
      const transactionInput = document.querySelector('[data-tutorial-target="transaction-panel"] input[type="number"]');
      if (transactionInput) {
        transactionInput.addEventListener('focus', handleTransactionFocus);
        transactionInput.addEventListener('input', handleTransactionFocus);
      }
      
      return () => {
        clearTimeout(hideTimeout);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('touchmove', handleScroll);
        if (transactionInput) {
          transactionInput.removeEventListener('focus', handleTransactionFocus);
          transactionInput.removeEventListener('input', handleTransactionFocus);
        }
      };
    } else {
      setShowCountryDisplay(false);
    }
  }, [isMobile]);
  
  // Also show when dialog opens
  React.useEffect(() => {
    if (isDialogOpen && selectedCountryId) {
      setShowCountryDisplay(true);
    }
  }, [isDialogOpen]);
  
  // Show all countries toggle with localStorage persistence
  const [showAllCountries, setShowAllCountries] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('showAllCountries') === 'true';
  });
  
  // Update localStorage when toggle changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showAllCountries', showAllCountries.toString());
    }
  }, [showAllCountries]);
  
  React.useEffect(() => {
    const listener = () => forceUpdate();
    countryListeners.add(listener);
    return () => {
      countryListeners.delete(listener);
    };
  }, []);

  const selectedCountry = selectedCountryId;
  const isTutorial = gameStatus === 'tutorial';
  
  // CRITICAL: Apply real case filtering ONLY when realCaseMode === true
  // Tutorial mode always uses filtered countries (ignore toggle)
  // Real case mode always uses case-specific filtering (ignore toggle)
  // Otherwise, respect showAllCountries toggle
  let availableCountries;
  let coreCountries: string[] = [];
  if (realCaseMode && realCaseId) {
    // Real case filtering (unchanged, ignore toggle)
    const filtered = getFilteredCountriesForRealCase(realCaseId);
    availableCountries = filtered.all;
    coreCountries = filtered.core.map(c => c.id);
  } else if (isTutorial) {
    // Tutorial filtering (unchanged, ignore toggle)
    availableCountries = getFilteredCountries(role || 'multimillionaire', true);
  } else if (showAllCountries) {
    // Show all countries when toggle is enabled
    availableCountries = countries;
  } else {
    // Role-based filtering (existing logic)
    availableCountries = getFilteredCountries(role || 'multimillionaire', false);
  }
  
  const selectedCountryData = selectedCountry 
    ? availableCountries.find(c => c.id === selectedCountry) || countries.find(c => c.id === selectedCountry)
    : null;

  const handleSelectCountry = (countryId: string) => {
    setSelectedCountry(countryId);
    setIsDialogOpen(false);
  };

  return (
    <Card className="bg-game-background-dark border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{t('title')}</h2>
        {/* Show All Toggle - Only show in non-tutorial, non-real-case mode */}
        {!isTutorial && !realCaseMode && (
          <div className="flex items-center gap-2">
            <Switch
              id="show-all-countries"
              checked={showAllCountries}
              onCheckedChange={setShowAllCountries}
              className="data-[state=checked]:bg-primary-500"
            />
            <Label 
              htmlFor="show-all-countries" 
              className="text-sm text-gray-300 cursor-pointer"
            >
              {showAllCountries ? t('dialog.showAll') : t('dialog.filterByRole')}
            </Label>
          </div>
        )}
      </div>
      
      {/* Currently Selected Country - Contextual Display */}
      <AnimatePresence mode="wait">
        {selectedCountryData && showCountryDisplay ? (
          <motion.div 
            key="expanded"
            className="mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
          <Card className="bg-game-background-darker border-primary-500 border-2 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="text-2xl sm:text-3xl flex-shrink-0">{selectedCountryData.flagEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CountryNameDisplay countryId={selectedCountryData.id} fallbackName={selectedCountryData.name} className="font-bold text-white text-sm sm:text-base truncate" />
                    {(() => {
                      const countryContent = getCountryContent(selectedCountryData.id);
                      return countryContent ? (
                        <InfoButton content={countryContent} size="sm" />
                      ) : null;
                    })()}
                    {activeCountries.includes(selectedCountryData.id) && (
                      <Badge className="bg-primary-500 text-white text-xs">{t('badges.active')}</Badge>
                    )}
                  </div>
                  {!isMobile && (
                    <CountryDescriptionDisplay countryId={selectedCountryData.id} fallbackDescription={selectedCountryData.description} className="text-xs sm:text-sm text-gray-400 line-clamp-1" />
                  )}
                </div>
              </div>
              {!isMobile && (
                <div className="flex gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                    {t('badges.secrecy')} {selectedCountryData.secrecyScore}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                    {t('badges.risk')} {selectedCountryData.riskLevel}/10
                  </Badge>
                </div>
              )}
            </div>
            {isMobile && (
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                  Secreto: {selectedCountryData.secrecyScore}
                </Badge>
                <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                  Riesgo: {selectedCountryData.riskLevel}/10
                </Badge>
              </div>
            )}
          </Card>
          </motion.div>
        ) : selectedCountryData ? (
          // Compact display when hidden - just flag and name
          <motion.div 
            key="compact"
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
          <Card 
            className="bg-game-background-darker border-primary-500/50 border p-2 sm:p-3 cursor-pointer hover:border-primary-500 transition-colors"
            onClick={() => setShowCountryDisplay(true)}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">{selectedCountryData.flagEmoji}</span>
              <div className="flex-1 min-w-0">
                <CountryNameDisplay countryId={selectedCountryData.id} fallbackName={selectedCountryData.name} className="font-semibold text-white text-sm sm:text-base truncate" />
                {activeCountries.includes(selectedCountryData.id) && (
                  <Badge className="bg-primary-500 text-white text-xs mt-1">Activo</Badge>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {!selectedCountryData && (
        <div className="mb-4 text-sm text-gray-400 text-center py-4">
          {t('noCountrySelected')}
        </div>
      )}

      {/* Open Dialog Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-primary-500 hover:bg-primary-600 text-white"
            data-tutorial-target="country-selector-button"
          >
            <Globe2 className="w-4 h-4 mr-2" />
            {selectedCountryData ? t('change') : t('select')}
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="max-w-[95vw] md:max-w-[90vw] lg:max-w-6xl max-h-[90vh] overflow-y-auto bg-game-background-darker border-gray-700"
          data-tutorial-target="country-dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white">{t('dialog.title')}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {t('dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {availableCountries.map((country, index) => {
              const isActive = activeCountries.includes(country.id);
              const isSelected = selectedCountry === country.id;

              return (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className={`bg-game-background-dark p-4 cursor-pointer transition-all hover:border-primary-500 ${
                      isSelected ? 'border-primary-500 border-2' : 'border-gray-700'
                    } ${isActive ? 'ring-2 ring-primary-500/50' : ''}`}
                    onClick={() => handleSelectCountry(country.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-4xl">{country.flagEmoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CountryNameDisplay countryId={country.id} fallbackName={country.name} />
                            {realCaseMode && coreCountries.includes(country.id) && (
                              <Badge className="bg-primary-500 text-white text-xs">
                                {t('dialog.historicallyUsed')}
                              </Badge>
                            )}
                            {(() => {
                              const countryContent = getCountryContent(country.id);
                              return countryContent ? (
                                <div onClick={(e) => e.stopPropagation()}>
                                  <InfoButton 
                                    content={countryContent} 
                                    size="sm"
                                  />
                                </div>
                              ) : null;
                            })()}
                            {isSelected && (
                              <Check className="w-5 h-5 text-primary-500" />
                            )}
                            {isActive && (
                              <Badge className="bg-primary-500 text-white">{t('dialog.active')}</Badge>
                            )}
                          </div>
                          <CountryDescriptionDisplay countryId={country.id} fallbackDescription={country.description} />
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                              {t('dialog.secrecy')} {country.secrecyScore}
                            </Badge>
                            <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                              {t('dialog.risk')} {country.riskLevel}/10
                            </Badge>
                            <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                              {t('dialog.mechanisms')} {country.availableMechanisms.length}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

