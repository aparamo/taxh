import { GameState } from '../types';
import { getMechanismById } from '../data/mechanisms';
import { getCountryById } from '../data/countries';

export function canAffordTransaction(
  amount: number,
  mechanismId: string,
  availableFunds: number
): { canAfford: boolean; reason?: string } {
  const mechanism = getMechanismById(mechanismId);
  if (!mechanism) {
    return { canAfford: false, reason: 'Mecanismo no válido' };
  }
  
  const setupFee = mechanism.fees.setup;
  const transactionFee = amount * mechanism.fees.transaction;
  const totalCost = setupFee + transactionFee + amount;
  
  if (availableFunds < totalCost) {
    return {
      canAfford: false,
      reason: `Fondos insuficientes. Necesitas $${totalCost.toLocaleString()} pero tienes $${availableFunds.toLocaleString()}`,
    };
  }
  
  return { canAfford: true };
}

export function canPurchaseAsset(
  assetCost: number,
  availableFunds: number
): { canPurchase: boolean; reason?: string } {
  if (availableFunds < assetCost) {
    return {
      canPurchase: false,
      reason: `Fondos insuficientes. Necesitas $${assetCost.toLocaleString()}`,
    };
  }
  
  return { canPurchase: true };
}

export function isMechanismAvailableInCountry(
  mechanismId: string,
  countryId: string
): boolean {
  const country = getCountryById(countryId);
  if (!country) return false;
  
  return country.availableMechanisms.includes(mechanismId);
}

export function checkObjectiveCompletion(
  objective: GameState['currentObjective'],
  state: GameState
): boolean {
  if (!objective || objective.completed) return false;
  
  const { targets } = objective;
  let completed = true;
  
  if (targets.launderAmount !== undefined) {
    completed = completed && state.launderedAmount >= targets.launderAmount;
  }
  
  if (targets.buyAssets !== undefined) {
    completed = completed && state.assets.length >= targets.buyAssets;
  }
  
  if (targets.maxHeat !== undefined) {
    completed = completed && state.heat.total <= targets.maxHeat;
  }
  
  return completed;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
