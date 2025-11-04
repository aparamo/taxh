import { Mechanism, Country, ScrutinyLevel, GameRole } from '../types';
import { getMechanismById } from '../data/mechanisms';
import { getCountryById } from '../data/countries';
import { formatCurrency } from './validation';

export function calculateTransactionFees(
  amount: number,
  mechanism: Mechanism
): number {
  const setupFee = mechanism.fees.setup;
  const transactionFee = amount * mechanism.fees.transaction;
  return setupFee + transactionFee;
}

export function calculateHeatGeneration(
  amount: number,
  mechanism: Mechanism,
  country: Country,
  scrutinyLevel: ScrutinyLevel,
  role?: GameRole
): { legal: number; media: number; political: number; total: number } {
  // Base heat per $1M laundered
  const baseHeat = mechanism.heatGeneration * (amount / 1000000);
  
  // Country modifier (higher opacity = lower heat)
  const countryModifier = 1 - country.opacityBonus;
  
  // Scrutiny modifier
  const scrutinyModifier = scrutinyLevel === 'high' ? 1.5 : 1;
  
  // Role modifier
  let roleModifier = 1;
  if (role === 'cartel') {
    roleModifier = 1.25; // Cartel generates 25% more heat
  } else if (role === 'multinational') {
    roleModifier = 0.7; // Multinational generates 30% less heat (legitimate business)
  }
  
  // Total base heat
  const totalBaseHeat = baseHeat * countryModifier * scrutinyModifier * roleModifier;
  
  // Distribute heat across factors
  // Legal transactions primarily generate legal heat
  let distribution;
  if (mechanism.id === 'shell-company') {
    distribution = { legal: 0.6, media: 0.3, political: 0.1 };
  } else if (mechanism.id === 'trust') {
    distribution = { legal: 0.5, media: 0.4, political: 0.1 };
  } else if (mechanism.id === 'nominee-director') {
    distribution = { legal: 0.7, media: 0.2, political: 0.1 };
  } else {
    distribution = { legal: 0.4, media: 0.4, political: 0.2 };
  }
  
  const legal = totalBaseHeat * distribution.legal;
  const media = totalBaseHeat * distribution.media;
  const political = totalBaseHeat * distribution.political;
  const total = (legal + media + political) / 3;
  
  return { legal, media, political, total };
}

export function determineTransactionSuccess(
  mechanism: Mechanism,
  scrutinyLevel: ScrutinyLevel
): boolean {
  const successRate = scrutinyLevel === 'low' 
    ? mechanism.successRateLow 
    : mechanism.successRateHigh;
  
  return Math.random() < successRate;
}

export function determineScrutinyLevel(
  totalHeat: number,
  countryRiskLevel: number
): ScrutinyLevel {
  // Higher heat + higher risk country = high scrutiny
  const heatFactor = totalHeat > 50 ? 1.2 : totalHeat > 30 ? 1.0 : 0.8;
  const riskFactor = countryRiskLevel > 7 ? 1.2 : countryRiskLevel > 5 ? 1.0 : 0.8;
  
  const scrutinyScore = heatFactor * riskFactor;
  return scrutinyScore > 1.1 ? 'high' : 'low';
}

export function processTransaction(
  amount: number,
  mechanismId: string,
  countryId: string,
  currentHeat: number,
  role?: GameRole
): {
  success: boolean;
  fees: number;
  heatGenerated: { legal: number; media: number; political: number; total: number };
  launderedAmount: number;
  scrutinyLevel: ScrutinyLevel;
} {
  const mechanism = getMechanismById(mechanismId);
  const country = getCountryById(countryId);
  
  if (!mechanism || !country) {
    throw new Error('Mecanismo o país no válido');
  }
  
  // Check if mechanism is available in country
  if (!country.availableMechanisms.includes(mechanismId)) {
    const mechanismName = mechanism?.name || mechanismId;
    throw new Error(`El mecanismo "${mechanismName}" no está disponible en ${country.name}`);
  }
  
  // Apply role-specific capacity modifiers
  let effectiveCapacity = mechanism.launderCapacity;
  if (role === 'cartel') {
    effectiveCapacity = mechanism.launderCapacity * 1.3; // Cartel has 30% more capacity
  }
  
  // Check capacity
  if (amount > effectiveCapacity) {
    throw new Error(`La cantidad excede la capacidad del mecanismo (${formatCurrency(effectiveCapacity)})`);
  }
  
  const scrutinyLevel = determineScrutinyLevel(currentHeat, country.riskLevel);
  const fees = calculateTransactionFees(amount, mechanism);
  const heatGenerated = calculateHeatGeneration(amount, mechanism, country, scrutinyLevel, role);
  const success = determineTransactionSuccess(mechanism, scrutinyLevel);
  
  return {
    success,
    fees,
    heatGenerated,
    launderedAmount: success ? amount - fees : 0,
    scrutinyLevel,
  };
}
