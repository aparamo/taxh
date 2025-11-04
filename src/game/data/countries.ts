import { Country } from '../types';

export const countries: Country[] = [
  {
    id: 'bvi',
    name: 'Islas Vírgenes Británicas',
    secrecyScore: 61, // TJN FSI 2023
    riskLevel: 7,
    opacityBonus: 0.35,
    availableMechanisms: ['shell-company', 'trust', 'nominee-director', 'correspondent-banking', 'trade-based-ml'],
    description: 'Paraíso fiscal caribeño con alta confidencialidad y registro rápido. Territorio británico de ultramar con autonomía fiscal.',
    flagEmoji: '🇻🇬',
    coordinates: { lat: 18.4207, lng: -64.6399 },
  },
  {
    id: 'panama',
    name: 'Panamá',
    secrecyScore: 58, // TJN FSI 2023
    riskLevel: 7,
    opacityBonus: 0.30,
    availableMechanisms: ['shell-company', 'nominee-director', 'trade-based-ml'],
    description: 'Hub corporativo con historial de casos mediáticos (Panama Papers). Centro logístico global con zona libre de Colón.',
    flagEmoji: '🇵🇦',
    coordinates: { lat: 8.9824, lng: -79.5199 },
  },
  {
    id: 'switzerland',
    name: 'Suiza',
    secrecyScore: 52, // TJN FSI 2023
    riskLevel: 6,
    opacityBonus: 0.30,
    availableMechanisms: ['trust', 'shell-company', 'correspondent-banking'],
    description: 'Banca privada tradicional con mayor cooperación internacional (AEOI/CRS). Estabilidad política y marco legal sofisticado.',
    flagEmoji: '🇨🇭',
    coordinates: { lat: 46.8182, lng: 8.2275 },
  },
  {
    id: 'singapore',
    name: 'Singapur',
    secrecyScore: 48, // TJN FSI 2023
    riskLevel: 5,
    opacityBonus: 0.25,
    availableMechanisms: ['shell-company', 'trust', 'transfer-pricing'],
    description: 'Centro financiero global con secreto bancario moderado y marco regulatorio sofisticado. Popular para estructuras corporativas asiáticas.',
    flagEmoji: '🇸🇬',
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  {
    id: 'uae',
    name: 'Emiratos Árabes Unidos',
    secrecyScore: 76, // TJN FSI 2023 - Very high secrecy
    riskLevel: 8,
    opacityBonus: 0.40,
    availableMechanisms: ['shell-company', 'nominee-director', 'trade-based-ml'],
    description: 'Alto secreto financiero con zonas francas y controles laxos. Popular para comercio y estructuras opacas del Medio Oriente.',
    flagEmoji: '🇦🇪',
    coordinates: { lat: 23.4241, lng: 53.8478 },
  },
  {
    id: 'cayman',
    name: 'Islas Caimán',
    secrecyScore: 71, // TJN FSI 2023
    riskLevel: 7,
    opacityBonus: 0.38,
    availableMechanisms: ['shell-company', 'trust', 'correspondent-banking'],
    description: 'Centro bancario offshore con alta confidencialidad. Popular para fondos de inversión y estructuras de alto volumen.',
    flagEmoji: '🇰🇾',
    coordinates: { lat: 19.3133, lng: -81.2546 },
  },
  {
    id: 'luxembourg',
    name: 'Luxemburgo',
    secrecyScore: 56, // TJN FSI 2023
    riskLevel: 6,
    opacityBonus: 0.32,
    availableMechanisms: ['trust', 'transfer-pricing', 'beneficial-ownership'],
    description: 'Centro financiero europeo conocido por rulings fiscales favorables (LuxLeaks). Popular para estructuras corporativas multinacionales.',
    flagEmoji: '🇱🇺',
    coordinates: { lat: 49.8153, lng: 6.1296 },
  },
  {
    id: 'delaware',
    name: 'Delaware, Estados Unidos',
    secrecyScore: 25, // TJN FSI 2023 - Lower secrecy but popular
    riskLevel: 4,
    opacityBonus: 0.15,
    availableMechanisms: ['shell-company', 'beneficial-ownership'],
    description: 'Estado estadounidense popular para incorporación corporativa. Bajo costo y proceso rápido, pero menor secreto que jurisdicciones offshore.',
    flagEmoji: '🇺🇸',
    coordinates: { lat: 39.1619, lng: -75.5267 },
  },
  {
    id: 'ireland',
    name: 'Irlanda',
    secrecyScore: 46, // TJN FSI 2023
    riskLevel: 5,
    opacityBonus: 0.22,
    availableMechanisms: ['transfer-pricing', 'beneficial-ownership', 'shell-company'],
    description: 'Popular para empresas tecnológicas (Double Irish). Ofrece cajas de conocimiento y estructuras de precios de transferencia agresivas.',
    flagEmoji: '🇮🇪',
    coordinates: { lat: 53.4129, lng: -8.2439 },
  },
  {
    id: 'netherlands',
    name: 'Países Bajos',
    secrecyScore: 41, // TJN FSI 2023
    riskLevel: 4,
    opacityBonus: 0.20,
    availableMechanisms: ['transfer-pricing', 'beneficial-ownership', 'trust'],
    description: 'País conducto para estructuras fiscales (Dutch Sandwich). Exención de retenciones y tratados fiscales favorables.',
    flagEmoji: '🇳🇱',
    coordinates: { lat: 52.1326, lng: 5.2913 },
  },
  {
    id: 'malta',
    name: 'Malta',
    secrecyScore: 63, // TJN FSI 2023
    riskLevel: 6,
    opacityBonus: 0.28,
    availableMechanisms: ['shell-company', 'correspondent-banking', 'trust'],
    description: 'Pequeño estado insular de la UE con secreto bancario y acceso a mercados europeos. Popular como intermediario.',
    flagEmoji: '🇲🇹',
    coordinates: { lat: 35.9375, lng: 14.3754 },
  },
  {
    id: 'uk',
    name: 'Reino Unido',
    secrecyScore: 28, // TJN FSI 2023
    riskLevel: 3,
    opacityBonus: 0.12,
    availableMechanisms: ['beneficial-ownership', 'trust', 'shell-company'],
    description: 'Destino popular para inversiones inmobiliarias de lujo. Londres es centro financiero global con transparencia moderada.',
    flagEmoji: '🇬🇧',
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  {
    id: 'angola',
    name: 'Angola',
    secrecyScore: 72, // TJN FSI 2023
    riskLevel: 8,
    opacityBonus: 0.35,
    availableMechanisms: ['shell-company', 'trade-based-ml', 'correspondent-banking'],
    description: 'País de origen en casos de corrupción estatal. Estructuras offshore utilizadas para ocultar fondos públicos.',
    flagEmoji: '🇦🇴',
    coordinates: { lat: -11.2027, lng: 17.8739 },
  },
  {
    id: 'malaysia',
    name: 'Malasia',
    secrecyScore: 54, // TJN FSI 2023
    riskLevel: 6,
    opacityBonus: 0.25,
    availableMechanisms: ['shell-company', 'correspondent-banking', 'trade-based-ml'],
    description: 'País de origen del escándalo 1MDB. Centro financiero regional con secreto bancario moderado.',
    flagEmoji: '🇲🇾',
    coordinates: { lat: 3.1390, lng: 101.6869 },
  },
  {
    id: 'usa',
    name: 'Estados Unidos',
    secrecyScore: 67, // TJN FSI 2023 - Delaware and other states
    riskLevel: 5,
    opacityBonus: 0.22,
    availableMechanisms: ['beneficial-ownership', 'shell-company', 'trust', 'correspondent-banking'],
    description: 'Destino para inversiones de alto perfil. Nueva York y otros estados ofrecen opacidad corporativa similar a paraísos fiscales. Banca corresponsal disponible para instituciones financieras.',
    flagEmoji: '🇺🇸',
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: 'jersey',
    name: 'Jersey',
    secrecyScore: 65, // TJN FSI 2023 - High secrecy, Channel Islands
    riskLevel: 6,
    opacityBonus: 0.33,
    availableMechanisms: ['trust', 'shell-company', 'beneficial-ownership'],
    description: 'Dependencia de la Corona Británica con alta confidencialidad bancaria. Popular para fideicomisos y estructuras corporativas europeas.',
    flagEmoji: '🇯🇪',
    coordinates: { lat: 49.2144, lng: -2.1312 },
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    secrecyScore: 50, // TJN FSI 2023 - Moderate secrecy, major financial hub
    riskLevel: 5,
    opacityBonus: 0.24,
    availableMechanisms: ['shell-company', 'trust', 'transfer-pricing', 'beneficial-ownership'],
    description: 'Centro financiero global asiático con baja tributación y estructuras corporativas sofisticadas. Puerta de entrada a China y Asia.',
    flagEmoji: '🇭🇰',
    coordinates: { lat: 22.3193, lng: 114.1694 },
  },
  {
    id: 'bermuda',
    name: 'Bermuda',
    secrecyScore: 68, // TJN FSI 2023 - High secrecy, insurance hub
    riskLevel: 6,
    opacityBonus: 0.34,
    availableMechanisms: ['trust', 'shell-company', 'beneficial-ownership'],
    description: 'Centro de seguros offshore con alta confidencialidad. Popular para estructuras de reaseguro y fideicomisos.',
    flagEmoji: '🇧🇲',
    coordinates: { lat: 32.3078, lng: -64.7505 },
  },
  {
    id: 'isle-of-man',
    name: 'Isla de Man',
    secrecyScore: 62, // TJN FSI 2023 - High secrecy, Crown Dependency
    riskLevel: 6,
    opacityBonus: 0.31,
    availableMechanisms: ['trust', 'shell-company', 'beneficial-ownership'],
    description: 'Dependencia de la Corona Británica con baja tributación y secreto bancario. Popular para fideicomisos y estructuras corporativas.',
    flagEmoji: '🇮🇲',
    coordinates: { lat: 54.2361, lng: -4.5481 },
  },
  {
    id: 'monaco',
    name: 'Mónaco',
    secrecyScore: 55, // TJN FSI 2023 - Moderate secrecy, no income tax
    riskLevel: 5,
    opacityBonus: 0.28,
    availableMechanisms: ['trust', 'shell-company', 'beneficial-ownership'],
    description: 'Principado sin impuesto sobre la renta personal con secreto bancario. Popular para activos de lujo y patrimonio de alto valor.',
    flagEmoji: '🇲🇨',
    coordinates: { lat: 43.7384, lng: 7.4246 },
  },
  {
    id: 'mauritius',
    name: 'Mauricio',
    secrecyScore: 59, // TJN FSI 2023 - Moderate-high secrecy, African gateway
    riskLevel: 6,
    opacityBonus: 0.29,
    availableMechanisms: ['shell-company', 'trust', 'trade-based-ml', 'beneficial-ownership'],
    description: 'Puerta de entrada a África con tratados fiscales favorables. Popular para inversiones en el continente africano y comercio.',
    flagEmoji: '🇲🇺',
    coordinates: { lat: -20.3484, lng: 57.5522 },
  },
  {
    id: 'seychelles',
    name: 'Seychelles',
    secrecyScore: 70, // TJN FSI 2023 - Very high secrecy
    riskLevel: 7,
    opacityBonus: 0.36,
    availableMechanisms: ['shell-company', 'trust', 'nominee-director', 'beneficial-ownership'],
    description: 'Alto secreto financiero con registro corporativo rápido y bajo costo. Popular para sociedades offshore y estructuras opacas.',
    flagEmoji: '🇸🇨',
    coordinates: { lat: -4.6796, lng: 55.4920 },
  },
  {
    id: 'gibraltar',
    name: 'Gibraltar',
    secrecyScore: 53, // TJN FSI 2023 - Moderate secrecy, EU gateway
    riskLevel: 5,
    opacityBonus: 0.26,
    availableMechanisms: ['shell-company', 'trust', 'correspondent-banking', 'beneficial-ownership'],
    description: 'Territorio británico de ultramar con acceso a la UE. Popular para estructuras corporativas y banca offshore.',
    flagEmoji: '🇬🇮',
    coordinates: { lat: 36.1408, lng: -5.3536 },
  },
];

export function getCountryById(id: string): Country | undefined {
  return countries.find(c => c.id === id);
}

export function getCountriesByMechanism(mechanismId: string): Country[] {
  return countries.filter(c => c.availableMechanisms.includes(mechanismId));
}
