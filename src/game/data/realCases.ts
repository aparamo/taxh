import { GameRole } from '../types';

export interface HistoricalStep {
  step: number;
  year: number;
  action: string;
  country: string;
  mechanism: string;
  amount: number;
  outcome: string;
}

export interface AdvisorHint {
  trigger: string; // e.g., "after_first_transaction", "when_heat_>30"
  hint: string; // Corrupt advisor suggestion
  historicalContext: string; // What actually happened
}

export interface RealCase {
  id: string;
  name: string;
  protagonist: string;
  role: GameRole;
  period: string;
  totalAmount: number;
  summary: string;
  
  // Starting funds configuration
  startingFunds: number;
  startingCleanFunds: number;
  startingDirtyFunds: number;
  
  // Case-specific filtering (two-tier approach)
  coreCountries: string[]; // Historically used, highlighted
  secondaryCountries: string[]; // Contextually relevant
  coreMechanisms: string[]; // Historically used
  secondaryMechanisms: string[]; // Contextually relevant
  recommendedAssets: string[]; // Assets appropriate for this case
  
  // Historical path
  historicalSteps: HistoricalStep[];
  
  // Advisor hints (shown at key moments)
  advisorHints: AdvisorHint[];
  
  finalOutcome: {
    caught: boolean;
    amountLost: number;
    consequences: string;
  };
}

