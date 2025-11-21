import { Objective, GameRole } from '../types';
import { getAllAssetTemplates } from './assets';

// Re-export for backwards compatibility
export const availableAssets = getAllAssetTemplates();

export const multimillionaireScenario = {
  id: 'multimillionaire-inheritance',
  role: 'multimillionaire' as const,
  title: 'Herencia No Declarada',
  description: `Tu tío, un exitoso empresario que operaba en el sector inmobiliario, falleció repentinamente dejándote $5 millones en efectivo que mantuvo ocultos del fisco durante más de dos décadas. El dinero está almacenado en cajas de seguridad en tres países diferentes, pero necesitas legitimarlo rápidamente antes de que las autoridades fiscales investiguen el patrimonio familiar.
    
Tu abogado, especializado en estructuras offshore, te ha sugerido varias opciones para proteger y lavar estos fondos. Cada decisión tiene consecuencias estratégicas: elegir países con alto secreto bancario (como las Islas Vírgenes Británicas o Panamá) genera menos escrutinio inicial pero mayor riesgo de filtración si se descubre. Los mecanismos más seguros y respetables (como fideicomisos en Suiza o Jersey) cuestan significativamente más pero reducen el riesgo de detección a largo plazo.
    
El desafío: necesitas mover el dinero sin generar demasiado "heat" (atención de autoridades), mientras mantienes los costos bajo control. Las transacciones grandes atraen más atención, pero fragmentar demasiado aumenta los costos de configuración.
    
Basado en casos reales documentados en Panama Papers (2016) y Paradise Papers (2017), donde miles de individuos de alto patrimonio utilizaron estructuras offshore para ocultar y legitimar fondos heredados o no declarados.`,

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
    'Las Islas Vírgenes Británicas (BVI) tienen alta confidencialidad (FSI 61) y costos bajos, pero fueron expuestas masivamente en Panama Papers - mayor riesgo de filtración futura',
    'Suiza ofrece banca privada respetable y discreta, pero con mayor escrutinio internacional desde 2018 - ideal para montos medianos',
    'Los fideicomisos (trusts) son más seguros y legítimos que las sociedades fantasma, pero cuestan 2-3x más en setup y mantenimiento',
    'Cada transacción genera "heat" distribuido entre legal, mediático y político - vigila especialmente el heat legal que puede activar investigaciones',
    'Usar directores nominales reduce el rastreo inicial pero aumenta significativamente el riesgo de traición - solo para operaciones de corto plazo',
    'Considera comprar activos de lujo (yates, arte) para almacenar fondos limpios y reducir heat mediante inversiones legítimas',
    'El heat total debe mantenerse bajo 60% para evitar investigaciones - usa países con alta opacidad para reducir heat por transacción',
  ],
};

// Cartel Role Scenarios
export const cartelScenario = {
  id: 'cartel-drug-trafficking',
  role: 'cartel' as const,
  title: 'Organización de Tráfico de Drogas',
  description: `Tu organización criminal ha acumulado $10 millones en efectivo de ventas de drogas ilícitas durante los últimos 6 meses. El dinero está almacenado en cajas fuertes distribuidas en múltiples ubicaciones, pero necesitas moverlo rápidamente antes de que las autoridades antidrogas te encuentren.
    
Tienes conexiones establecidas en Panamá (para sociedades offshore) y los Emiratos Árabes Unidos (para banca privada), pero necesitas estructurar el flujo mediante mecanismos de alto volumen como comercio internacional y banca corresponsal. El volumen es alto y el tiempo es crítico - cada día que pasa aumenta el riesgo de detección y confiscación.
    
El desafío: los carteles generan 20% más heat que otros roles, y las transacciones grandes atraen atención inmediata. Necesitas balancear velocidad (mover el dinero rápido) con discreción (mantener el heat bajo). Los mecanismos de alto volumen como banca corresponsal pueden procesar mucho dinero rápidamente, pero generan heat significativo.
    
Basado en casos reales documentados como el Russian Laundromat (2010-2014, $20.8 mil millones lavados) y redes de lavado de dinero de carteles documentadas por Global Financial Integrity y la DEA.`,

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
    'El lavado basado en comercio (trade-based ML) permite mover grandes volúmenes rápidamente mediante facturas falsas - ideal para carteles',
    'Los Emiratos Árabes Unidos tienen alto secreto bancario (FSI 58) pero cuidado con el escrutinio internacional desde 2020 - usa para montos medianos',
    'La banca corresponsal puede procesar $50M+ por transacción pero genera 0.09% heat por $1M - solo para operaciones urgentes',
    'Mantén el heat total bajo 70% - los carteles generan 20% más heat que otros roles y atraen más atención de autoridades',
    'Considera usar múltiples países para fragmentar el rastro - Panamá para setup, EAU para banca, Singapur para comercio',
    'Los activos de corrupción (políticos, jueces) pueden reducir heat pero tienen riesgo de traición - úsalos estratégicamente',
    'El heat legal es especialmente peligroso para carteles - prioriza mecanismos con bajo heat legal como trusts',
  ],
};

