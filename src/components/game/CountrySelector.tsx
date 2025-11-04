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
import { motion } from 'motion/react';
import { Globe2, Check } from 'lucide-react';
import { InfoButton } from './InfoButton';
import { getCountryContent } from '@/game/data/educationalContent';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const activeCountries = useGameStore((state) => state.activeCountries);
  const role = useGameStore((state) => state.role);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const realCaseMode = useGameStore((state) => state.realCaseMode);
  const realCaseId = useGameStore((state) => state.realCaseId);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
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
        <h2 className="text-xl font-bold text-white">Seleccionar País</h2>
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
              {showAllCountries ? 'Mostrar todos' : 'Filtrar por rol'}
            </Label>
          </div>
        )}
      </div>
      
      {/* Currently Selected Country */}
      {selectedCountryData ? (
        <div className="mb-4">
          <Card className="bg-game-background-darker border-primary-500 border-2 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-3xl">{selectedCountryData.flagEmoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{selectedCountryData.name}</h3>
                    {(() => {
                      const countryContent = getCountryContent(selectedCountryData.id);
                      return countryContent ? (
                        <InfoButton content={countryContent} size="sm" />
                      ) : null;
                    })()}
                  </div>
                  <p className="text-sm text-gray-400">{selectedCountryData.description}</p>
                </div>
              </div>
              {activeCountries.includes(selectedCountryData.id) && (
                <Badge className="bg-primary-500 text-white">Activo</Badge>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                Secreto: {selectedCountryData.secrecyScore}
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                Riesgo: {selectedCountryData.riskLevel}/10
              </Badge>
            </div>
          </Card>
        </div>
      ) : (
        <div className="mb-4 text-sm text-gray-400 text-center py-4">
          No hay país seleccionado
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
            {selectedCountryData ? 'Cambiar País' : 'Seleccionar País'}
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="max-w-[95vw] md:max-w-[90vw] lg:max-w-6xl max-h-[90vh] overflow-y-auto bg-game-background-darker border-gray-700"
          data-tutorial-target="country-dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white">Seleccionar País</DialogTitle>
            <DialogDescription className="text-gray-400">
              Elige un país para realizar transacciones. Los países con mayor secreto ofrecen más protección pero pueden tener mayor riesgo.
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
                            <h3 className="font-bold text-white text-lg">{country.name}</h3>
                            {realCaseMode && coreCountries.includes(country.id) && (
                              <Badge className="bg-primary-500 text-white text-xs">
                                Históricamente usado
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
                              <Badge className="bg-primary-500 text-white">Activo</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{country.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                              Secreto: {country.secrecyScore}
                            </Badge>
                            <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                              Riesgo: {country.riskLevel}/10
                            </Badge>
                            <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                              Mecanismos: {country.availableMechanisms.length}
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
