// Core game entities

export interface Country {
  id: string;
  name: string;
  secrecyScore: number; // TJN FSI score (0-100)
  riskLevel: number; // 1-10
  opacityBonus: number; // percentage multiplier
  availableMechanisms: string[];
  description: string;
  flagEmoji: string;
  coordinates: { lat: number; lng: number };
}

export interface Mechanism {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  setupTimeDays: number;
  launderCapacity: number; // per year
  heatGeneration: number; // percentage per $1M
  successRateLow: number; // 0-1, under low scrutiny
  successRateHigh: number; // 0-1, under high scrutiny
  requiredIntermediaries: string[];
  fees: {
    setup: number;
    annual: number;
    transaction: number; // percentage
  };
}

export interface Transaction {
  id: string;
  amount: number;
  sourceCountry: string;
  destinationCountry: string;
  mechanism: string;
  timestamp: number;
  fees: number;
  heatGenerated: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface Asset {
  id: string;
  type: 'yacht' | 'mansion' | 'art' | 'luxury_car' | 'rolex' | 'politician' | 'judge' | 'police' | 'bank_relationship';
  name: string;
  cost: number;
  heatReduction: number; // percentage reduction
  purchaseDate: number;
  // New fields for enhanced asset system
  currencyType?: 'clean' | 'dirty' | 'any'; // Which currency type can purchase this asset
  countryId?: string; // For per-country corruption assets
  maintenanceCost?: number; // Ongoing payments per game tick
  betrayalRisk?: number; // 0-100, risk of corruption asset betraying you
  passiveIncome?: number; // Income per game tick (for luxury assets)
  seizureRisk?: number; // 0-100, risk of asset being seized by authorities
  storedFunds?: number; // Funds stored in this asset (for money storage feature)
}

export interface Heat {
  legal: number; // 0-100
  media: number; // 0-100
  political: number; // 0-100
  total: number; // calculated average
}

export interface Objective {
  id: string;
  description: string;
  targets: {
    launderAmount?: number;
    buyAssets?: number;
    maxHeat?: number;
  };
  completed: boolean;
}

export type GameRole = 'multimillionaire' | 'cartel' | 'multinational';
export type GameStatus = 'tutorial' | 'playing' | 'won' | 'lost';
export type ScrutinyLevel = 'low' | 'high';

export interface GameState {
  // Player progress
  role: GameRole;
  totalFunds: number;
  launderedAmount: number;
  cleanFunds: number;

  // Heat system (multi-factor)
  heat: Heat;

  // Player inventory
  activeCountries: string[];
  activeMechanisms: string[];
  transactions: Transaction[];
  assets: Asset[];

  // Game progress
  tutorialComplete: boolean;
  currentObjective?: Objective;
  gameStatus: GameStatus;
  
  // Real case mode
  realCaseId?: string;
  realCaseMode?: boolean;
}