export const cartelCryptocurrencyScenario = {
  id: 'cartel-cryptocurrency',
  role: 'cartel' as const,
  title: 'Cartel - Criptomonedas',
  description: `Tu organización criminal ha acumulado $15 millones en efectivo y criptomonedas (principalmente Bitcoin y Monero) de ventas de drogas y otras actividades ilícitas. Necesitas mezclar ambos flujos para legitimar los fondos mientras evades el rastreo blockchain y las autoridades.
    
El uso de criptomonedas añade una capa de complejidad pero también velocidad - las transferencias son instantáneas y pueden cruzar fronteras sin intermediarios bancarios. Sin embargo, las autoridades (FBI, Europol, Chainalysis) están mejorando constantemente su capacidad de rastreo blockchain, especialmente para Bitcoin. Necesitas estructuras tradicionales (sociedades offshore, banca privada) para convertir crypto a efectivo limpio.
    
El desafío: las criptomonedas generan más heat inicial (especialmente heat mediático) porque son asociadas con actividades ilícitas. Necesitas balancear la velocidad de las transferencias crypto con la necesidad de estructuras tradicionales para legitimación. Los mixers y tumblers pueden ayudar pero aumentan el heat legal.
    
Basado en casos reales de lavado de dinero mediante criptomonedas documentados por cadenas de investigación como Chainalysis, y casos de carteles que utilizaron Bitcoin para mover fondos antes de convertirlos a efectivo mediante estructuras offshore.`,

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
  description: `Tu corporación multinacional tecnológica tiene $50 millones en beneficios generados en jurisdicciones de alto impuesto que necesitas optimizar fiscalmente mediante estructuras internacionales. Aunque son operaciones legales (no lavado de dinero), buscas minimizar impuestos corporativos mediante estructuras de propiedad beneficial y precios de transferencia.
    
Tienes filiales operativas en múltiples países (Estados Unidos, Reino Unido, Alemania) y puedes usar mecanismos legales como precios de transferencia, estructuras de propiedad beneficial, y países conducto (conduit countries) para mover beneficios a jurisdicciones de bajo impuesto. El escrutinio es menor que para el crimen organizado, pero las autoridades fiscales (IRS, HMRC, BZSt) están cada vez más alerta desde las filtraciones de LuxLeaks y Paradise Papers.
    
El desafío: necesitas estructurar las operaciones para minimizar impuestos sin cruzar la línea hacia evasión fiscal agresiva. Las multinacionales generan 25% menos heat que otros roles, pero el heat político puede aumentar si las estructuras se vuelven demasiado agresivas. Los activos corporativos (oficinas, patentes, subsidiarias) son esenciales para justificar las estructuras.
    
Basado en casos reales documentados como LuxLeaks (2014, estructuras en Luxemburgo), Double Irish (Apple, 1990s-2015), y estructuras corporativas reveladas en Paradise Papers (2017).`,

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
    'Los precios de transferencia (transfer pricing) son efectivos para mover beneficios entre jurisdicciones - usa para justificar flujos de dinero',
    'Luxemburgo (FSI 58) e Irlanda ofrecen estructuras favorables para multinacionales con bajos impuestos corporativos - ideales para IP y servicios',
    'La propiedad beneficial opaca puede proteger tus estructuras - usa sociedades en BVI o Panamá como holding',
    'Mantén el heat total bajo 40% - las empresas legítimas generan 25% menos heat pero el heat político puede escalar rápidamente',
    'Considera estructuras en Países Bajos como país conducto (conduit) - bajo impuesto y alta aceptabilidad legal',
    'Los activos corporativos (oficinas, patentes, subsidiarias) son esenciales - justifican las estructuras y reducen heat',
    'El heat político es especialmente relevante para multinacionales - estructuras demasiado agresivas pueden generar presión regulatoria',
    'Usa Delaware para incorporación rápida y barata de holding companies - $500 setup, alta aceptabilidad',
  ],
};