export const realCases: RealCase[] = [
  {
    id: 'jho-low-1mdb',
    name: 'El Esquema 1MDB',
    protagonist: 'Jho Low',
    role: 'multimillionaire',
    period: '2009-2015',
    totalAmount: 4500000000,
    summary: 'Jho Low orquestó uno de los mayores escándalos de lavado de dinero, embelezando $4.5 mil millones del fondo soberano 1MDB de Malasia.',
    
    // Starting funds
    startingFunds: 50000000,
    startingCleanFunds: 5000000,
    startingDirtyFunds: 45000000,
    
    // Case-specific filtering
    coreCountries: ['malaysia', 'singapore', 'bvi'],
    secondaryCountries: ['switzerland', 'usa', 'cayman', 'uae'],
    coreMechanisms: ['shell-company', 'correspondent-banking'],
    secondaryMechanisms: ['trust', 'beneficial-ownership'],
    recommendedAssets: ['yacht', 'mansion', 'art', 'bank_relationship', 'politician'],
    
    historicalSteps: [
      {
        step: 1,
        year: 2009,
        action: 'Creación de sociedades offshore en BVI y Singapur',
        country: 'bvi',
        mechanism: 'shell-company',
        amount: 50000000,
        outcome: 'Sociedades creadas exitosamente para recibir fondos',
      },
      {
        step: 2,
        year: 2012,
        action: 'Transferencia de fondos a través de múltiples jurisdicciones',
        country: 'singapore',
        mechanism: 'correspondent-banking',
        amount: 1000000000,
        outcome: 'Fondos movidos exitosamente a cuentas personales',
      },
      {
        step: 3,
        year: 2013,
        action: 'Compra de yate Equanimity ($250M)',
        country: 'switzerland',
        mechanism: 'shell-company',
        amount: 250000000,
        outcome: 'Yate adquirido para demostrar riqueza',
      },
      {
        step: 4,
        year: 2014,
        action: 'Inversiones en bienes raíces de lujo y arte',
        country: 'usa',
        mechanism: 'beneficial-ownership',
        amount: 500000000,
        outcome: 'Activos adquiridos pero comienzan investigaciones',
      },
      {
        step: 5,
        year: 2015,
        action: 'Filtraciones revelan el esquema',
        country: 'malaysia',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'Investigaciones internacionales, confiscación de activos',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Mi consejo: Diversifica en 3 jurisdicciones mínimo. Los grandes players nunca ponen todos los huevos en una canasta. BVI, Singapur y Suiza ofrecen diferentes ventajas.',
        historicalContext: 'Jho Low utilizó múltiples jurisdicciones (BVI, Singapur, Suiza, USA) para dispersar fondos y dificultar el rastreo.',
      },
      {
        trigger: 'when_heat_>30',
        hint: 'Este monto llamará atención. En casos similares, dividieron en 5 transacciones menores. Pero también puedes acelerar - el riesgo puede valer la pena.',
        historicalContext: 'Jho Low realizó transferencias grandes ($1B+) que eventualmente llamaron la atención de las autoridades.',
      },
      {
        trigger: 'after_luxury_purchase',
        hint: 'Los yates son símbolos de éxito, pero también son difíciles de ocultar. Considera arte y propiedades más discretas si quieres mantener perfil bajo.',
        historicalContext: 'El yate Equanimity de $250M fue uno de los activos más visibles y eventualmente fue confiscado por autoridades malasias.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 2500000000,
      consequences: 'Jho Low es buscado internacionalmente. $2.5B en activos confiscados. Múltiples países abren investigaciones criminales. Goldman Sachs pagó $3.9B en multas.',
    },
  },
  
  {
    id: 'isabel-dos-santos',
    name: 'Luanda Leaks',
    protagonist: 'Isabel dos Santos',
    role: 'multimillionaire',
    period: '2010-2020',
    totalAmount: 2000000000,
    summary: 'Isabel dos Santos, hija del ex presidente de Angola, acumuló $2+ mil millones a través de contratos estatales y estructuras offshore.',
    
    // Starting funds
    startingFunds: 100000000,
    startingCleanFunds: 20000000,
    startingDirtyFunds: 80000000,
    
    // Case-specific filtering
    coreCountries: ['malta', 'netherlands', 'angola'],
    secondaryCountries: ['uk', 'uae', 'switzerland', 'bvi'],
    coreMechanisms: ['shell-company', 'correspondent-banking'],
    secondaryMechanisms: ['beneficial-ownership', 'trust'],
    recommendedAssets: ['mansion', 'art', 'politician', 'bank_relationship'],
    
    historicalSteps: [
      {
        step: 1,
        year: 2010,
        action: 'Creación de sociedades en Malta y Países Bajos',
        country: 'netherlands',
        mechanism: 'shell-company',
        amount: 100000000,
        outcome: 'Estructuras creadas para recibir contratos estatales',
      },
      {
        step: 2,
        year: 2012,
        action: 'Transferencias desde Angola a través de Malta',
        country: 'malta',
        mechanism: 'correspondent-banking',
        amount: 500000000,
        outcome: 'Fondos movidos exitosamente',
      },
      {
        step: 3,
        year: 2015,
        action: 'Compra de propiedades en Londres, París, Dubai',
        country: 'uk',
        mechanism: 'beneficial-ownership',
        amount: 300000000,
        outcome: 'Portafolio inmobiliario de lujo establecido',
      },
      {
        step: 4,
        year: 2020,
        action: 'Filtración de Luanda Leaks expone el esquema',
        country: 'angola',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'Propiedades congeladas, investigación internacional',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Malta y Países Bajos ofrecen excelente combinación: secreto bancario con acceso a Europa. Perfecto para operaciones de mediana escala.',
        historicalContext: 'Isabel dos Santos utilizó Malta y Países Bajos como centros intermedios antes de mover fondos a propiedades en Europa.',
      },
      {
        trigger: 'when_clean_funds_>500M',
        hint: 'Con este nivel de fondos, es hora de diversificar en activos reales. Propiedades en Londres y París mantienen valor y ofrecen prestigio.',
        historicalContext: 'Isabel dos Santos invirtió en propiedades de lujo en Londres, París y Dubai valoradas en cientos de millones.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 1000000000,
      consequences: 'Propiedades congeladas en múltiples países. Isabel dos Santos enfrenta investigaciones en Angola y Portugal. Banco angoleño Sonangol intervenido.',
    },
  },
  
  {
    id: 'apple-tax-structure',
    name: 'Optimización Fiscal Corporativa',
    protagonist: 'Apple Inc.',
    role: 'multinational',
    period: '1991-presente',
    totalAmount: 100000000000,
    summary: 'Apple utilizó estructuras fiscales complejas en Irlanda y Países Bajos para minimizar impuestos globalmente, ahorrando billones en impuestos.',
    
    // Starting funds
    startingFunds: 500000000,
    startingCleanFunds: 500000000,
    startingDirtyFunds: 0,
    
    // Case-specific filtering
    coreCountries: ['ireland', 'netherlands', 'usa'],
    secondaryCountries: ['luxembourg', 'delaware', 'singapore'],
    coreMechanisms: ['transfer-pricing', 'beneficial-ownership'],
    secondaryMechanisms: ['shell-company', 'trust'],
    recommendedAssets: ['bank_relationship'], // Will add corporate assets in Phase 4
    
    historicalSteps: [
      {
        step: 1,
        year: 1991,
        action: 'Establecimiento de subsidiaria en Irlanda',
        country: 'ireland',
        mechanism: 'transfer-pricing',
        amount: 5000000000,
        outcome: 'Estructura base establecida',
      },
      {
        step: 2,
        year: 2004,
        action: 'Implementación de "Double Irish" y "Dutch Sandwich"',
        country: 'netherlands',
        mechanism: 'transfer-pricing',
        amount: 50000000000,
        outcome: 'Reducción masiva de impuestos corporativos',
      },
      {
        step: 3,
        year: 2013,
        action: 'Investigación del Senado de EE.UU.',
        country: 'usa',
        mechanism: 'transfer-pricing',
        amount: 0,
        outcome: 'Presión pública, pero estructura legal',
      },
      {
        step: 4,
        year: 2016,
        action: 'UE ordena a Apple pagar $14.5B en impuestos atrasados',
        country: 'ireland',
        mechanism: 'transfer-pricing',
        amount: 14500000000,
        outcome: 'Lucha legal en curso, Apple apela',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Para corporaciones multinacionales, Irlanda es el paraíso. Tasa corporativa del 12.5% y estructuras "Double Irish" permiten minimizar impuestos globalmente.',
        historicalContext: 'Apple estableció operaciones en Irlanda desde 1991, aprovechando la baja tasa corporativa y estructuras fiscales favorables.',
      },
      {
        trigger: 'when_clean_funds_>1B',
        hint: 'El "Dutch Sandwich" permite mover ganancias sin pagar impuestos. Países Bajos actúa como intermediario entre Irlanda y otros destinos. Legal pero agresivo.',
        historicalContext: 'Apple implementó el "Double Irish Dutch Sandwich", moviendo ganancias a través de Países Bajos sin pagar impuestos.',
      },
    ],
    
    finalOutcome: {
      caught: false,
      amountLost: 14500000000,
      consequences: 'Apple enfrenta multa de $14.5B de la UE pero apela. La estructura sigue siendo legal. Reformas fiscales internacionales en discusión.',
    },
  },

  {
    id: 'hsbc-drug-money',
    name: 'El Escándalo HSBC: Lavado de Dinero del Narcotráfico',
    protagonist: 'HSBC Bank',
    role: 'cartel',
    period: '2006-2010',
    totalAmount: 881000000,
    summary: 'HSBC facilitó el lavado de al menos $881 millones en ganancias de narcotráfico para carteles mexicanos, procesando miles de millones más a través de su subsidiaria en Estados Unidos. El banco recibió una multa récord de $1.9 mil millones.',
    
    // Starting funds
    startingFunds: 50000000,
    startingCleanFunds: 5000000,
    startingDirtyFunds: 45000000,
    
    // Case-specific filtering
    coreCountries: ['usa', 'switzerland', 'uk'],
    secondaryCountries: ['cayman', 'panama', 'singapore', 'uae'],
    coreMechanisms: ['correspondent-banking', 'trade-based-ml'],
    secondaryMechanisms: ['shell-company', 'beneficial-ownership'],
    recommendedAssets: ['bank_relationship', 'politician', 'police'],
    
    historicalSteps: [
      {
        step: 1,
        year: 2006,
        action: 'Carteles mexicanos comienzan a usar sucursales de HSBC en México',
        country: 'usa',
        mechanism: 'correspondent-banking',
        amount: 100000000,
        outcome: 'Millones de dólares en efectivo depositados en sucursales de HSBC México',
      },
      {
        step: 2,
        year: 2007,
        action: 'Transferencias masivas a través de banca corresponsal a Estados Unidos',
        country: 'usa',
        mechanism: 'correspondent-banking',
        amount: 200000000,
        outcome: 'Fondos movidos a través del sistema bancario estadounidense sin controles adecuados',
      },
      {
        step: 3,
        year: 2008,
        action: 'Uso de comercio para justificar transferencias (sobrefacturación)',
        country: 'panama',
        mechanism: 'trade-based-ml',
        amount: 300000000,
        outcome: 'Documentación comercial falsa para justificar flujos financieros',
      },
      {
        step: 4,
        year: 2010,
        action: 'Auditorías internas revelan deficiencias masivas en controles AML',
        country: 'usa',
        mechanism: 'correspondent-banking',
        amount: 0,
        outcome: 'HSBC admite fallas sistémicas pero continúa operaciones',
      },
      {
        step: 5,
        year: 2012,
        action: 'Investigación del Senado de EE.UU. y multa récord de $1.9B',
        country: 'usa',
        mechanism: 'correspondent-banking',
        amount: 1900000000,
        outcome: 'HSBC admite culpa pero ningún ejecutivo va a prisión. Acuerdo de enjuiciamiento diferido.',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'La banca corresponsal es perfecta para mover grandes volúmenes. HSBC México movió $7 mil millones en efectivo a través de sucursales estadounidenses. Los bancos grandes tienen "capacidad" ilimitada si sabes cómo usarla.',
        historicalContext: 'HSBC procesó miles de millones en efectivo de carteles mexicanos a través de su subsidiaria estadounidense, violando múltiples leyes de lavado de dinero.',
      },
      {
        trigger: 'when_heat_>40',
        hint: 'A este nivel, necesitas protección. Los bancos grandes tienen "relaciones" con autoridades. Pero también son objetivos grandes. Considera diversificar a jurisdicciones más opacas.',
        historicalContext: 'HSBC fue investigado por el Senado de EE.UU. pero evitó cargos penales mediante un acuerdo de enjuiciamiento diferido, pagando $1.9B en multas.',
      },
      {
        trigger: 'after_luxury_purchase',
        hint: 'Para carteles, los activos de lujo son riesgosos. Mejor invertir en relaciones bancarias y protección. Los yates llaman demasiada atención de autoridades.',
        historicalContext: 'A diferencia de multimillonarios individuales, los carteles evitan activos visibles. HSBC ayudó a mover fondos sin compras ostentosas que llamaran atención.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 1900000000,
      consequences: 'HSBC pagó multa récord de $1.9B pero ningún ejecutivo fue a prisión. El banco admitió fallas sistémicas en controles de lavado de dinero. Miles de millones adicionales procesados para países bajo sanciones. El caso expuso cómo los bancos grandes facilitan el narcotráfico globalmente.',
    },
  },

  {
    id: 'hsbc-swiss-leaks',
    name: 'Swiss Leaks: El Banco Secreto de HSBC',
    protagonist: 'HSBC Suiza',
    role: 'multimillionaire',
    period: '2005-2007',
    totalAmount: 100000000000,
    summary: 'HSBC Suiza ayudó a más de 100,000 clientes a evadir impuestos y ocultar activos, con más de $100 mil millones en cuentas. Los datos filtrados revelaron la escala masiva de evasión fiscal facilitada por el banco.',
    
    // Starting funds
    startingFunds: 10000000,
    startingCleanFunds: 1000000,
    startingDirtyFunds: 9000000,
    
    // Case-specific filtering
    coreCountries: ['switzerland', 'uk', 'luxembourg'],
    secondaryCountries: ['singapore', 'ireland', 'uae', 'panama'],
    coreMechanisms: ['trust', 'shell-company', 'beneficial-ownership'],
    secondaryMechanisms: ['correspondent-banking'],
    recommendedAssets: ['art', 'mansion', 'bank_relationship'],
    
    historicalSteps: [
      {
        step: 1,
        year: 2005,
        action: 'Clientes ricos abren cuentas secretas en HSBC Suiza',
        country: 'switzerland',
        mechanism: 'trust',
        amount: 50000000,
        outcome: 'Cuentas bancarias secretas establecidas para ocultar activos',
      },
      {
        step: 2,
        year: 2006,
        action: 'Creación de sociedades offshore para estructurar activos',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 200000000,
        outcome: 'Estructuras complejas para ocultar propiedad real',
      },
      {
        step: 3,
        year: 2007,
        action: 'Uso de fideicomisos y propiedad beneficial opaca',
        country: 'switzerland',
        mechanism: 'beneficial-ownership',
        amount: 500000000,
        outcome: 'Capas múltiples de entidades dificultan el rastreo',
      },
      {
        step: 4,
        year: 2008,
        action: 'Hervé Falciani, empleado de HSBC, roba datos de clientes',
        country: 'switzerland',
        mechanism: 'trust',
        amount: 0,
        outcome: 'Fuga masiva de datos: 100,000+ clientes y $100B+ expuestos',
      },
      {
        step: 5,
        year: 2015,
        action: 'ICIJ publica Swiss Leaks: revelación global',
        country: 'uk',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'Investigaciones en múltiples países, algunas cuentas cerradas',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Suiza sigue siendo el estándar de oro para discreción bancaria. Aunque la cooperación internacional ha aumentado, las estructuras complejas siguen funcionando. Combina con fideicomisos y sociedades offshore.',
        historicalContext: 'HSBC Suiza manejó más de $100 mil millones en activos ocultos para clientes de todo el mundo, utilizando estructuras complejas para evitar la transparencia.',
      },
      {
        trigger: 'when_clean_funds_>100M',
        hint: 'Con este nivel de fondos, es hora de diversificar. Suiza es excelente, pero combina con otros centros financieros. Las colecciones de arte y propiedades son buenos almacenes de valor.',
        historicalContext: 'Los clientes de HSBC Suiza incluyeron políticos, empresarios y celebridades que ocultaron cientos de millones en activos.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 0, // No multa directa, pero investigaciones en múltiples países
      consequences: 'Swiss Leaks expuso $100B+ en activos ocultos. Múltiples países iniciaron investigaciones. Algunos clientes enfrentaron cargos por evasión fiscal. HSBC evitó cargos penales pero su reputación quedó dañada. El caso aceleró reformas internacionales de transparencia bancaria.',
    },
  },

  {
    id: 'danske-bank-estonia',
    name: 'El Escándalo de Lavado de Dinero de Danske Bank',
    protagonist: 'Danske Bank',
    role: 'multinational',
    period: '2007-2015',
    totalAmount: 230000000000,
    summary: 'La sucursal de Danske Bank en Estonia procesó $230 mil millones en transacciones sospechosas, principalmente de clientes rusos y de antiguos países soviéticos. El caso expuso controles AML completamente fallidos.',
    
    // Starting funds
    startingFunds: 100000000,
    startingCleanFunds: 10000000,
    startingDirtyFunds: 90000000,
    
    // Case-specific filtering
    coreCountries: ['malta', 'uk', 'switzerland'],
    secondaryCountries: ['luxembourg', 'panama', 'singapore', 'ireland'],
    coreMechanisms: ['correspondent-banking', 'shell-company'],
    secondaryMechanisms: ['trade-based-ml', 'beneficial-ownership'],
    recommendedAssets: ['bank_relationship'],
    
    historicalSteps: [
      {
        step: 1,
        year: 2007,
        action: 'Sucursal en Malta comienza a procesar transacciones de clientes no residentes',
        country: 'malta',
        mechanism: 'correspondent-banking',
        amount: 10000000000,
        outcome: 'Flujo masivo de fondos desde Rusia y antiguos países soviéticos',
      },
      {
        step: 2,
        year: 2010,
        action: 'Sociedades offshore utilizadas para estructurar transferencias',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 50000000000,
        outcome: 'Miles de sociedades creadas para mover fondos',
      },
      {
        step: 3,
        year: 2013,
        action: 'Alerta interna sobre $230B en transacciones sospechosas',
        country: 'malta',
        mechanism: 'correspondent-banking',
        amount: 0,
        outcome: 'La gerencia ignora las advertencias y continúa operaciones',
      },
      {
        step: 4,
        year: 2017,
        action: 'Whistleblower revela el escándalo públicamente',
        country: 'malta',
        mechanism: 'correspondent-banking',
        amount: 0,
        outcome: 'Investigaciones en Dinamarca, Malta y Estados Unidos',
      },
      {
        step: 5,
        year: 2018,
        action: 'Danske Bank cierra sucursal de Malta y admite fallas masivas',
        country: 'malta',
        mechanism: 'correspondent-banking',
        amount: 0,
        outcome: 'Multas y sanciones en múltiples países. CEO renuncia.',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Malta es perfecta para movimientos desde Rusia y antiguos países soviéticos. La banca corresponsal permite procesar volúmenes masivos. Pero necesitas controles laxos - busca bancos con "capacidad" alta.',
        historicalContext: 'Danske Bank Estonia procesó $230 mil millones en transacciones sospechosas, principalmente de clientes rusos, con controles AML completamente inadecuados.',
      },
      {
        trigger: 'when_heat_>50',
        hint: 'A este nivel de heat, las alertas internas comienzan. Pero si el banco depende de las comisiones, pueden ignorar las advertencias. Es un juego de riesgo - cuanto más mueves, más ganan todos.',
        historicalContext: 'Danske Bank recibió múltiples alertas internas sobre las transacciones sospechosas pero las ignoró durante años, priorizando las ganancias sobre el cumplimiento.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 0, // Multas posteriores, pero el caso principal fue sobre volumen
        consequences: 'Danske Bank procesó $230B en transacciones sospechosas. El CEO renunció. Multas en múltiples países. El banco cerró su sucursal de Estonia. El caso expuso cómo los bancos priorizan ganancias sobre controles de lavado de dinero. Investigaciones criminales continúan. (Nota: En el juego, Estonia se representa como Malta, país similar de la UE con acceso a mercados europeos)',
    },
  },

  {
    id: 'wirecard-scandal',
    name: 'El Fraude de Wirecard',
    protagonist: 'Wirecard AG',
    role: 'multinational',
    period: '2015-2020',
    totalAmount: 1900000000,
    summary: 'Wirecard, una empresa fintech alemana, cometió un fraude masivo de €1.9 mil millones, falsificando ingresos y ocultando pérdidas durante años. El escándalo llevó a la quiebra de la empresa y reveló fallas regulatorias masivas.',
    
    // Starting funds
    startingFunds: 50000000,
    startingCleanFunds: 5000000,
    startingDirtyFunds: 45000000,
    
    // Case-specific filtering
    coreCountries: ['singapore', 'panama', 'uk'],
    secondaryCountries: ['ireland', 'switzerland', 'uae', 'luxembourg'],
    coreMechanisms: ['shell-company', 'correspondent-banking', 'trade-based-ml'],
    secondaryMechanisms: ['beneficial-ownership'],
    recommendedAssets: ['bank_relationship'],
    
    historicalSteps: [
      {
        step: 1,
        year: 2015,
        action: 'Creación de sociedades offshore para falsificar ingresos',
        country: 'singapore',
        mechanism: 'shell-company',
        amount: 200000000,
        outcome: 'Sociedades ficticias reportan ingresos falsos a Wirecard',
      },
      {
        step: 2,
        year: 2017,
        action: 'Uso de banca corresponsal para mover fondos ficticios',
        country: 'panama',
        mechanism: 'correspondent-banking',
        amount: 500000000,
        outcome: 'Transferencias simuladas a través de bancos en Panamá',
      },
      {
        step: 3,
        year: 2019,
        action: 'Periodistas financieros investigan cuentas faltantes',
        country: 'singapore',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'Financial Times expone irregularidades contables masivas',
      },
      {
        step: 4,
        year: 2020,
        action: 'Admisión de €1.9B en efectivo que nunca existió',
        country: 'uk',
        mechanism: 'correspondent-banking',
        amount: 1900000000,
        outcome: 'Wirecard admite que las cuentas en Panamá no existen',
      },
      {
        step: 5,
        year: 2020,
        action: 'Quiebra y arrestos de ejecutivos',
        country: 'uk',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'CEO y otros ejecutivos arrestados. Empresa entra en quiebra.',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Para corporaciones, las sociedades offshore pueden "crear" ingresos en papel. Pero necesitas que los auditores no verifiquen demasiado. Singapur y Panamá ofrecen opacidad suficiente si sabes cómo estructurarlo.',
        historicalContext: 'Wirecard creó sociedades offshore ficticias que reportaban ingresos falsos, y utilizó bancos en Filipinas para simular transferencias que nunca ocurrieron. (Nota: En el juego, Filipinas se representa como Panamá)',
      },
      {
        trigger: 'when_heat_>60',
        hint: 'A este nivel, los periodistas financieros comienzan a investigar. Los auditores externos pueden querer verificar cuentas bancarias reales. Es hora de consolidar o encontrar una salida.',
        historicalContext: 'Financial Times investigó Wirecard durante años, exponiendo las irregularidades. Los auditores externos finalmente intentaron verificar cuentas que no existían.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 1900000000,
        consequences: 'Wirecard colapsó en quiebra tras admitir que €1.9B en efectivo nunca existió. El CEO Markus Braun fue arrestado. El caso expuso fallas regulatorias masivas en Alemania y la UE. Inversores perdieron miles de millones. El escándalo llevó a reformas en supervisión financiera. (Nota: En el juego, Alemania se representa como Reino Unido, centro financiero europeo similar)',
    },
  },

  {
    id: 'panama-papers',
    name: 'Panama Papers: El Escándalo de Mossack Fonseca',
    protagonist: 'Mossack Fonseca',
    role: 'multimillionaire',
    period: '1977-2016',
    totalAmount: 20000000000,
    summary: 'La filtración de 11.5 millones de documentos del bufete panameño Mossack Fonseca reveló cómo políticos, empresarios y celebridades de todo el mundo utilizaron sociedades offshore para ocultar activos y evadir impuestos.',
    
    // Starting funds
    startingFunds: 5000000,
    startingCleanFunds: 1000000,
    startingDirtyFunds: 4000000,
    
    // Case-specific filtering
    coreCountries: ['panama', 'bvi', 'switzerland'],
    secondaryCountries: ['cayman', 'singapore', 'uk', 'luxembourg'],
    coreMechanisms: ['shell-company', 'nominee-director', 'beneficial-ownership'],
    secondaryMechanisms: ['trust', 'correspondent-banking'],
    recommendedAssets: ['bank_relationship', 'politician', 'judge'],
    
    historicalSteps: [
      {
        step: 1,
        year: 1977,
        action: 'Mossack Fonseca abre oficina en Panamá',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 1000000,
        outcome: 'Bufete establecido para crear sociedades offshore',
      },
      {
        step: 2,
        year: 2000,
        action: 'Expansión a BVI y otras jurisdicciones offshore',
        country: 'bvi',
        mechanism: 'shell-company',
        amount: 50000000,
        outcome: 'Miles de sociedades creadas para clientes globales',
      },
      {
        step: 3,
        year: 2010,
        action: 'Uso de directores nominales para ocultar beneficiarios',
        country: 'panama',
        mechanism: 'nominee-director',
        amount: 200000000,
        outcome: 'Estructuras complejas dificultan el rastreo',
      },
      {
        step: 4,
        year: 2015,
        action: 'Filtración masiva de documentos internos',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 0,
        outcome: '11.5 millones de documentos expuestos por whistleblower',
      },
      {
        step: 5,
        year: 2016,
        action: 'Publicación de Panama Papers por ICIJ',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'Investigaciones globales, dimisiones de líderes mundiales',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Panamá es el paraíso de las sociedades offshore. Mossack Fonseca creó más de 200,000 sociedades aquí. BVI y Panamá son la combinación perfecta: secreto + velocidad.',
        historicalContext: 'Mossack Fonseca creó más de 200,000 sociedades offshore en Panamá y BVI para clientes de todo el mundo, incluyendo políticos, empresarios y celebridades.',
      },
      {
        trigger: 'when_heat_>30',
        hint: 'Los directores nominales son clave. Sin ellos, cualquiera puede rastrear quién controla realmente la sociedad. Usa siempre un director nominal para mayor protección.',
        historicalContext: 'Mossack Fonseca utilizó directores nominales para ocultar la propiedad real de las sociedades, dificultando el rastreo de beneficiarios finales.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 0,
      consequences: 'Panama Papers expusieron 214,000 sociedades offshore. Múltiples líderes mundiales dimitieron (Islandia, Pakistán). Investigaciones en 79 países. Mossack Fonseca cerró en 2018. El caso aceleró reformas globales de transparencia financiera y eliminó el secreto bancario en muchos paraísos fiscales.',
    },
  },

  {
    id: 'pandora-papers',
    name: 'Pandora Papers: La Filtración Masiva',
    protagonist: 'Líderes Mundiales',
    role: 'multimillionaire',
    period: '1996-2021',
    totalAmount: 100000000000,
    summary: 'Los Pandora Papers expusieron las operaciones offshore de más de 330 políticos y funcionarios de alto nivel de 90+ países, revelando cómo utilizaron paraísos fiscales para ocultar riquezas.',
    
    // Starting funds
    startingFunds: 10000000,
    startingCleanFunds: 2000000,
    startingDirtyFunds: 8000000,
    
    // Case-specific filtering
    coreCountries: ['bvi', 'panama', 'switzerland'],
    secondaryCountries: ['cayman', 'singapore', 'uk', 'uae', 'luxembourg'],
    coreMechanisms: ['trust', 'shell-company', 'beneficial-ownership'],
    secondaryMechanisms: ['nominee-director', 'correspondent-banking'],
    recommendedAssets: ['mansion', 'art', 'politician', 'judge'],
    
    historicalSteps: [
      {
        step: 1,
        year: 1996,
        action: 'Políticos comienzan a crear estructuras offshore en BVI',
        country: 'bvi',
        mechanism: 'trust',
        amount: 10000000,
        outcome: 'Fideicomisos establecidos para ocultar activos',
      },
      {
        step: 2,
        year: 2005,
        action: 'Expansión a múltiples jurisdicciones (Panamá, Suiza, Singapur)',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 50000000,
        outcome: 'Red de sociedades offshore en múltiples países',
      },
      {
        step: 3,
        year: 2015,
        action: 'Uso de propiedad beneficial opaca para ocultar riquezas',
        country: 'switzerland',
        mechanism: 'beneficial-ownership',
        amount: 200000000,
        outcome: 'Capas múltiples de entidades dificultan el rastreo',
      },
      {
        step: 4,
        year: 2021,
        action: 'Filtración masiva de documentos de servicios offshore',
        country: 'bvi',
        mechanism: 'trust',
        amount: 0,
        outcome: '12 millones de documentos expuestos por ICIJ',
      },
      {
        step: 5,
        year: 2021,
        action: 'Publicación de Pandora Papers: escándalo global',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 0,
        outcome: '330+ políticos y funcionarios expuestos, investigaciones en 90+ países',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Los fideicomisos en BVI son el estándar de oro. Combínalos con sociedades en Panamá para máxima opacidad. Los políticos usan esta estructura exacta.',
        historicalContext: 'Los Pandora Papers revelaron que 330+ políticos y funcionarios utilizaron fideicomisos en BVI combinados con sociedades en Panamá para ocultar activos.',
      },
      {
        trigger: 'when_clean_funds_>50M',
        hint: 'Con este nivel de fondos, diversifica en múltiples jurisdicciones. BVI, Panamá, Suiza y Singapur ofrecen diferentes ventajas. Los líderes mundiales usan esta estrategia.',
        historicalContext: 'Los Pandora Papers mostraron cómo líderes mundiales diversificaron sus activos en múltiples paraísos fiscales para dificultar el rastreo.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 0,
      consequences: 'Pandora Papers expusieron $100B+ en activos ocultos. 330+ políticos y funcionarios de 90+ países implicados. Múltiples líderes enfrentaron investigaciones. El caso reveló la escala masiva de evasión fiscal de la élite global y aceleró reformas de transparencia.',
    },
  },

  {
    id: 'odebrecht-scandal',
    name: 'Odebrecht: El Escándalo de Sobornos Multinacional',
    protagonist: 'Odebrecht S.A.',
    role: 'multinational',
    period: '2001-2016',
    totalAmount: 788000000,
    summary: 'La constructora brasileña Odebrecht admitió pagar $788 millones en sobornos en 12 países de América Latina para obtener contratos de obras públicas. El escándalo implicó a múltiples expresidentes y políticos.',
    
    // Starting funds
    startingFunds: 100000000,
    startingCleanFunds: 20000000,
    startingDirtyFunds: 80000000,
    
    // Case-specific filtering
    coreCountries: ['panama', 'switzerland', 'angola'],
    secondaryCountries: ['bvi', 'cayman', 'singapore', 'uk'],
    coreMechanisms: ['shell-company', 'correspondent-banking', 'trade-based-ml'],
    secondaryMechanisms: ['beneficial-ownership', 'trust'],
    recommendedAssets: ['politician', 'judge', 'bank_relationship'],
    
    historicalSteps: [
      {
        step: 1,
        year: 2001,
        action: 'Odebrecht establece sistema de sobornos estructurado',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 50000000,
        outcome: 'Sociedades offshore creadas para canalizar sobornos',
      },
      {
        step: 2,
        year: 2006,
        action: 'Sobornos en Perú y Colombia para obtener contratos',
        country: 'panama',
        mechanism: 'correspondent-banking',
        amount: 100000000,
        outcome: 'Transferencias de sobornos a políticos a través de bancos',
      },
      {
        step: 3,
        year: 2010,
        action: 'Expansión a operaciones en Angola y otros países',
        country: 'angola',
        mechanism: 'trade-based-ml',
        amount: 200000000,
        outcome: 'Comercio manipulado para justificar transferencias',
      },
      {
        step: 4,
        year: 2014,
        action: 'Operación Lava Jato en Brasil investiga Odebrecht',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'Investigación brasileña expone sistema de sobornos',
      },
      {
        step: 5,
        year: 2016,
        action: 'Odebrecht admite pagar $788M en sobornos en 12 países',
        country: 'switzerland',
        mechanism: 'correspondent-banking',
        amount: 788000000,
        outcome: 'Confesión de sobornos, múltiples expresidentes implicados',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Para corporaciones multinacionales, Panamá es perfecto para canalizar pagos. Las sociedades offshore allí permiten mover fondos sin dejar rastro. Combínalo con banca corresponsal para transferencias internacionales.',
        historicalContext: 'Odebrecht utilizó sociedades offshore en Panamá para canalizar $788 millones en sobornos a políticos en 12 países de América Latina.',
      },
      {
        trigger: 'when_heat_>40',
        hint: 'A este nivel, necesitas protección política. Los políticos que reciben sobornos tienen incentivos para protegerte. Pero también son riesgosos - pueden traicionarte si cambian de gobierno.',
        historicalContext: 'Odebrecht pagó sobornos a múltiples expresidentes y políticos, quienes luego protegieron a la empresa, pero fueron descubiertos cuando cambiaron los gobiernos.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 3500000000,
      consequences: 'Odebrecht admitió pagar $788M en sobornos. Múltiples expresidentes condenados (Alejandro Toledo en Perú, otros en Brasil, Colombia, Panamá). La empresa pagó $3.5B en multas. El escándalo expuso la corrupción sistémica en obras públicas en América Latina.',
    },
  },

  {
    id: 'ricardo-martinelli',
    name: 'Ricardo Martinelli: El Caso New Business',
    protagonist: 'Ricardo Martinelli',
    role: 'multimillionaire',
    period: '2009-2015',
    totalAmount: 19200000,
    summary: 'El expresidente panameño Ricardo Martinelli fue condenado por blanqueo de capitales en el caso "New Business", relacionado con la compra de un conglomerado mediático utilizando fondos de origen ilícito.',
    
    // Starting funds
    startingFunds: 20000000,
    startingCleanFunds: 5000000,
    startingDirtyFunds: 15000000,
    
    // Case-specific filtering
    coreCountries: ['panama', 'bvi', 'switzerland'],
    secondaryCountries: ['cayman', 'singapore', 'uk', 'uae'],
    coreMechanisms: ['shell-company', 'beneficial-ownership', 'correspondent-banking'],
    secondaryMechanisms: ['trust', 'nominee-director'],
    recommendedAssets: ['politician', 'judge', 'bank_relationship'],
    
    historicalSteps: [
      {
        step: 1,
        year: 2009,
        action: 'Martinelli asume presidencia de Panamá',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 10000000,
        outcome: 'Acceso a fondos públicos y contratos gubernamentales',
      },
      {
        step: 2,
        year: 2010,
        action: 'Creación de sociedad New Business en Panamá',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 19200000,
        outcome: 'Sociedad creada para comprar conglomerado mediático',
      },
      {
        step: 3,
        year: 2011,
        action: 'Compra de Editora Panamá América (Epasa)',
        country: 'panama',
        mechanism: 'beneficial-ownership',
        amount: 19200000,
        outcome: 'Compra de medios de comunicación con fondos ilícitos',
      },
      {
        step: 4,
        year: 2014,
        action: 'Fin de presidencia y comienzo de investigaciones',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'Nuevo gobierno inicia investigaciones sobre compra de Epasa',
      },
      {
        step: 5,
        year: 2024,
        action: 'Condena a 128 meses de prisión y multa de $19.2M',
        country: 'panama',
        mechanism: 'correspondent-banking',
        amount: 19200000,
        outcome: 'Martinelli condenado por blanqueo de capitales',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Panamá es tu base. Como expresidente, tienes conexiones políticas. Usa sociedades offshore aquí para mover fondos sin dejar rastro. New Business fue perfecto para esto.',
        historicalContext: 'Martinelli utilizó su posición como presidente para crear la sociedad New Business en Panamá y comprar medios de comunicación con fondos ilícitos.',
      },
      {
        trigger: 'when_heat_>50',
        hint: 'Los medios de comunicación son poderosos - pueden protegerte o destruirte. Martinelli compró Epasa para controlar la narrativa. Pero también son muy visibles y atraen atención.',
        historicalContext: 'Martinelli compró Editora Panamá América para controlar la narrativa mediática, pero esto también lo hizo más visible y vulnerable a investigaciones.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 19200000,
      consequences: 'Ricardo Martinelli condenado a 128 meses de prisión y multa de $19.2M por blanqueo de capitales. El caso expuso cómo utilizó su posición presidencial para comprar medios de comunicación con fondos ilícitos. También enfrenta otros casos por corrupción y espionaje.',
    },
  },

  {
    id: 'alejandro-toledo',
    name: 'Alejandro Toledo: Sobornos de Odebrecht',
    protagonist: 'Alejandro Toledo',
    role: 'multimillionaire',
    period: '2001-2019',
    totalAmount: 35000000,
    summary: 'El expresidente peruano Alejandro Toledo fue condenado a 13 años y 4 meses de prisión por recibir $35 millones en sobornos de Odebrecht para favorecer a la empresa en la adjudicación de obras públicas.',
    
    // Starting funds
    startingFunds: 10000000,
    startingCleanFunds: 2000000,
    startingDirtyFunds: 8000000,
    
    // Case-specific filtering
    coreCountries: ['panama', 'switzerland', 'bvi'],
    secondaryCountries: ['cayman', 'singapore', 'uk', 'angola'],
    coreMechanisms: ['shell-company', 'correspondent-banking', 'trust'],
    secondaryMechanisms: ['beneficial-ownership', 'trade-based-ml'],
    recommendedAssets: ['politician', 'judge', 'mansion'],
    
    historicalSteps: [
      {
        step: 1,
        year: 2001,
        action: 'Toledo asume presidencia de Perú',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 5000000,
        outcome: 'Acceso a adjudicación de contratos públicos',
      },
      {
        step: 2,
        year: 2005,
        action: 'Odebrecht paga sobornos a través de sociedad offshore',
        country: 'panama',
        mechanism: 'correspondent-banking',
        amount: 20000000,
        outcome: 'Transferencias de sobornos a cuentas en Panamá',
      },
      {
        step: 3,
        year: 2006,
        action: 'Fondos transferidos a fideicomiso en Suiza',
        country: 'switzerland',
        mechanism: 'trust',
        amount: 15000000,
        outcome: 'Fideicomiso establecido para ocultar sobornos',
      },
      {
        step: 4,
        year: 2017,
        action: 'Toledo arrestado en Estados Unidos tras investigación',
        country: 'bvi',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'Operación Lava Jato expone sobornos de Odebrecht',
      },
      {
        step: 5,
        year: 2023,
        action: 'Condena a 13 años y 4 meses de prisión',
        country: 'panama',
        mechanism: 'correspondent-banking',
        amount: 35000000,
        outcome: 'Toledo condenado por lavado de activos y sobornos',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Como político, los sobornos son tu ingreso principal. Odebrecht pagó $35M en sobornos aquí. Usa Panamá para recibir los fondos, luego transfiere a Suiza para mayor seguridad.',
        historicalContext: 'Toledo recibió $35 millones en sobornos de Odebrecht a través de sociedades offshore en Panamá, que luego transfirió a fideicomisos en Suiza.',
      },
      {
        trigger: 'when_heat_>40',
        hint: 'Los fideicomisos en Suiza ofrecen máxima protección. Pero cuando cambian los gobiernos, las investigaciones comienzan. Es un juego de tiempo - mueve los fondos antes de que sea demasiado tarde.',
        historicalContext: 'Toledo transfirió los sobornos a Suiza para mayor protección, pero fue descubierto cuando el nuevo gobierno peruano inició investigaciones sobre Odebrecht.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 35000000,
      consequences: 'Alejandro Toledo condenado a 13 años y 4 meses de prisión por lavado de activos. Se le acusó de recibir $35M en sobornos de Odebrecht. Arrestado en Estados Unidos en 2019, extraditado a Perú en 2023. El caso expuso cómo expresidentes recibían sobornos masivos de corporaciones multinacionales.',
    },
  },

  {
    id: 'jordi-pujol',
    name: 'Jordi Pujol: La Fortuna Oculta de Cataluña',
    protagonist: 'Jordi Pujol',
    role: 'multimillionaire',
    period: '1980-2014',
    totalAmount: 300000000,
    summary: 'El expresidente de la Generalidad de Cataluña, Jordi Pujol, y su familia fueron investigados por ocultar una fortuna de más de $300 millones en cuentas en el extranjero sin declararlas a las autoridades fiscales españolas.',
    
    // Starting funds
    startingFunds: 50000000,
    startingCleanFunds: 10000000,
    startingDirtyFunds: 40000000,
    
    // Case-specific filtering
    coreCountries: ['switzerland', 'panama', 'uk'],
    secondaryCountries: ['luxembourg', 'singapore', 'bvi', 'cayman'],
    coreMechanisms: ['trust', 'shell-company', 'beneficial-ownership'],
    secondaryMechanisms: ['correspondent-banking'],
    recommendedAssets: ['mansion', 'art', 'politician', 'judge'],
    
    historicalSteps: [
      {
        step: 1,
        year: 1980,
        action: 'Pujol asume presidencia de la Generalidad de Cataluña',
        country: 'switzerland',
        mechanism: 'trust',
        amount: 10000000,
        outcome: 'Fideicomisos establecidos en Suiza para ocultar activos',
      },
      {
        step: 2,
        year: 1990,
        action: 'Expansión de activos ocultos a Panamá y Reino Unido',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 100000000,
        outcome: 'Sociedades offshore creadas en múltiples jurisdicciones',
      },
      {
        step: 3,
        year: 2003,
        action: 'Uso de propiedad beneficial opaca para ocultar riquezas',
        country: 'uk',
        mechanism: 'beneficial-ownership',
        amount: 150000000,
        outcome: 'Capas múltiples de entidades dificultan el rastreo',
      },
      {
        step: 4,
        year: 2014,
        action: 'Pujol admite tener cuentas no declaradas en el extranjero',
        country: 'switzerland',
        mechanism: 'trust',
        amount: 0,
        outcome: 'Admisión pública de cuentas offshore no declaradas',
      },
      {
        step: 5,
        year: 2015,
        action: 'Investigación por delitos fiscales y blanqueo de capitales',
        country: 'panama',
        mechanism: 'shell-company',
        amount: 0,
        outcome: 'Investigaciones en España y múltiples países',
      },
    ],
    
    advisorHints: [
      {
        trigger: 'after_first_transaction',
        hint: 'Suiza es el clásico para políticos europeos. Pujol ocultó $300M allí durante 34 años. Combínalo con Panamá para mayor opacidad. Los políticos catalanes usan esta estructura exacta.',
        historicalContext: 'Pujol y su familia ocultaron más de $300 millones en cuentas en Suiza, Panamá y Reino Unido durante su presidencia de 23 años en Cataluña.',
      },
      {
        trigger: 'when_clean_funds_>100M',
        hint: 'Con este nivel de fondos, diversifica en propiedades de lujo. Pujol invirtió en mansiones y arte. Pero las propiedades son más fáciles de rastrear que las cuentas bancarias.',
        historicalContext: 'Pujol y su familia invirtieron parte de los fondos ocultos en propiedades de lujo y arte, pero estas inversiones fueron más fáciles de rastrear.',
      },
    ],
    
    finalOutcome: {
      caught: true,
      amountLost: 300000000,
      consequences: 'Jordi Pujol y su familia investigados por ocultar $300M+ en cuentas offshore. Acusados de delitos fiscales, blanqueo de capitales y cohecho. El caso expuso cómo políticos catalanes ocultaron fortunas durante décadas. Pujol y varios miembros de su familia enfrentan procesos judiciales.',
    },
  },
];

// Helper functions
export function getRealCaseById(id: string): RealCase | undefined {
  return realCases.find(case_ => case_.id === id);
}

export function getRealCasesByRole(role: GameRole): RealCase[] {
  return realCases.filter(case_ => case_.role === role);
}

export function getAllRealCases(): RealCase[] {
  return realCases;
}
