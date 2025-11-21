import { Asset } from '../types';

// Asset templates - corruption assets are instantiated per-country
export type AssetTemplate = Omit<Asset, 'id' | 'purchaseDate' | 'countryId'> & {
  description: string; // Description for displaying in UI
  isCorruption?: boolean; // True for politician, judge, police
};

export const luxuryAssets: AssetTemplate[] = [
  {
    type: 'yacht',
    name: 'Yate de Lujo',
    cost: 5000000,
    heatReduction: -8, // INCREASES heat (generates suspicion)
    description: 'Aumenta heat general 8%. Demuestra tu riqueza ostentosa a todos. Te hace sentir como un "winner" y personas que buscan el dinero te caen por montones. Fácil de transportar pero muy visible.',
    currencyType: 'clean', // Only clean money can buy luxury assets
    passiveIncome: 50000, // $50k per game tick
    seizureRisk: 15, // Base seizure risk
    storedFunds: 0,
  },
  {
    type: 'mansion',
    name: 'Mansión',
    cost: 3000000,
    heatReduction: -5, // INCREASES heat (generates suspicion)
    description: 'Aumenta heat general 5%. Tu símbolo de éxito es imposible de ocultar. Almacén de valor pero atrae miradas sospechosas de autoridades fiscales. Las fiestas exclusivas aumentan tu "prestigio".',
    currencyType: 'clean',
    passiveIncome: 30000, // $30k per game tick
    seizureRisk: 20, // Higher risk (real estate easier to seize)
    storedFunds: 0,
  },
  {
    type: 'art',
    name: 'Colección de Arte',
    cost: 2000000,
    heatReduction: -3, // INCREASES heat (generates suspicion)
    description: 'Aumenta heat general 3%. Tu "buen gusto" llama la atención en subastas internacionales. Fácil de transportar pero difícil explicar el origen de fondos para estas piezas. Los críticos de arte te admiran (o envidian).',
    currencyType: 'clean',
    passiveIncome: 20000, // $20k per game tick (appreciation)
    seizureRisk: 10, // Lower risk (harder to prove ownership)
    storedFunds: 0,
  },
  {
    type: 'luxury_car',
    name: 'Auto de Lujo',
    cost: 150000,
    heatReduction: -2, // INCREASES heat (generates suspicion)
    description: 'Aumenta heat general 2%. Tu vehículo de lujo en las calles genera envidia y sospechas. Fácil de liquidar pero difícil de ocultar de las autoridades.',
    currencyType: 'clean',
    passiveIncome: 0, // No passive income for cars
    seizureRisk: 30, // Higher risk (easier to track and seize vehicles)
    storedFunds: 0,
  },
  {
    type: 'rolex',
    name: 'Rolex',
    cost: 50000,
    heatReduction: -1, // INCREASES heat (generates suspicion)
    description: 'Aumenta heat general 1%. Tu reloj de lujo llama la atención en reuniones sociales. Fácil de transportar y ocultar, pero demuestra que tienes más dinero del que declaras.',
    currencyType: 'clean',
    passiveIncome: 0, // No passive income for watches
    seizureRisk: 5, // Very low risk (easy to hide)
    storedFunds: 0,
  },
];

// Corruption assets - these are templates, instantiated per-country
export const corruptionAssetTemplates: AssetTemplate[] = [
  {
    type: 'politician',
    name: 'Comprar Político',
    cost: 500000,
    heatReduction: 10,
    description: 'Reduce heat político 10% en un país. Protección contra investigaciones.',
    currencyType: 'any', // Can use clean or dirty money
    maintenanceCost: 50000, // $50k per game tick
    betrayalRisk: 25, // Base betrayal risk
    isCorruption: true,
  },
  {
    type: 'judge',
    name: 'Comprar Juez',
    cost: 1000000,
    heatReduction: 15,
    description: 'Reduce heat legal 15%. Protección contra procesos judiciales.',
    currencyType: 'any',
    maintenanceCost: 100000, // $100k per game tick
    betrayalRisk: 15, // Lower risk (judges are more reliable than politicians)
    isCorruption: true,
  },
  {
    type: 'police',
    name: 'Comprar Policía',
    cost: 300000,
    heatReduction: 5,
    description: 'Reduce heat legal 5%. Avisos tempranos de investigaciones.',
    currencyType: 'any',
    maintenanceCost: 30000, // $30k per game tick
    betrayalRisk: 35, // Higher risk (police are more unpredictable)
    isCorruption: true,
  },
];