export const multinationalRealEstateScenario = {
  id: 'multinational-real-estate',
  role: 'multinational' as const,
  title: 'Multinacional - Inversión Inmobiliaria',
  description: `Tu corporación multinacional tiene $75 millones en beneficios que quieres invertir en bienes raíces internacionales de alto valor (Londres, Nueva York, Dubai, Singapur). Necesitas estructurar las inversiones para minimizar impuestos, maximizar el retorno, y ocultar la propiedad real mediante estructuras de propiedad beneficial.
    
El mercado inmobiliario ofrece oportunidades de inversión legítima pero también puede servir para mover grandes sumas de dinero de forma discreta. Las estructuras de propiedad beneficial (sociedades offshore que poseen propiedades) son clave para ocultar la propiedad real y minimizar impuestos de transferencia y ganancias de capital. Los registros de propiedad pública pueden revelar la propiedad, pero las estructuras complejas pueden retrasar o prevenir la identificación.
    
El desafío: las inversiones inmobiliarias grandes atraen atención de autoridades fiscales y medios. Necesitas estructurar las compras mediante múltiples sociedades para fragmentar la propiedad y reducir el perfil. Los activos inmobiliarios también pueden generar ingresos pasivos (rentas) que necesitan ser estructurados fiscalmente.
    
Basado en casos reales de inversión inmobiliaria offshore documentados en Paradise Papers (2017) y Pandora Papers (2021), incluyendo el caso de Isabel dos Santos (Luanda Leaks) que adquirió propiedades de lujo en múltiples países mediante estructuras opacas.`,

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
  description: `Tienes $3 millones en efectivo no declarado que quieres legitimar mediante el mercado del arte de alta gama. Las transacciones de arte son tradicionalmente difíciles de rastrear debido a valores subjetivos, mercados opacos, y la falta de regulación en muchas jurisdicciones. Sin embargo, las autoridades están aumentando el escrutinio sobre transacciones de arte de alto valor desde 2020.
    
El arte es un activo de lujo que puede servir tanto para lavado como para inversión legítima. Los freeports (almacenes libres de impuestos) en Ginebra, Singapur y Delaware almacenan billones en arte sin revelar propietarios. El arte puede ser usado como colateral para préstamos, permitiendo acceso a fondos "limpios" sin vender los activos. Sin embargo, los registros de ventas en casas de subasta y los préstamos colateralizados pueden ser rastreados.
    
El desafío: el mercado del arte genera más heat mediático que otros activos porque las transacciones de alto valor son noticiables. Necesitas estructurar las compras mediante fideicomisos o sociedades offshore para ocultar la propiedad, y considerar almacenar el arte en freeports para evitar impuestos y escrutinio.
    
Basado en casos reales de lavado de dinero mediante arte documentados por investigaciones internacionales, incluyendo el uso de freeports para almacenar arte sin revelar propietarios, y casos donde el arte fue usado como colateral para préstamos que proporcionaron acceso a fondos "limpios".`,

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
