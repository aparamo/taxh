import { z } from 'zod';

export const CountrySchema = z.object({
  id: z.string(),
  name: z.string(),
  secrecyScore: z.number().min(0).max(100),
  riskLevel: z.number().min(1).max(10),
  opacityBonus: z.number(),
  availableMechanisms: z.array(z.string()),
  description: z.string(),
  flagEmoji: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export const MechanismSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  baseCost: z.number().positive(),
  setupTimeDays: z.number().int().positive(),
  launderCapacity: z.number().positive(),
  heatGeneration: z.number().min(0),
  successRateLow: z.number().min(0).max(1),
  successRateHigh: z.number().min(0).max(1),
  requiredIntermediaries: z.array(z.string()),
  fees: z.object({
    setup: z.number().min(0),
    annual: z.number().min(0),
    transaction: z.number().min(0).max(1),
  }),
});

export const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  sourceCountry: z.string(),
  destinationCountry: z.string(),
  mechanism: z.string(),
  timestamp: z.number(),
  fees: z.number().min(0),
  heatGenerated: z.number().min(0),
  status: z.enum(['pending', 'completed', 'failed']),
});

export const AssetSchema = z.object({
  id: z.string(),
  type: z.enum(['yacht', 'mansion', 'art', 'luxury_car', 'rolex', 'politician', 'judge', 'police', 'bank_relationship']),
  name: z.string(),
  cost: z.number().positive(),
  heatReduction: z.number().min(0),
  purchaseDate: z.number(),
  // New fields for enhanced asset system
  currencyType: z.enum(['clean', 'dirty', 'any']).optional(),
  countryId: z.string().optional(),
  maintenanceCost: z.number().min(0).optional(),
  betrayalRisk: z.number().min(0).max(100).optional(),
  passiveIncome: z.number().min(0).optional(),
  seizureRisk: z.number().min(0).max(100).optional(),
  storedFunds: z.number().min(0).optional(),
});

export const HeatSchema = z.object({
  legal: z.number().min(0).max(100),
  media: z.number().min(0).max(100),
  political: z.number().min(0).max(100),
  total: z.number().min(0).max(100),
});

export const ObjectiveSchema = z.object({
  id: z.string(),
  description: z.string(),
  targets: z.object({
    launderAmount: z.number().optional(),
    buyAssets: z.number().optional(),
    maxHeat: z.number().optional(),
  }),
  completed: z.boolean(),
});

export const GameStateSchema = z.object({
  role: z.enum(['multimillionaire', 'cartel', 'multinational']),
  totalFunds: z.number(),
  launderedAmount: z.number().min(0),
  cleanFunds: z.number().min(0),
  heat: HeatSchema,
  activeCountries: z.array(z.string()),
  activeMechanisms: z.array(z.string()),
  transactions: z.array(TransactionSchema),
  assets: z.array(AssetSchema),
  tutorialComplete: z.boolean(),
  currentObjective: ObjectiveSchema.optional(),
  gameStatus: z.enum(['tutorial', 'playing', 'won', 'lost']),
});

// Validation helpers
export function validateTransactionInput(data: unknown) {
  return z
    .object({
      amount: z.number().positive(),
      sourceCountry: z.string(),
      destinationCountry: z.string(),
      mechanism: z.string(),
    })
    .parse(data);
}
