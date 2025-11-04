import { Objective, GameRole } from '../types';
import { getAllAssetTemplates } from './assets';

// Re-export for backwards compatibility
export const availableAssets = getAllAssetTemplates();

export const multimillionaireScenario = {
  id: 'multimillionaire-inheritance',
  role: 'multimillionaire' as const,
  title: 'Herencia No Declarada',
  description: `Tu tío, un exitoso empresario, falleció dejándote $5 millones en efectivo que mantuvo ocultos del fisco durante décadas. El dinero está en cajas de seguridad, pero necesitas legitimarlo antes de que las autoridades investiguen el patrimonio.
    
Tu abogado te ha sugerido varias opciones offshore para proteger y lavar estos fondos. Cada decisión tiene consecuencias - elegir países con alto secreto genera menos escrutinio pero más riesgo si se descubre. Los mecanismos más seguros cuestan más pero reducen el riesgo de detección.
    
Basado en casos reales como los revelados en Panama Papers y Paradise Papers.`,

  startingFunds: 5000000,
  startingHeat: {
    legal: 10,
    media: 5,
    political: 0,
    total: 5,
  },

  tutorialObjective: {
    id: 'tutorial-complete',
    description: 'Lava $3M, compra 2 activos, mantén heat total <60%',
    targets: {
      launderAmount: 3000000,
      buyAssets: 2,
      maxHeat: 60,
    },
    completed: false,
  } as Objective,

  hints: [
    'Las Islas Vírgenes Británicas tienen alta confidencialidad pero más riesgo de filtración',
    'Suiza ofrece banca privada respetable pero con mayor escrutinio internacional',
    'Los fideicomisos son más seguros que las sociedades fantasma, pero cuestan más',
    'Cada transacción genera "heat" - vigila los niveles de riesgo legal, mediático y político',
    'Usar directores nominales reduce el rastreo pero aumenta significativamente el riesgo',
  ],
};

// Cartel Role Scenarios
export const cartelScenario = {
  id: 'cartel-drug-trafficking',
  role: 'cartel' as const,
  title: 'Organización de Tráfico de Drogas',
  description: `Tu organización ha acumulado $10 millones en efectivo de ventas de drogas ilícitas. El dinero está en cajas fuertes pero necesitas moverlo rápidamente antes de que las autoridades te encuentren.
    
Tienes conexiones en Panamá y los Emiratos Árabes Unidos, pero necesitas estructurar el flujo mediante comercio y banca corresponsal. El volumen es alto y el tiempo es limitado - cada día que pasa aumenta el riesgo.
    
Basado en casos reales como el Russian Laundromat y redes de lavado de dinero documentadas por Global Financial Integrity.`,

  startingFunds: 10000000,
  startingHeat: {
    legal: 25,
    media: 10,
    political: 15,
    total: 16.67,
  },

  tutorialObjective: {
    id: 'cartel-tutorial',
    description: 'Lava $8M, mantén heat total <70%',
    targets: {
      launderAmount: 8000000,
      buyAssets: 1,
      maxHeat: 70,
    },
    completed: false,
  } as Objective,

  hints: [
    'El lavado basado en comercio permite mover grandes volúmenes rápidamente',
    'Los Emiratos Árabes Unidos tienen alto secreto pero cuidado con el escrutinio internacional',
    'La banca corresponsal puede procesar mucho dinero pero genera alto heat',
    'Mantén el heat bajo - los carteles atraen más atención de las autoridades',
    'Considera usar múltiples países para fragmentar el rastro',
  ],
};

export const cartelCryptocurrencyScenario = {
  id: 'cartel-cryptocurrency',
  role: 'cartel' as const,
  title: 'Cartel - Criptomonedas',
  description: `Tu organización ha acumulado $15 millones en efectivo y criptomonedas. Necesitas mezclar ambos flujos para legitimar los fondos mientras evades el rastreo blockchain.
    
El uso de criptomonedas añade una capa de complejidad pero también velocidad. Las autoridades están mejorando su capacidad de rastreo, así que necesitas estructuras tradicionales también.
    
Basado en casos reales de lavado de dinero mediante criptomonedas documentados por cadenas de investigación.`,

  startingFunds: 15000000,
  startingHeat: {
    legal: 30,
    media: 15,
    political: 10,
    total: 18.33,
  },

  tutorialObjective: {
    id: 'cartel-crypto-tutorial',
    description: 'Lava $12M, mantén heat total <75%',
    targets: {
      launderAmount: 12000000,
      buyAssets: 2,
      maxHeat: 75,
    },
    completed: false,
  } as Objective,

  hints: [
    'Las criptomonedas generan más heat inicial pero permiten transferencias rápidas',
    'Necesitas convertir crypto a efectivo mediante estructuras tradicionales',
    'El heat puede aumentar rápidamente - vigílalo constantemente',
    'Usa múltiples jurisdicciones para fragmentar el rastro',
    'Considera invertir en activos que reduzcan el heat',
  ],
};