// Infrastructure assets
export const infrastructureAssets: AssetTemplate[] = [
  {
    type: 'bank_relationship',
    name: 'Mejorar Relación Bancaria',
    cost: 200000,
    heatReduction: 0,
    description: 'Reduce comisiones 10% y desbloquea acceso a banca privada premium.',
    currencyType: 'any',
    passiveIncome: 0,
    seizureRisk: 0,
  },
];

// Corporate assets for Multinational role
export const corporateAssets: AssetTemplate[] = [
  {
    type: 'corporate_office',
    name: 'Oficina Corporativa Offshore',
    cost: 10000000,
    heatReduction: 2, // Reduces heat (legitimate business structure)
    description: 'Oficina corporativa en jurisdicción offshore. Reduce heat 2% y genera ingresos pasivos. Estructura legítima para operaciones internacionales.',
    currencyType: 'clean', // Corporate profits are clean
    passiveIncome: 100000, // $100k per game tick
    seizureRisk: 5, // Low risk (legitimate structure)
    storedFunds: 0,
  },
  {
    type: 'patent_portfolio',
    name: 'Portafolio de Patentes',
    cost: 25000000,
    heatReduction: 3, // Reduces heat (IP holding)
    description: 'Portafolio de propiedad intelectual en jurisdicción de baja tributación. Reduce heat 3% y permite precios de transferencia agresivos. Estructura común para multinacionales tecnológicas.',
    currencyType: 'clean',
    passiveIncome: 150000, // $150k per game tick (royalties)
    seizureRisk: 2, // Very low risk (IP is intangible)
    storedFunds: 0,
  },
  {
    type: 'offshore_subsidiary',
    name: 'Filial Offshore',
    cost: 50000000,
    heatReduction: 1, // Reduces heat (tax optimization structure)
    description: 'Filial corporativa en paraíso fiscal para optimización fiscal. Reduce heat 1% y permite estructuras de precios de transferencia. Base para operaciones internacionales.',
    currencyType: 'clean',
    passiveIncome: 200000, // $200k per game tick
    seizureRisk: 8, // Moderate risk (can be investigated)
    storedFunds: 0,
  },
  {
    type: 'distribution_network',
    name: 'Red de Distribución',
    cost: 30000000,
    heatReduction: 0, // No heat reduction (facilitates trade-based ML)
    description: 'Red de distribución internacional para facilitar comercio. Permite lavado basado en comercio y justifica flujos financieros. Estructura común para multinacionales.',
    currencyType: 'clean',
    passiveIncome: 120000, // $120k per game tick
    seizureRisk: 10, // Higher risk (can be used for trade-based ML)
    storedFunds: 0,
  },
  {
    type: 'data_center',
    name: 'Centro de Datos',
    cost: 40000000,
    heatReduction: 1, // Reduces heat (infrastructure investment)
    description: 'Centro de datos en jurisdicción favorable. Reduce heat 1% y genera ingresos pasivos. Inversión en infraestructura legítima.',
    currencyType: 'clean',
    passiveIncome: 180000, // $180k per game tick
    seizureRisk: 5, // Low risk (infrastructure)
    storedFunds: 0,
  },
];

// Helper to create country-specific corruption asset
export function createCorruptionAsset(
  template: AssetTemplate,
  countryId: string
): Omit<Asset, 'id' | 'purchaseDate'> {
  return {
    ...template,
    name: `${template.name} (${countryId})`, // e.g., "Comprar Político (bvi)"
    countryId,
  };
}

// Get all available asset templates
export function getAllAssetTemplates(): AssetTemplate[] {
  return [...luxuryAssets, ...corruptionAssetTemplates, ...infrastructureAssets, ...corporateAssets];
}

// Get corruption templates
export function getCorruptionTemplates(): AssetTemplate[] {
  return corruptionAssetTemplates;
}
