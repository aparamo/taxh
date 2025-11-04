import { Asset } from '../types';

// Get all corruption assets in a specific country
export function getCorruptionInCountry(assets: Asset[], countryId: string): Asset[] {
  return assets.filter(
    (asset) =>
      (asset.type === 'politician' ||
        asset.type === 'judge' ||
        asset.type === 'police') &&
      asset.countryId === countryId
  );
}

// Calculate betrayal chance based on asset and current heat
export function calculateBetrayalChance(
  asset: Asset,
  currentHeat: { total: number; legal: number; media: number; political: number }
): number {
  if (!asset.betrayalRisk) return 0;

  const baseRisk = asset.betrayalRisk;
  
  // Heat multiplier: higher heat = higher betrayal chance
  const heatMultiplier = 1 + (currentHeat.total / 100) * 0.5; // Up to 1.5x at 100% heat
  
  // Type-specific multipliers
  let typeMultiplier = 1;
  if (asset.type === 'politician' && currentHeat.political > 50) {
    typeMultiplier = 1.3; // Politicians more likely to betray under political pressure
  } else if (asset.type === 'police' && currentHeat.legal > 60) {
    typeMultiplier = 1.4; // Police more likely to betray under legal pressure
  }
  
  const finalRisk = Math.min(100, baseRisk * heatMultiplier * typeMultiplier);
  return Math.round(finalRisk);
}

// Trigger a betrayal event - returns consequences
export function triggerBetrayal(
  asset: Asset
): {
  heatSpike: { legal: number; media: number; political: number };
  message: string;
  loseStoredFunds: boolean;
} {
  let heatSpike = { legal: 0, media: 0, political: 0 };
  let message = '';

  if (asset.type === 'politician') {
    heatSpike = { legal: 15, media: 20, political: 25 };
    message = `El político que compraste en ${asset.countryId} te traicionó. Reveló tu información a las autoridades.`;
  } else if (asset.type === 'judge') {
    heatSpike = { legal: 30, media: 10, political: 5 };
    message = `El juez que compraste te traicionó. Ordenó una investigación profunda sobre tus actividades.`;
  } else if (asset.type === 'police') {
    heatSpike = { legal: 20, media: 15, political: 10 };
    message = `El oficial de policía que compraste te traicionó. Informó a sus superiores sobre tus operaciones.`;
  }

  // Lose stored funds if any
  const loseStoredFunds = (asset.storedFunds || 0) > 0;

  return {
    heatSpike,
    message,
    loseStoredFunds,
  };
}