// Multinational Role Scenarios
export const multinationalScenario = {
  id: 'multinational-tax-optimization',
  role: 'multinational' as const,
  title: 'Optimización Fiscal Corporativa',
  description: `Tu corporación multinacional tiene $50 millones en beneficios que necesitas optimizar fiscalmente. Aunque son operaciones legales, buscas minimizar impuestos mediante estructuras internacionales.
    
Tienes filiales en múltiples países y puedes usar precios de transferencia y estructuras de propiedad beneficial. El escrutinio es menor que para el crimen organizado, pero las autoridades fiscales están alerta.
    
Basado en casos reales como LuxLeaks, Double Irish, y estructuras reveladas en Paradise Papers.`,

  startingFunds: 50000000,
  startingHeat: {
    legal: 5,
    media: 2,
    political: 0,
    total: 2.33,
  },

  tutorialObjective: {
    id: 'multinational-tutorial',
    description: 'Optimiza $40M, mantén heat total <40%',
    targets: {
      launderAmount: 40000000,
      buyAssets: 3,
      maxHeat: 40,
    },
    completed: false,
  } as Objective,

  hints: [
    'Los precios de transferencia son efectivos para mover beneficios entre jurisdicciones',
    'Luxemburgo e Irlanda ofrecen estructuras favorables para multinacionales',
    'La propiedad beneficial opaca puede proteger tus estructuras',
    'Mantén el heat bajo - las empresas legítimas atraen menos escrutinio',
    'Considera estructuras en Países Bajos como país conducto',
  ],
};

export const multinationalRealEstateScenario = {
  id: 'multinational-real-estate',
  role: 'multinational' as const,
  title: 'Multinacional - Inversión Inmobiliaria',
  description: `Tu corporación tiene $75 millones en beneficios que quieres invertir en bienes raíces internacionales. Necesitas estructurar las inversiones para minimizar impuestos y maximizar el retorno.
    
El mercado inmobiliario ofrece oportunidades de inversión legítima pero también puede servir para mover grandes sumas. Las estructuras de propiedad beneficial son clave.
    
Basado en casos reales de inversión inmobiliaria offshore documentados en Paradise Papers y Pandora Papers.`,

  startingFunds: 75000000,
  startingHeat: {
    legal: 8,
    media: 3,
    political: 2,
    total: 4.33,
  },

  tutorialObjective: {
    id: 'multinational-re-tutorial',
    description: 'Optimiza $60M, mantén heat total <45%',
    targets: {
      launderAmount: 60000000,
      buyAssets: 4,
      maxHeat: 45,
    },
    completed: false,
  } as Objective,

  hints: [
    'Los bienes raíces pueden ser una forma legítima de mover dinero',
    'Usa estructuras de propiedad beneficial para ocultar la propiedad real',
    'Delaware ofrece incorporación rápida y barata',
    'El heat se mantiene bajo con inversiones legítimas',
    'Considera múltiples jurisdicciones para diversificar',
  ],
};

// Multimillionaire Variation
export const multimillionaireArtScenario = {
  id: 'multimillionaire-art-market',
  role: 'multimillionaire' as const,
  title: 'Multimillonario - Mercado del Arte',
  description: `Tienes $3 millones en efectivo que quieres legitimar mediante el mercado del arte. Las transacciones de arte son difíciles de rastrear debido a valores subjetivos y mercados opacos.
    
El arte es un activo de lujo que puede servir tanto para lavado como para inversión. Sin embargo, las autoridades están aumentando el escrutinio sobre transacciones de arte de alto valor.
    
Basado en casos reales de lavado de dinero mediante arte documentados por investigaciones internacionales.`,

  startingFunds: 3000000,
  startingHeat: {
    legal: 8,
    media: 8,
    political: 0,
    total: 5.33,
  },

  tutorialObjective: {
    id: 'multimillionaire-art-tutorial',
    description: 'Lava $2M, compra 2 activos de arte, mantén heat total <55%',
    targets: {
      launderAmount: 2000000,
      buyAssets: 2,
      maxHeat: 55,
    },
    completed: false,
  } as Objective,

  hints: [
    'El arte es difícil de rastrear pero genera más escrutinio mediático',
    'Los valores del arte son subjetivos - útil para justificar transacciones',
    'Considera usar fideicomisos para proteger colecciones',
    'El heat mediático puede aumentar con transacciones de arte muy visibles',
    'Usa estructuras opacas para ocultar la propiedad',
  ],
};

// Helper functions
export function getScenarioById(id: string) {
  const scenarios = [
    multimillionaireScenario,
    cartelScenario,
    cartelCryptocurrencyScenario,
    multinationalScenario,
    multinationalRealEstateScenario,
    multimillionaireArtScenario,
  ];
  return scenarios.find((s) => s.id === id);
}

export function getScenariosByRole(role: GameRole) {
  const scenarios = [
    multimillionaireScenario,
    cartelScenario,
    cartelCryptocurrencyScenario,
    multinationalScenario,
    multinationalRealEstateScenario,
    multimillionaireArtScenario,
  ];
  return scenarios.filter((s) => s.role === role);
}

export function getDefaultScenario(role: GameRole) {
  switch (role) {
    case 'multimillionaire':
      return multimillionaireScenario;
    case 'cartel':
      return cartelScenario;
    case 'multinational':
      return multinationalScenario;
    default:
      return multimillionaireScenario;
  }
}
