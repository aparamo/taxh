'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/store';
import { luxuryAssets, corruptionAssetTemplates, infrastructureAssets, createCorruptionAsset } from '@/game/data/assets';
import { countries } from '@/game/data/countries';
import { getFilteredAssets, getFilteredAssetsForRealCase } from '@/game/data/filters';
import { formatCurrency } from '@/game/logic/validation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoButton } from './InfoButton';
import { getAssetContent } from '@/game/data/educationalContent';

export function AssetsList() {
  const assets = useGameStore((state) => state.assets);
  const cleanFunds = useGameStore((state) => state.cleanFunds);
  const totalFunds = useGameStore((state) => state.totalFunds);
  const role = useGameStore((state) => state.role);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const realCaseMode = useGameStore((state) => state.realCaseMode);
  const realCaseId = useGameStore((state) => state.realCaseId);
  const purchaseAsset = useGameStore((state) => state.purchaseAsset);
  const storeMoneyInAsset = useGameStore((state) => state.storeMoneyInAsset);
  const liquidateAsset = useGameStore((state) => state.liquidateAsset);
  const getPassiveIncome = useGameStore((state) => state.getPassiveIncome);
  const getMaintenanceCosts = useGameStore((state) => state.getMaintenanceCosts);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedCountryForCorruption, setSelectedCountryForCorruption] = useState<Record<string, string>>({});
  const [storageAmounts, setStorageAmounts] = useState<Record<string, string>>({});

  const passiveIncome = getPassiveIncome();
  const maintenanceCosts = getMaintenanceCosts();
  const netCashFlow = passiveIncome - maintenanceCosts;
  
  // CRITICAL: Apply real case filtering ONLY when realCaseMode === true
  const isTutorial = gameStatus === 'tutorial';
  let allFilteredAssets;
  if (realCaseMode && realCaseId) {
    allFilteredAssets = getFilteredAssetsForRealCase(realCaseId);
  } else {
    allFilteredAssets = getFilteredAssets(role || 'multimillionaire', isTutorial);
  }
  
  const filteredLuxuryAssets = allFilteredAssets.filter(a => !a.isCorruption && a.type !== 'bank_relationship');
  const filteredCorruptionAssets = allFilteredAssets.filter(a => a.isCorruption);
  const filteredInfrastructureAssets = allFilteredAssets.filter(a => a.type === 'bank_relationship');

  const handlePurchase = (assetTemplate: typeof luxuryAssets[0] | typeof corruptionAssetTemplates[0] | typeof infrastructureAssets[0]) => {
    setMessage(null);
    
    // For corruption assets, use selected country
    let assetData;
    let countryId: string | undefined;
    
    if (assetTemplate.isCorruption) {
      countryId = selectedCountryForCorruption[assetTemplate.type] || undefined;
      if (!countryId) {
        setMessage({ type: 'error', text: 'Por favor selecciona un país primero' });
        return;
      }
      assetData = createCorruptionAsset(assetTemplate, countryId);
    } else {
      assetData = { ...assetTemplate };
    }
    
    const result = purchaseAsset(assetData, countryId);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleStoreMoney = (assetId: string) => {
    const amountStr = storageAmounts[assetId] || '';
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Ingresa una cantidad válida' });
      return;
    }
    
    const result = storeMoneyInAsset(assetId, amount);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setStorageAmounts({ ...storageAmounts, [assetId]: '' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLiquidate = (assetId: string) => {
    const result = liquidateAsset(assetId);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setTimeout(() => setMessage(null), 3000);
  };

  const getCurrencyIndicator = (currencyType?: 'clean' | 'dirty' | 'any') => {
    if (currencyType === 'clean') return '💵 Limpio';
    if (currencyType === 'dirty') return '💰 Sucio';
    return '💸 Cualquiera';
  };

  const canAffordAsset = (assetTemplate: typeof luxuryAssets[0] | typeof corruptionAssetTemplates[0] | typeof infrastructureAssets[0]) => {
    const currencyType = assetTemplate.currencyType || 'clean';
    if (currencyType === 'clean') return cleanFunds >= assetTemplate.cost;
    if (currencyType === 'dirty') return (totalFunds - cleanFunds) >= assetTemplate.cost;
    return totalFunds >= assetTemplate.cost;
  };

  const isAssetOwned = (assetTemplate: typeof luxuryAssets[0] | typeof corruptionAssetTemplates[0] | typeof infrastructureAssets[0], countryId?: string) => {
    if (assetTemplate.isCorruption && countryId) {
      return assets.some(a => a.type === assetTemplate.type && a.countryId === countryId);
    }
    return assets.some(a => a.type === assetTemplate.type && !a.countryId);
  };

  const availableCountries = countries;

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-2 rounded text-sm ${
          message.type === 'success' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {message.text}
        </div>
      )}

      {/* Cash Flow Summary */}
      {(passiveIncome > 0 || maintenanceCosts > 0) && (
        <Card className="bg-game-background-darker p-3 border-gray-700">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Ingreso pasivo:</span>
              <span className="text-green-400">+{formatCurrency(passiveIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mantenimiento:</span>
              <span className="text-red-400">-{formatCurrency(maintenanceCosts)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
              <span className="text-white font-bold">Flujo neto:</span>
              <span className={`font-bold ${netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Owned Assets */}
      <div>
        <h3 className="font-bold mb-3 text-white">Activos Poseídos</h3>
        {assets.length > 0 ? (
          <div className="space-y-2">
            {assets.map((asset) => (
              <Card key={asset.id} className="bg-game-background-darker p-3 border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-white">{asset.name}</div>
                    <div className="text-sm text-gray-400">
                      {asset.heatReduction > 0 
                        ? `Heat -${asset.heatReduction}%` 
                        : `Heat +${Math.abs(asset.heatReduction)}%`}
                      {asset.passiveIncome && ` | Ingreso: +${formatCurrency(asset.passiveIncome)}/min`}
                      {asset.maintenanceCost && ` | Mantenimiento: -${formatCurrency(asset.maintenanceCost)}/min`}
                      {asset.storedFunds && asset.storedFunds > 0 && ` | Almacenado: ${formatCurrency(asset.storedFunds)}`}
                    </div>
                    {asset.betrayalRisk && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-600 mt-1">
                        Riesgo traición: {asset.betrayalRisk}%
                      </Badge>
                    )}
                    {asset.seizureRisk && (
                      <Badge variant="outline" className="text-orange-400 border-orange-600 mt-1 ml-1">
                        Riesgo confiscación: {asset.seizureRisk}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {['yacht', 'mansion', 'art'].includes(asset.type) && (
                      <div className="space-y-1">
                        <input
                          type="number"
                          placeholder="Almacenar $"
                          className="w-24 px-2 py-1 bg-game-background text-white text-xs rounded border border-gray-600"
                          value={storageAmounts[asset.id] || ''}
                          onChange={(e) => setStorageAmounts({ ...storageAmounts, [asset.id]: e.target.value })}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleStoreMoney(asset.id)}
                          className="w-24 h-6 text-xs bg-primary-500 hover:bg-primary-600"
                        >
                          Almacenar
                        </Button>
                      </div>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleLiquidate(asset.id)}
                      className="h-6 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    >
                      Liquidar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tienes activos aún</p>
        )}
      </div>

      {/* Buy Assets - Luxury */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="font-bold mb-3 text-white">Bienes de Lujo</h3>
        <div className="space-y-2">
          {filteredLuxuryAssets.map((asset) => {
            const canAfford = canAffordAsset(asset);
            const alreadyOwned = isAssetOwned(asset);
            
            return (
              <Card
                key={asset.type}
                className={`bg-game-background-darker p-3 ${
                  canAfford && !alreadyOwned ? 'border-gray-700' : 'border-gray-800 opacity-50'
                }`}
              >
                <div className="mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-white">{asset.name}</div>
                      {(() => {
                        const assetContent = getAssetContent(asset.type);
                        return assetContent ? (
                          <InfoButton content={assetContent} size="sm" />
                        ) : null;
                      })()}
                    </div>
                    <Badge 
                      variant={canAfford && !alreadyOwned ? 'default' : 'outline'}
                      className={`mb-2 ${canAfford && !alreadyOwned ? 'text-white' : 'text-gray-300 border-gray-600'}`}
                    >
                      {formatCurrency(asset.cost)}
                    </Badge>
                    <div className="text-sm text-gray-400">{asset.description}</div>
                    <div className="flex gap-2 mt-1">
                      {asset.passiveIncome && (
                        <Badge variant="outline" className="text-green-400 border-green-600 text-xs">
                          +{formatCurrency(asset.passiveIncome)}/min
                        </Badge>
                      )}
                      {asset.seizureRisk && (
                        <Badge variant="outline" className="text-orange-400 border-orange-600 text-xs">
                          Confiscación: {asset.seizureRisk}%
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                        {getCurrencyIndicator(asset.currencyType)}
                      </Badge>
                    </div>
                  </div>
                </div>
                {alreadyOwned ? (
                  <p className="text-xs text-gray-500">Ya posees este activo</p>
                ) : !canAfford ? (
                  <p className="text-xs text-red-400">Fondos insuficientes</p>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handlePurchase(asset)}
                    className="w-full mt-2 bg-primary-500 hover:bg-primary-600"
                  >
                    Comprar
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Buy Assets - Corruption */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="font-bold mb-3 text-white">Corrupción</h3>
        <div className="space-y-2">
          {filteredCorruptionAssets.map((asset) => {
            const selectedCountry = selectedCountryForCorruption[asset.type];
            const canAfford = canAffordAsset(asset);
            const alreadyOwned = selectedCountry ? isAssetOwned(asset, selectedCountry) : false;
            
            return (
              <Card
                key={asset.type}
                className={`bg-game-background-darker p-3 ${
                  canAfford && !alreadyOwned && selectedCountry ? 'border-gray-700' : 'border-gray-800 opacity-50'
                }`}
              >
                <div className="mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-white">{asset.name}</div>
                      {(() => {
                        const assetContent = getAssetContent(asset.type);
                        return assetContent ? (
                          <InfoButton content={assetContent} size="sm" />
                        ) : null;
                      })()}
                    </div>
                    <Badge 
                      variant={canAfford && !alreadyOwned && selectedCountry ? 'default' : 'outline'}
                      className={`mb-2 ${canAfford && !alreadyOwned && selectedCountry ? 'text-white' : 'text-gray-300 border-gray-600'}`}
                    >
                      {formatCurrency(asset.cost)}
                    </Badge>
                    <div className="text-sm text-gray-400">{asset.description}</div>
                    <div className="flex gap-2 mt-1">
                      {asset.maintenanceCost && (
                        <Badge variant="outline" className="text-red-400 border-red-600 text-xs">
                          -{formatCurrency(asset.maintenanceCost)}/min
                        </Badge>
                      )}
                      {asset.betrayalRisk && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-600 text-xs">
                          Traición: {asset.betrayalRisk}%
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                        {getCurrencyIndicator(asset.currencyType)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Select
                    value={selectedCountry || ''}
                    onValueChange={(value) => setSelectedCountryForCorruption({ ...selectedCountryForCorruption, [asset.type]: value })}
                  >
                    <SelectTrigger className="w-full bg-game-background border-gray-600 text-white">
                      <SelectValue placeholder="Selecciona un país" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCountries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.flagEmoji} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedCountry && alreadyOwned && (
                    <p className="text-xs text-gray-500">Ya tienes este activo en este país</p>
                  )}
                  {selectedCountry && !canAfford && (
                    <p className="text-xs text-red-400">Fondos insuficientes</p>
                  )}
                  {selectedCountry && canAfford && !alreadyOwned && (
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(asset)}
                      className="w-full bg-primary-500 hover:bg-primary-600"
                    >
                      Comprar en {availableCountries.find(c => c.id === selectedCountry)?.name}
                    </Button>
                  )}
                  {!selectedCountry && (
                    <p className="text-xs text-gray-500">Selecciona un país para comprar</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Buy Assets - Infrastructure */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="font-bold mb-3 text-white">Infraestructura</h3>
        <div className="space-y-2">
          {filteredInfrastructureAssets.map((asset) => {
            const canAfford = canAffordAsset(asset);
            const alreadyOwned = isAssetOwned(asset);
            
            return (
              <Card
                key={asset.type}
                className={`bg-game-background-darker p-3 ${
                  canAfford && !alreadyOwned ? 'border-gray-700' : 'border-gray-800 opacity-50'
                }`}
              >
                <div className="mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-white">{asset.name}</div>
                      {(() => {
                        const assetContent = getAssetContent(asset.type);
                        return assetContent ? (
                          <InfoButton content={assetContent} size="sm" />
                        ) : null;
                      })()}
                    </div>
                    <Badge 
                      variant={canAfford && !alreadyOwned ? 'default' : 'outline'}
                      className={`mb-2 ${canAfford && !alreadyOwned ? 'text-white' : 'text-gray-300 border-gray-600'}`}
                    >
                      {formatCurrency(asset.cost)}
                    </Badge>
                    <div className="text-sm text-gray-400">{asset.description}</div>
                    <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs mt-1">
                      {getCurrencyIndicator(asset.currencyType)}
                    </Badge>
                  </div>
                </div>
                {alreadyOwned ? (
                  <p className="text-xs text-gray-500">Ya posees este activo</p>
                ) : !canAfford ? (
                  <p className="text-xs text-red-400">Fondos insuficientes</p>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handlePurchase(asset)}
                    className="w-full mt-2 bg-primary-500 hover:bg-primary-600"
                  >
                    Comprar
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
