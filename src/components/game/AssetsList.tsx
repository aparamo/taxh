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
import {useTranslations} from 'next-intl';
import { AssetNameDisplay, AssetDescriptionDisplay } from '@/game/utils/translations';
import { translateStoreMessage } from '@/game/utils/translateStoreMessage';

export function AssetsList() {
  const t = useTranslations('Game.AssetsList');
  const tStore = useTranslations('Game.Store.messages');
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
        setMessage({ type: 'error', text: t('selectCountryFirst') });
        return;
      }
      assetData = createCorruptionAsset(assetTemplate, countryId);
    } else {
      assetData = { ...assetTemplate };
    }
    
    const result = purchaseAsset(assetData, countryId);

    if (result.success) {
      setMessage({ type: 'success', text: translateStoreMessage(tStore, result.message) });
    } else {
      setMessage({ type: 'error', text: translateStoreMessage(tStore, result.message) });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleStoreMoney = (assetId: string) => {
    const amountStr = storageAmounts[assetId] || '';
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: t('invalidAmount') });
      return;
    }
    
    const result = storeMoneyInAsset(assetId, amount);
    setMessage({ type: result.success ? 'success' : 'error', text: translateStoreMessage(tStore, result.message) });
    setStorageAmounts({ ...storageAmounts, [assetId]: '' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLiquidate = (assetId: string) => {
    const result = liquidateAsset(assetId);
    setMessage({ type: result.success ? 'success' : 'error', text: translateStoreMessage(tStore, result.message) });
    setTimeout(() => setMessage(null), 3000);
  };

  const getCurrencyIndicator = (currencyType?: 'clean' | 'dirty' | 'any') => {
    // Use direct translation keys that exist in Game.AssetsList
    if (currencyType === 'clean') return `💵 ${t('clean')}`;
    if (currencyType === 'dirty') return `💰 ${t('dirty')}`;
    return `💸 ${t('any')}`;
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
              <span className="text-gray-400">{t('passiveIncome')}</span>
              <span className="text-green-400">+{formatCurrency(passiveIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('maintenanceCost')}</span>
              <span className="text-red-400">-{formatCurrency(maintenanceCosts)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
              <span className="text-white font-bold">{t('netCashFlow')}</span>
              <span className={`font-bold ${netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Owned Assets */}
      <div>
        <h3 className="font-bold mb-3 text-white">{t('ownedAssets')}</h3>
        {assets.length > 0 ? (
          <div className="space-y-2">
            {assets.map((asset) => (
              <Card key={asset.id} className="bg-game-background-darker p-3 border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <AssetNameDisplay assetType={asset.type} fallbackName={asset.name} className="font-bold text-white" />
                    <div className="text-sm text-gray-400">
                      {asset.heatReduction > 0 
                        ? `${t('heat')} -${asset.heatReduction}%` 
                        : `${t('heat')} +${Math.abs(asset.heatReduction)}%`}
                      {asset.passiveIncome && ` | ${t('income')} +${formatCurrency(asset.passiveIncome)}/min`}
                      {asset.maintenanceCost && ` | ${t('maintenance')} -${formatCurrency(asset.maintenanceCost)}/min`}
                      {asset.storedFunds && asset.storedFunds > 0 && ` | ${t('stored')} ${formatCurrency(asset.storedFunds)}`}
                    </div>
                    {asset.betrayalRisk && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-600 mt-1">
                        {t('betrayalRisk')} {asset.betrayalRisk}%
                      </Badge>
                    )}
                    {asset.seizureRisk && (
                      <Badge variant="outline" className="text-orange-400 border-orange-600 mt-1 ml-1">
                        {t('seizureRisk')} {asset.seizureRisk}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {['yacht', 'mansion', 'art'].includes(asset.type) && (
                      <div className="space-y-1">
                        <input
                          type="number"
                          placeholder={t('store') + ' $'}
                          className="w-24 px-2 py-1 bg-game-background text-white text-xs rounded border border-gray-600"
                          value={storageAmounts[asset.id] || ''}
                          onChange={(e) => setStorageAmounts({ ...storageAmounts, [asset.id]: e.target.value })}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleStoreMoney(asset.id)}
                          className="w-24 h-6 text-xs bg-primary-500 hover:bg-primary-600"
                        >
                          {t('store')}
                        </Button>
                      </div>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleLiquidate(asset.id)}
                      className="h-6 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    >
                      {t('liquidate')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t('noAssetsOwned')}</p>
        )}
      </div>

      {/* Buy Assets - Luxury */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="font-bold mb-3 text-white">{t('luxuryAssets')}</h3>
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
                      <AssetNameDisplay assetType={asset.type} fallbackName={asset.name} className="font-bold text-white" />
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
                    <AssetDescriptionDisplay assetType={asset.type} fallbackDescription={asset.description} className="text-sm text-gray-400" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {asset.heatReduction > 0 && (
                        <Badge variant="outline" className="text-green-400 border-green-600 text-xs">
                          {t('heat')} -{asset.heatReduction}%
                        </Badge>
                      )}
                      {asset.heatReduction < 0 && (
                        <Badge variant="outline" className="text-red-400 border-red-600 text-xs">
                          {t('heat')} +{Math.abs(asset.heatReduction)}%
                        </Badge>
                      )}
                      {asset.passiveIncome && (
                        <Badge variant="outline" className="text-green-400 border-green-600 text-xs">
                          {t('income')} +{formatCurrency(asset.passiveIncome)}/min
                        </Badge>
                      )}
                      {asset.maintenanceCost && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-600 text-xs">
                          {t('maintenance')} -{formatCurrency(asset.maintenanceCost)}/min
                        </Badge>
                      )}
                      {asset.seizureRisk && (
                        <Badge variant="outline" className="text-orange-400 border-orange-600 text-xs">
                          {t('confiscation')} {asset.seizureRisk}%
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                        {getCurrencyIndicator(asset.currencyType)}
                      </Badge>
                    </div>
                  </div>
                </div>
                {alreadyOwned ? (
                  <p className="text-xs text-gray-500">{t('alreadyOwned')}</p>
                ) : !canAfford ? (
                  <p className="text-xs text-red-400">{t('insufficientFunds')}</p>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handlePurchase(asset)}
                    className="w-full mt-2 bg-primary-500 hover:bg-primary-600"
                  >
                    {t('purchase')}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Buy Assets - Corruption */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="font-bold mb-3 text-white">{t('corruptionAssets')}</h3>
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
                      <AssetNameDisplay assetType={asset.type} fallbackName={asset.name} className="font-bold text-white" />
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
                    <AssetDescriptionDisplay assetType={asset.type} fallbackDescription={asset.description} className="text-sm text-gray-400" />
                    <div className="flex gap-2 mt-1">
                      {asset.maintenanceCost && (
                        <Badge variant="outline" className="text-red-400 border-red-600 text-xs">
                          -{formatCurrency(asset.maintenanceCost)}/min
                        </Badge>
                      )}
                      {asset.betrayalRisk && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-600 text-xs">
                          {t('betrayal')} {asset.betrayalRisk}%
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
                      <SelectValue placeholder={t('selectCountry')} />
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
                    <p className="text-xs text-gray-500">{t('assetAlreadyOwnedInCountry')}</p>
                  )}
                  {selectedCountry && !canAfford && (
                    <p className="text-xs text-red-400">{t('insufficientFunds')}</p>
                  )}
                  {selectedCountry && canAfford && !alreadyOwned && (
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(asset)}
                      className="w-full bg-primary-500 hover:bg-primary-600"
                    >
                      {t('purchaseIn')} {availableCountries.find(c => c.id === selectedCountry)?.name}
                    </Button>
                  )}
                  {!selectedCountry && (
                    <p className="text-xs text-gray-500">{t('selectCountryToPurchase')}</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Buy Assets - Infrastructure */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="font-bold mb-3 text-white">{t('infrastructure')}</h3>
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
                      <AssetNameDisplay assetType={asset.type} fallbackName={asset.name} className="font-bold text-white" />
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
                    <AssetDescriptionDisplay assetType={asset.type} fallbackDescription={asset.description} className="text-sm text-gray-400" />
                    <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs mt-1">
                      {getCurrencyIndicator(asset.currencyType)}
                    </Badge>
                  </div>
                </div>
                {alreadyOwned ? (
                  <p className="text-xs text-gray-500">{t('alreadyOwned')}</p>
                ) : !canAfford ? (
                  <p className="text-xs text-red-400">{t('insufficientFunds')}</p>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handlePurchase(asset)}
                    className="w-full mt-2 bg-primary-500 hover:bg-primary-600"
                  >
                    {t('purchase')}
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
