'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/game/store';
import { formatCurrency } from '@/game/logic/validation';
import { TransactionHistory } from './TransactionHistory';
import { AssetsList } from './AssetsList';
import { getCorruptionInCountry } from '@/game/logic/corruption';
import { countries } from '@/game/data/countries';
import { getMechanismById } from '@/game/data/mechanisms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoButton } from './InfoButton';
import { getRealCaseById } from '@/game/data/realCases';
import { getCountryContent, getMechanismContent } from '@/game/data/educationalContent';
import { ExternalLink, LayoutDashboard, ArrowLeftRight, Coins, BookOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Dashboard() {
  const cleanFunds = useGameStore((state) => state.cleanFunds);
  const assets = useGameStore((state) => state.assets);
  const activeCountries = useGameStore((state) => state.activeCountries);
  const activeMechanisms = useGameStore((state) => state.activeMechanisms);
  const currentObjective = useGameStore((state) => state.currentObjective);
  const getPassiveIncome = useGameStore((state) => state.getPassiveIncome);
  const getMaintenanceCosts = useGameStore((state) => state.getMaintenanceCosts);
  const heat = useGameStore((state) => state.heat);
  const realCaseId = useGameStore((state) => state.realCaseId);
  const transactions = useGameStore((state) => state.transactions);

  const passiveIncome = getPassiveIncome();
  const maintenanceCosts = getMaintenanceCosts();
  const netCashFlow = passiveIncome - maintenanceCosts;

  // Calculate total stored funds
  const totalStoredFunds = assets.reduce((sum, asset) => sum + (asset.storedFunds || 0), 0);

  // Calculate corruption by country
  const corruptionByCountry = countries.map((country) => {
    const corruptionAssets = getCorruptionInCountry(assets, country.id);
    return {
      country,
      corruption: corruptionAssets,
      count: corruptionAssets.length,
    };
  }).filter((item) => item.count > 0);

  // Calculate aggregate risk scores
  const totalBetrayalRisk = assets
    .filter((a) => a.betrayalRisk)
    .reduce((sum, a) => sum + (a.betrayalRisk || 0), 0) / Math.max(1, assets.filter((a) => a.betrayalRisk).length);
  
  const totalSeizureRisk = assets
    .filter((a) => a.seizureRisk)
    .reduce((sum, a) => sum + (a.seizureRisk || 0), 0) / Math.max(1, assets.filter((a) => a.seizureRisk).length);

  return (
    <Card 
      className="bg-game-background-dark border-gray-800 p-4 h-full text-white"
      data-tutorial-target="dashboard"
    >
      <TooltipProvider delayDuration={0}>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-game-background-darker gap-1.5 px-1 sm:px-2 py-2.5 h-auto min-h-[auto]">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary-500/20 !text-[10px] sm:!text-xs md:!text-xs px-1 sm:px-2 md:px-3 xl:px-4 py-2.5 whitespace-nowrap min-w-0 h-auto flex items-center justify-center gap-1.5 md:gap-0 xl:gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 xl:w-4 xl:h-4 flex-shrink-0" />
                  <span className="md:hidden xl:inline">Resumen</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-game-background-darker border-gray-700">
                <p className="text-sm font-medium">Resumen</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="transactions" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary-500/20 !text-[10px] sm:!text-xs md:!text-xs px-1 sm:px-2 md:px-3 xl:px-4 py-2.5 whitespace-nowrap min-w-0 h-auto flex items-center justify-center gap-1.5 md:gap-0 xl:gap-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 xl:w-4 xl:h-4 flex-shrink-0" />
                  <span className="md:hidden xl:inline">Transacciones</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-game-background-darker border-gray-700">
                <p className="text-sm font-medium">Transacciones</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value="assets" 
                  className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary-500/20 !text-[10px] sm:!text-xs md:!text-xs px-1 sm:px-2 md:px-3 xl:px-4 py-2.5 whitespace-nowrap min-w-0 h-auto flex items-center justify-center gap-1.5 md:gap-0 xl:gap-1.5"
                  data-tutorial-target="assets-tab"
                >
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 xl:w-4 xl:h-4 flex-shrink-0" />
                  <span className="md:hidden xl:inline">Activos</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-game-background-darker border-gray-700">
                <p className="text-sm font-medium">Activos</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="educational" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary-500/20 !text-[10px] sm:!text-xs md:!text-xs px-1 sm:px-2 md:px-3 xl:px-4 py-2.5 whitespace-nowrap min-w-0 h-auto flex items-center justify-center gap-1.5 md:gap-0 xl:gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 xl:w-4 xl:h-4 flex-shrink-0" />
                  <span className="md:hidden xl:inline">Contexto</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-game-background-darker border-gray-700">
                <p className="text-sm font-medium">Contexto</p>
              </TooltipContent>
            </Tooltip>
          </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-2">
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Fondos blanqueados</h3>
            <p className="text-2xl font-bold text-primary-500">
              {formatCurrency(cleanFunds)}
            </p>
          </div>

          {/* Cash Flow Summary */}
          {(passiveIncome > 0 || maintenanceCosts > 0) && (
            <div className="bg-game-background-darker p-3 rounded-lg border border-gray-700">
              <h3 className="text-sm font-bold mb-2 text-white">Flujo de caja</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ingreso pasivo:</span>
                  <span className="text-green-400">+{formatCurrency(passiveIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mantenimiento:</span>
                  <span className="text-red-400">-{formatCurrency(maintenanceCosts)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
                  <span className="text-white font-bold">Neto:</span>
                  <span className={`font-bold ${netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Asset Summary */}
          {assets.length > 0 && (
            <div className="bg-game-background-darker p-3 rounded-lg border border-gray-700">
              <h3 className="text-sm font-bold mb-2 text-white">Resumen de activos</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total activos:</span>
                  <span className="text-white">{assets.length}</span>
                </div>
                {totalStoredFunds > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fondos almacenados:</span>
                    <span className="text-white">{formatCurrency(totalStoredFunds)}</span>
                  </div>
                )}
                {totalBetrayalRisk > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Riesgo traición promedio:</span>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-600">
                      {Math.round(totalBetrayalRisk)}%
                    </Badge>
                  </div>
                )}
                {totalSeizureRisk > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Riesgo confiscación promedio:</span>
                    <Badge variant="outline" className="text-orange-400 border-orange-600">
                      {Math.round(totalSeizureRisk)}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm text-gray-400 mb-2">Países activos</h3>
            <div className="space-y-2">
              {activeCountries.length > 0 ? (
                activeCountries.map((countryId) => {
                  const country = countries.find(c => c.id === countryId);
                  return (
                    <div
                      key={countryId}
                      className="bg-game-background-darker p-2 rounded text-sm text-gray-300"
                    >
                      {country?.flagEmoji} {country?.name || countryId}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">Ningún país seleccionado</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-400 mb-2">Mecanismos activos</h3>
            <div className="space-y-2">
              {activeMechanisms.length > 0 ? (
                activeMechanisms.map((mechanismId) => {
                  const mechanism = getMechanismById(mechanismId);
                  return (
                    <div
                      key={mechanismId}
                      className="bg-game-background-darker p-2 rounded text-sm text-gray-300"
                    >
                      {mechanism?.name || mechanismId}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">Ningún mecanismo activo</p>
              )}
            </div>
          </div>

          {/* Corruption by Country */}
          {corruptionByCountry.length > 0 && (
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Corrupción por país</h3>
              <div className="space-y-2">
                {corruptionByCountry.map(({ country, corruption, count }) => (
                  <div key={country.id} className="bg-game-background-darker p-2 rounded">
                    <div className="text-sm text-white font-bold mb-1">
                      {country.flagEmoji} {country.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {corruption.map((asset) => asset.name).join(', ')}
                    </div>
                    <Badge variant="outline" className="text-xs mt-1 text-yellow-400 border-yellow-600">
                      {count} conexión{count !== 1 ? 'es' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentObjective && (
            <div className="bg-primary-500/10 border border-primary-500/30 p-4 rounded-lg">
              <h3 className="text-sm font-bold mb-2 text-white">Objetivo actual</h3>
              <p className="text-sm text-gray-300">{currentObjective.description}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="assets" className="mt-4">
          <AssetsList />
        </TabsContent>

        <TabsContent value="educational" className="mt-4 space-y-4 max-h-[600px] overflow-y-auto">
          {/* Real Case Comparison */}
          {realCaseId && (() => {
            const realCase = getRealCaseById(realCaseId);
            if (!realCase) return null;
            
            const historicalProgress = Math.min((transactions.length / realCase.historicalSteps.length) * 100, 100);
            const historicalTotalAmount = realCase.historicalSteps.reduce((sum, step) => sum + step.amount, 0);
            const playerTotalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
            
            return (
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-yellow-400">Caso Real: {realCase.name}</h3>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-500/50">
                    {realCase.protagonist}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Progreso histórico:</span>
                    <span className="text-white">{Math.round(historicalProgress)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monto histórico:</span>
                    <span className="text-white">{formatCurrency(historicalTotalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tu monto:</span>
                    <span className={playerTotalAmount > historicalTotalAmount ? 'text-red-400' : 'text-green-400'}>
                      {formatCurrency(playerTotalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resultado histórico:</span>
                    <Badge variant={realCase.finalOutcome.caught ? 'destructive' : 'outline'} className="text-xs">
                      {realCase.finalOutcome.caught ? 'Descubierto' : 'Controversial'}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Risk Comparison */}
          <div className="bg-game-background-darker p-4 rounded-lg border border-gray-700 space-y-3">
            <h3 className="text-sm font-bold text-white">Comparación de Riesgo</h3>
            
            <div className="space-y-2 text-sm">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400">Tu heat total:</span>
                  <Badge variant={heat.total > 50 ? 'destructive' : heat.total > 30 ? 'outline' : 'secondary'} className="text-xs">
                    {heat.total.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {heat.total > 50 
                    ? '⚠️ Nivel crítico - similar a casos que fueron descubiertos'
                    : heat.total > 30
                    ? '⚡ Nivel medio - aumenta vigilancia de autoridades'
                    : '✓ Nivel bajo - relativamente seguro'}
                </p>
              </div>

              {heat.total > 30 && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded text-xs">
                  <p className="text-red-300 mb-2">
                    <strong>Caso real:</strong> Jho Low alcanzó heat crítico después de transferencias de $1B+, 
                    lo que eventualmente llevó a investigaciones internacionales.
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-auto p-1 text-red-400 hover:text-red-300"
                    onClick={() => window.open('https://www.icij.org/investigations/1mdb/', '_blank')}
                  >
                    Ver investigación 1MDB <ExternalLink className="w-3 h-3 ml-1 inline" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Strategy Comparison */}
          <div className="bg-game-background-darker p-4 rounded-lg border border-gray-700 space-y-3">
            <h3 className="text-sm font-bold text-white">Tu Estrategia</h3>
            
            <div className="space-y-3 text-sm">
              {activeCountries.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400">Países utilizados:</span>
                    {activeCountries.map((countryId) => {
                      const country = countries.find(c => c.id === countryId);
                      const countryContent = country ? getCountryContent(country.id) : null;
                      return (
                        <div key={countryId} className="flex items-center gap-1">
                          <span className="text-white">{country?.flagEmoji} {country?.name}</span>
                          {countryContent && (
                            <InfoButton content={countryContent} size="sm" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500">
                    {activeCountries.length >= 3
                      ? '✓ Diversificación adecuada - similar a casos exitosos (aunque temporales)'
                      : activeCountries.length === 1
                      ? '⚠️ Concentración alta - aumenta riesgo de detección'
                      : '⚡ Diversificación moderada'}
                  </p>
                </div>
              )}

              {activeMechanisms.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-gray-400">Mecanismos:</span>
                    {activeMechanisms.map((mechanismId) => {
                      const mechanism = getMechanismById(mechanismId);
                      const mechanismContent = mechanism ? getMechanismContent(mechanism.id) : null;
                      return (
                        <div key={mechanismId} className="flex items-center gap-1">
                          <span className="text-white">{mechanism?.name}</span>
                          {mechanismContent && (
                            <InfoButton content={mechanismContent} size="sm" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {assets.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Activos de lujo:</span>
                    <Badge variant="outline" className="text-xs">
                      {assets.filter(a => ['yacht', 'mansion', 'art', 'luxury_car', 'rolex'].includes(a.type)).length}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {assets.some(a => a.type === 'yacht')
                      ? '⚠️ Activos visibles (yates) aumentan heat pero muestran riqueza'
                      : '✓ Activos más discretos'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Learn More Section */}
          <div className="bg-primary-500/10 border border-primary-500/30 p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-bold text-primary-400">Aprende Más</h3>
            <div className="space-y-2 text-xs">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-primary-500/20"
                onClick={() => window.open('https://www.icij.org/', '_blank')}
              >
                Investigaciones ICIJ <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-primary-500/20"
                onClick={() => window.open('https://www.transparency.org/', '_blank')}
              >
                Transparency International <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-primary-500/20"
                onClick={() => window.open('https://www.taxjustice.net/', '_blank')}
              >
                Tax Justice Network <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        </TabsContent>
        </Tabs>
      </TooltipProvider>
    </Card>
  );
}
