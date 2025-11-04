import { Asset } from '../types';
import { calculateBetrayalChance, triggerBetrayal } from './corruption';

// Check for betrayal events on corruption assets
export function checkBetrayalEvents(
  assets: Asset[],
  heat: { total: number; legal: number; media: number; political: number }
): Array<{
  asset: Asset;
  betrayalResult: ReturnType<typeof triggerBetrayal>;
}> {
  const betrayalEvents: Array<{
    asset: Asset;
    betrayalResult: ReturnType<typeof triggerBetrayal>;
  }> = [];

  const corruptionAssets = assets.filter(
    (asset) =>
      asset.type === 'politician' ||
      asset.type === 'judge' ||
      asset.type === 'police'
  );

  for (const asset of corruptionAssets) {
    const betrayalChance = calculateBetrayalChance(asset, heat);
    const roll = Math.random() * 100;

    if (roll < betrayalChance) {
      const betrayalResult = triggerBetrayal(asset);
      betrayalEvents.push({ asset, betrayalResult });
    }
  }

  return betrayalEvents;
}

// Apply rival interference - other criminals increase your costs
export function applyRivalInterference(corruptionAssets: Asset[]): {
  costMultiplier: number;
  message: string | null;
} {
  // More corruption = more attention from rivals
  const corruptionCount = corruptionAssets.length;

  if (corruptionCount >= 6) {
    // 3 countries * 2 types of corruption = high risk
    return {
      costMultiplier: 1.25, // 25% increase in all transaction costs
      message: 'Rivales criminales han detectado tu red de corrupción. Los intermediarios aumentan sus tarifas.',
    };
  } else if (corruptionCount >= 4) {
    return {
      costMultiplier: 1.15, // 15% increase
      message: 'Algunos rivales han notado tus conexiones. Costos aumentan ligeramente.',
    };
  } else if (corruptionCount >= 2) {
    return {
      costMultiplier: 1.05, // 5% increase
      message: null,
    };
  }

  return {
    costMultiplier: 1.0,
    message: null,
  };
}

// Corruption fee multiplier - officials demand bigger cuts over time
export function corruptionFeeMultiplier(corruptionAssets: Asset[]): number {
  // Each corruption asset slightly increases the "greed" factor
  // Officials start demanding more once they know you're dependent on them
  const baseMultiplier = 1.0;
  const greedFactor = corruptionAssets.length * 0.03; // 3% per corruption asset

  return Math.min(1.3, baseMultiplier + greedFactor); // Cap at 30% increase
}

// Check for investigation triggers based on asset combinations
export function checkInvestigationTriggers(
  assets: Asset[],
  totalHeat: number
): Array<{
  trigger: string;
  heatIncrease: { legal: number; media: number; political: number };
  message: string;
}> {
  const triggers: Array<{
    trigger: string;
    heatIncrease: { legal: number; media: number; political: number };
    message: string;
  }> = [];

  // Trigger: Too many luxury assets purchased too quickly
  const luxuryAssets = assets.filter((a) => ['yacht', 'mansion', 'art'].includes(a.type));
  if (luxuryAssets.length >= 3 && totalHeat > 40) {
    triggers.push({
      trigger: 'luxury_spending',
      heatIncrease: { legal: 5, media: 10, political: 0 },
      message: 'El gasto excesivo en bienes de lujo ha llamado la atención de las autoridades fiscales.',
    });
  }

  // Trigger: Corruption in multiple countries
  const corruptionByCountry = new Map<string, number>();
  assets
    .filter((a) => a.type === 'politician' || a.type === 'judge' || a.type === 'police')
    .forEach((a) => {
      if (a.countryId) {
        corruptionByCountry.set(a.countryId, (corruptionByCountry.get(a.countryId) || 0) + 1);
      }
    });

  if (corruptionByCountry.size >= 3) {
    triggers.push({
      trigger: 'multi_country_corruption',
      heatIncrease: { legal: 10, media: 15, political: 20 },
      message: 'Tu red de corrupción internacional ha sido detectada. Investigaciones coordinadas comenzaron.',
    });
  }

  // Trigger: Storing too much money in assets
  const totalStored = assets.reduce((sum, a) => sum + (a.storedFunds || 0), 0);
  if (totalStored > 10000000 && totalHeat > 50) {
    triggers.push({
      trigger: 'asset_storage',
      heatIncrease: { legal: 8, media: 5, political: 0 },
      message: 'Las autoridades notaron patrones sospechosos de almacenamiento de fondos en activos.',
    });
  }

  return triggers;
}
