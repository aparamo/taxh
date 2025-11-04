import { Asset } from '../types';

// Calculate total passive income from luxury assets
export function calculatePassiveIncome(assets: Asset[]): number {
  return assets
    .filter((asset) => asset.passiveIncome && asset.passiveIncome > 0)
    .reduce((total, asset) => total + (asset.passiveIncome || 0), 0);
}

// Calculate total maintenance costs for corruption assets
export function calculateMaintenanceCosts(assets: Asset[]): number {
  return assets
    .filter((asset) => asset.maintenanceCost && asset.maintenanceCost > 0)
    .reduce((total, asset) => total + (asset.maintenanceCost || 0), 0);
}

// Check if an asset should be seized based on heat and asset's seizure risk
export function shouldSeizeAsset(asset: Asset, totalHeat: number): boolean {
  if (!asset.seizureRisk || asset.seizureRisk === 0) return false;

  // Base chance is seizureRisk, but increases dramatically with heat
  const baseChance = asset.seizureRisk;
  const heatMultiplier = 1 + (totalHeat / 100) * 2; // Up to 3x at 100% heat
  const finalChance = Math.min(95, baseChance * heatMultiplier);

  // Random check
  const roll = Math.random() * 100;
  return roll < finalChance;
}

// Store money in an asset (convert funds to stored value)
export function storeMoneyInAsset(asset: Asset, amount: number): {
  success: boolean;
  message: string;
  newStoredFunds: number;
} {
  // Only luxury assets can store money
  if (!['yacht', 'mansion', 'art'].includes(asset.type)) {
    return {
      success: false,
      message: 'Solo los activos de lujo pueden almacenar fondos.',
      newStoredFunds: asset.storedFunds || 0,
    };
  }

  const currentStored = asset.storedFunds || 0;
  const newStoredFunds = currentStored + amount;

  // Limit: can't store more than asset cost * 2
  const maxStorage = (asset.cost || 0) * 2;
  if (newStoredFunds > maxStorage) {
    return {
      success: false,
      message: `No puedes almacenar más de ${maxStorage.toLocaleString()} en este activo.`,
      newStoredFunds: currentStored,
    };
  }

  return {
    success: true,
    message: `Almacenaste $${amount.toLocaleString()} en ${asset.name}.`,
    newStoredFunds,
  };
}

// Liquidate an asset (sell it back at a loss)
export function liquidateAsset(asset: Asset): {
  refundAmount: number;
  loseStoredFunds: boolean;
  message: string;
} {
  // Get refund (lose 30% of value)
  const refundAmount = Math.floor((asset.cost || 0) * 0.7);
  const loseStoredFunds = (asset.storedFunds || 0) > 0;
  const storedAmount = asset.storedFunds || 0;

  let message = `Vendiste ${asset.name} por $${refundAmount.toLocaleString()}`;
  if (loseStoredFunds) {
    message += `. PERO perdiste $${storedAmount.toLocaleString()} en fondos almacenados.`;
  }

  return {
    refundAmount,
    loseStoredFunds,
    message,
  };
}
