import { Mechanism } from '../types';

export const mechanisms: Mechanism[] = [
  {
    id: 'shell-company',
    name: 'Sociedad Fantasma',
    description: 'Entidad legal sin operaciones reales utilizada para ocultar la propiedad y origen de fondos. Mecanismo más común y accesible.',
    baseCost: 5000,
    setupTimeDays: 1,
    launderCapacity: 5000000, // $5M per year
    heatGeneration: 0.45, // +0.45% per $1M laundered (reduced for balance)
    successRateLow: 0.85, // 85% under low scrutiny
    successRateHigh: 0.40, // 40% under high scrutiny
    requiredIntermediaries: ['lawyer', 'registered_agent'],
    fees: {
      setup: 5000,
      annual: 1500,
      transaction: 0.02, // 2% per transaction
    },
  },
  {
    id: 'trust',
    name: 'Fideicomiso',
    description: 'Estructura legal para proteger activos y ocultar beneficiarios finales. Mayor seguridad pero costos más altos.',
    baseCost: 15000,
    setupTimeDays: 7,
    launderCapacity: 10000000, // $10M per year
    heatGeneration: 0.3, // +0.3% per $1M (lower risk)
    successRateLow: 0.90, // 90% under low scrutiny
    successRateHigh: 0.65, // 65% under high scrutiny
    requiredIntermediaries: ['trustee', 'lawyer'],
    fees: {
      setup: 15000,
      annual: 5000,
      transaction: 0.01, // 1% per transaction
    },
  },
  {
    id: 'nominee-director',
    name: 'Director Nominal',
    description: 'Testaferro que firma documentos en nombre de la entidad para ocultar el control real. Riesgo alto pero bajo costo inicial.',
    baseCost: 3000,
    setupTimeDays: 1,
    launderCapacity: 0, // Doesn't launder directly, enhances other mechanisms
    heatGeneration: 0.7, // +0.7% per use (higher risk)
    successRateLow: 0.80, // 80% under low scrutiny
    successRateHigh: 0.35, // 35% under high scrutiny
    requiredIntermediaries: ['nominee_service', 'lawyer'],
    fees: {
      setup: 3000,
      annual: 2500,
      transaction: 0, // No transaction fee
    },
  },
  {
    id: 'transfer-pricing',
    name: 'Precios de Transferencia',
    description: 'Grupos multinacionales fijan precios para transacciones intragrupo. Al ubicar propiedad intelectual en jurisdicciones de baja tributación, se cargan regalías a filiales en países de alta tributación.',
    baseCost: 50000,
    setupTimeDays: 30,
    launderCapacity: 50000000, // $50M per year (high capacity)
    heatGeneration: 0.4, // +0.4% per $1M
    successRateLow: 0.70, // 70% under low scrutiny
    successRateHigh: 0.45, // 45% under high scrutiny
    requiredIntermediaries: ['tax_consultant', 'lawyer'],
    fees: {
      setup: 50000,
      annual: 20000,
      transaction: 0.10, // 10% of tax savings (complex structure)
    },
  },
  {
    id: 'trade-based-ml',
    name: 'Lavado Basado en Comercio',
    description: 'Manipulación de comercio exterior mediante sobre/subfacturación, múltiples facturas y triangulación. Se justifican flujos financieros mediante documentación aduanera adulterada.',
    baseCost: 20000,
    setupTimeDays: 14,
    launderCapacity: 20000000, // $20M per year
    heatGeneration: 0.7, // +0.7% per $1M (high risk, reduced for balance)
    successRateLow: 0.65, // 65% under low scrutiny
    successRateHigh: 0.30, // 30% under high scrutiny
    requiredIntermediaries: ['trading_company', 'customs_broker'],
    fees: {
      setup: 20000,
      annual: 10000,
      transaction: 0.05, // 5% per transaction
    },
  },
  {
    id: 'correspondent-banking',
    name: 'Banca Corresponsal',
    description: 'Bancos locales mantienen cuentas en bancos extranjeros para procesar pagos internacionales. Delitos financieros explotan bancos pequeños con controles laxos para acceder al sistema en USD/EUR.',
    baseCost: 100000,
    setupTimeDays: 60,
    launderCapacity: 100000000, // $100M per year (very high capacity)
    heatGeneration: 0.09, // +0.09% per $1M (0.9% per $10M - very high risk)
    successRateLow: 0.60, // 60% under low scrutiny
    successRateHigh: 0.25, // 25% under high scrutiny
    requiredIntermediaries: ['correspondent_bank', 'local_bank'],
    fees: {
      setup: 100000,
      annual: 50000,
      transaction: 0.03, // 3% per transaction
    },
  },
  {
    id: 'beneficial-ownership',
    name: 'Propiedad Beneficial Opaca',
    description: 'Estructuras legales que ocultan la propiedad real mediante capas de entidades, fideicomisos y directores nominales. Hace difícil rastrear a los beneficiarios finales.',
    baseCost: 25000,
    setupTimeDays: 21,
    launderCapacity: 15000000, // $15M per year
    heatGeneration: 0.35, // +0.35% per $1M (low risk)
    successRateLow: 0.75, // 75% under low scrutiny
    successRateHigh: 0.50, // 50% under high scrutiny
    requiredIntermediaries: ['lawyer', 'corporate_service'],
    fees: {
      setup: 25000,
      annual: 8000,
      transaction: 0.015, // 1.5% per transaction
    },
  },
];

export function getMechanismById(id: string): Mechanism | undefined {
  return mechanisms.find(m => m.id === id);
}

export function getMechanismsByCountry(): Mechanism[] {
  return mechanisms.filter(() => {
    // This will be checked against country.availableMechanisms
    return true; // All mechanisms are available, filtered by country
  });
}
