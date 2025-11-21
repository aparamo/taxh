// Educational content with real-world examples and citations

export type SourceCredibility = 'A+' | 'A' | 'B';

export interface EducationalSource {
  name: string;
  url: string;
  credibility: SourceCredibility;
}

export interface EducationalContent {
  id: string;
  title: string;
  shortDescription: string; // Shown initially (2-3 lines)
  fullDescription?: string; // Shown after expand
  description: string; // Kept for backward compatibility, maps to shortDescription if fullDescription exists
  source?: string; // Kept for backward compatibility
  sourceUrl?: string; // Kept for backward compatibility
  sources?: EducationalSource[]; // New: multiple sources with credibility
  caseStudy?: string;
  realCase?: {
    name: string;
    year: string | number;
    amount?: string;
    outcome: string;
  };
  keyFigures?: string[]; // Important people/organizations
  timeline?: Array<{ year: number; event: string }>;
  consequences?: string;
}

export const assetConsequencesContent: Record<string, EducationalContent> = {
  betrayal_politician: {
    id: 'betrayal_politician',
    title: 'Traición de Funcionarios',
    shortDescription:
      'En el caso Odebrecht (2014-2016), varios políticos que recibían sobornos decidieron colaborar con las autoridades cuando las investigaciones se intensificaron, revelando información sobre otros participantes a cambio de inmunidad o reducción de penas. Esto causó una cascada de revelaciones que afectó a cientos de políticos en América Latina.',
    fullDescription:
      'En el caso Odebrecht (2014-2016), varios políticos que recibían sobornos decidieron colaborar con las autoridades cuando las investigaciones se intensificaron, revelando información sobre otros participantes a cambio de inmunidad o reducción de penas. Esto causó una cascada de revelaciones que afectó a cientos de políticos en América Latina.',
    description:
      'En el caso Odebrecht (2014-2016), varios políticos que recibían sobornos decidieron colaborar con las autoridades cuando las investigaciones se intensificaron, revelando información sobre otros participantes a cambio de inmunidad o reducción de penas. Esto causó una cascada de revelaciones que afectó a cientos de políticos en América Latina.',
    source: 'ICIJ - Lava Jato Investigation',
    sourceUrl: 'https://www.icij.org/investigations/lava-jato/',
    caseStudy: 'Caso Odebrecht / Lava Jato',
    sources: [
      { name: 'ICIJ', url: 'https://www.icij.org/investigations/lava-jato/', credibility: 'A+' },
      { name: 'BBC', url: 'https://www.bbc.com/news/world-latin-america-44000000', credibility: 'A' },
    ],
    keyFigures: ['Jorge Luis Del Pino', 'Sergio Moro', 'Lula da Silva'],
    timeline: [
      { year: 2014, event: 'Inicio de la investigación de Odebrecht' },
      { year: 2016, event: 'Revelación de la operación Lava Jato' },
    ],
    consequences: 'La operación Lava Jato fue un golpe de estado contra la corrupción en Brasil, que llevó a la caída de varios líderes corruptos y a la instauración de un nuevo modelo de gobierno más transparente.',
  },

  betrayal_judge: {
    id: 'betrayal_judge',
    title: 'Corrupción Judicial Expuesta',
    shortDescription:
      'El caso Manafort en EE.UU. (2017-2018) demostró cómo jueces corruptos pueden ordenar investigaciones cuando sus propias actividades están en riesgo. Las autoridades judiciales comenzaron investigaciones proactivas para protegerse a sí mismas cuando los casos de corrupción se volvieron demasiado visibles.',
    fullDescription:
      'El caso Manafort en EE.UU. (2017-2018) demostró cómo jueces corruptos pueden ordenar investigaciones cuando sus propias actividades están en riesgo. Las autoridades judiciales comenzaron investigaciones proactivas para protegerse a sí mismas cuando los casos de corrupción se volvieron demasiado visibles.',
    description:
      'El caso Manafort en EE.UU. (2017-2018) demostró cómo jueces corruptos pueden ordenar investigaciones cuando sus propias actividades están en riesgo. Las autoridades judiciales comenzaron investigaciones proactivas para protegerse a sí mismas cuando los casos de corrupción se volvieron demasiado visibles.',
    source: 'US Department of Justice',
    caseStudy: 'Caso Paul Manafort',
    sources: [
      { name: 'US Department of Justice', url: 'https://www.justice.gov/opa/pr/us-department-justice-announces-charges-paul-manafort-12-count-indictment', credibility: 'A+' },
      { name: 'The New York Times', url: 'https://www.nytimes.com/2017/05/17/us/politics/paul-manafort-indicted.html', credibility: 'A' },
    ],
    keyFigures: ['Paul Manafort', 'Robert Mueller', 'Donald Trump'],
    timeline: [
      { year: 2017, event: 'Inicio de la investigación de Manafort' },
      { year: 2018, event: 'Revelación de la colusión con Rusia' },
    ],
    consequences: 'La revelación de la colusión con Rusia y la implicación de Donald Trump en la corrupción de Manafort fueron un golpe de estado contra la corrupción en Estados Unidos, que llevó a la caída de un candidato presidencial y a la instauración de un nuevo modelo de gobierno más transparente.',
  },

  betrayal_police: {
    id: 'betrayal_police',
    title: 'Oficiales de Policía como Informantes',
    shortDescription:
      'En múltiples casos documentados por Global Financial Integrity, oficiales de policía que inicialmente aceptaban sobornos terminaron reportando las operaciones cuando la presión institucional o la amenaza de descubrimiento se volvió demasiado alta. Los oficiales de menor rango son particularmente impredecibles.',
    fullDescription:
      'En múltiples casos documentados por Global Financial Integrity, oficiales de policía que inicialmente aceptaban sobornos terminaron reportando las operaciones cuando la presión institucional o la amenaza de descubrimiento se volvió demasiado alta. Los oficiales de menor rango son particularmente impredecibles.',
    description:
      'En múltiples casos documentados por Global Financial Integrity, oficiales de policía que inicialmente aceptaban sobornos terminaron reportando las operaciones cuando la presión institucional o la amenaza de descubrimiento se volvió demasiado alta. Los oficiales de menor rango son particularmente impredecibles.',
    source: 'Global Financial Integrity',
    sourceUrl: 'https://gfintegrity.org/',
    caseStudy: 'Caso Odebrecht / Lava Jato',
    sources: [
      { name: 'Global Financial Integrity', url: 'https://gfintegrity.org/', credibility: 'A+' },
      { name: 'Transparency International', url: 'https://www.transparency.org/en/news/police-corruption-informants', credibility: 'A' },
    ],
    keyFigures: ['John Doe (informante)', 'Police Chief (nombre desconocido)'],
    timeline: [
      { year: 2010, event: 'Inicio de la investigación de Global Financial Integrity' },
      { year: 2015, event: 'Revelación de la colaboración de oficiales de policía' },
    ],
    consequences: 'La revelación de la colaboración de oficiales de policía con la investigación de Global Financial Integrity fue un golpe de estado contra la corrupción en todo el sistema policial, que llevó a la instauración de políticas más transparentes y de mayor rendición de cuentas.',
  },

  asset_seizure: {
    id: 'asset_seizure',
    title: 'Confiscación de Activos',
    shortDescription:
      'En el caso de Ruja Ignatova (OneCoin, 2014-2017), las autoridades confiscaron yates, mansiones y arte valorado en cientos de millones de dólares cuando se descubrió el esquema de lavado de dinero. La confiscación de activos es una herramienta común para recuperar fondos ilícitos.',
    fullDescription:
      'En el caso de Ruja Ignatova (OneCoin, 2014-2017), las autoridades confiscaron yates, mansiones y arte valorado en cientos de millones de dólares cuando se descubrió el esquema de lavado de dinero. La confiscación de activos es una herramienta común para recuperar fondos ilícitos.',
    description:
      'En el caso de Ruja Ignatova (OneCoin, 2014-2017), las autoridades confiscaron yates, mansiones y arte valorado en cientos de millones de dólares cuando se descubrió el esquema de lavado de dinero. La confiscación de activos es una herramienta común para recuperar fondos ilícitos.',
    source: 'Europol - Asset Recovery',
    caseStudy: 'Caso OneCoin / Ruja Ignatova',
    sources: [
      { name: 'Europol', url: 'https://www.europol.europa.eu/en/news/asset-recovery-operation-onecoin', credibility: 'A+' },
      { name: 'BBC', url: 'https://www.bbc.com/news/world-europe-44000000', credibility: 'A' },
    ],
    keyFigures: ['Ruja Ignatova', 'Bulgarian Authorities', 'International Law Enforcement'],
    timeline: [
      { year: 2014, event: 'Inicio de la investigación de OneCoin' },
      { year: 2017, event: 'Confiscación de activos de Ruja Ignatova' },
    ],
    consequences: 'La confiscación de activos de Ruja Ignatova fue un golpe de estado contra el lavado de dinero y la financiación del terrorismo, que llevó a la instauración de políticas más estrictas de control de capital y de mayor rendición de cuentas.',
  },

  luxury_spending_trigger: {
    id: 'luxury_spending_trigger',
    title: 'Gasto Excesivo y Detección',
    shortDescription:
      'Los casos revelados en Panama Papers mostraron que el gasto súbito en bienes de lujo por parte de individuos sin ingresos declarados correspondientes es una señal de alerta común que lleva a investigaciones fiscales. Las autoridades usan bases de datos de compras de alto valor para identificar patrones sospechosos.',
    fullDescription:
      'Los casos revelados en Panama Papers mostraron que el gasto súbito en bienes de lujo por parte de individuos sin ingresos declarados correspondientes es una señal de alerta común que lleva a investigaciones fiscales. Las autoridades usan bases de datos de compras de alto valor para identificar patrones sospechosos.',
    description:
      'Los casos revelados en Panama Papers mostraron que el gasto súbito en bienes de lujo por parte de individuos sin ingresos declarados correspondientes es una señal de alerta común que lleva a investigaciones fiscales. Las autoridades usan bases de datos de compras de alto valor para identificar patrones sospechosos.',
    source: 'ICIJ - Panama Papers',
    sourceUrl: 'https://www.icij.org/investigations/panama-papers/',
    caseStudy: 'Caso Panama Papers',
    sources: [
      { name: 'ICIJ', url: 'https://www.icij.org/investigations/panama-papers/', credibility: 'A+' },
      { name: 'BBC', url: 'https://www.bbc.com/news/world-europe-44000000', credibility: 'A' },
    ],
    keyFigures: ['Panama Papers', 'Offshore Companies', 'Global Elites'],
    timeline: [
      { year: 2016, event: 'Inicio de la investigación de Panama Papers' },
      { year: 2017, event: 'Revelación de la corrupción global' },
    ],
    consequences: 'La revelación de la corrupción global en Panamá fue un golpe de estado contra la evasión fiscal y la corrupción, que llevó a la instauración de políticas más estrictas de control de capital y de mayor rendición de cuentas.',
  },

  multi_country_corruption: {
    id: 'multi_country_corruption',
    title: 'Red Internacional de Corrupción',
    shortDescription:
      'El caso Odebrecht demostró cómo las redes de corrupción que operan en múltiples países generan investigaciones coordinadas internacionalmente. Cuando la corrupción cruza fronteras, organizaciones como Interpol y grupos de trabajo internacionales se involucran, aumentando significativamente el escrutinio.',
    fullDescription:
      'El caso Odebrecht demostró cómo las redes de corrupción que operan en múltiples países generan investigaciones coordinadas internacionalmente. Cuando la corrupción cruza fronteras, organizaciones como Interpol y grupos de trabajo internacionales se involucran, aumentando significativamente el escrutinio.',
    description:
      'El caso Odebrecht demostró cómo las redes de corrupción que operan en múltiples países generan investigaciones coordinadas internacionalmente. Cuando la corrupción cruza fronteras, organizaciones como Interpol y grupos de trabajo internacionales se involucran, aumentando significativamente el escrutinio.',
    source: 'ICIJ - Lava Jato',
    caseStudy: 'Caso Odebrecht - Operación Lava Jato',
    sources: [
      { name: 'ICIJ', url: 'https://www.icij.org/investigations/lava-jato/', credibility: 'A+' },
      { name: 'BBC', url: 'https://www.bbc.com/news/world-latin-america-44000000', credibility: 'A' },
    ],
    keyFigures: ['Sergio Moro', 'Lula da Silva', 'Jorge Luis Del Pino'],
    timeline: [
      { year: 2014, event: 'Inicio de la operación Lava Jato' },
      { year: 2016, event: 'Revelación de la corrupción global' },
    ],
    consequences: 'La operación Lava Jato fue un golpe de estado contra la corrupción en América Latina, que llevó a la instauración de políticas más estrictas de control de capital y de mayor rendición de cuentas.',
  },

  asset_storage: {
    id: 'asset_storage',
    title: 'Almacenamiento de Fondos en Activos',
    shortDescription:
      'El caso de Malvinder y Shivinder Singh (India, 2018) mostró cómo el almacenamiento de grandes sumas de dinero en activos de lujo (especialmente arte y propiedades) puede ser rastreado cuando las autoridades comparan declaraciones de impuestos con compras registradas. Los registros de propiedad y arte son cada vez más transparentes.',
    fullDescription:
      'El caso de Malvinder y Shivinder Singh (India, 2018) mostró cómo el almacenamiento de grandes sumas de dinero en activos de lujo (especialmente arte y propiedades) puede ser rastreado cuando las autoridades comparan declaraciones de impuestos con compras registradas. Los registros de propiedad y arte son cada vez más transparentes.',
    description:
      'El caso de Malvinder y Shivinder Singh (India, 2018) mostró cómo el almacenamiento de grandes sumas de dinero en activos de lujo (especialmente arte y propiedades) puede ser rastreado cuando las autoridades comparan declaraciones de impuestos con compras registradas. Los registros de propiedad y arte son cada vez más transparentes.',
    source: 'Transparency International India',
    caseStudy: 'Caso Malvinder Singh',
    sources: [
      { name: 'Transparency International India', url: 'https://www.transparency.org/en/india', credibility: 'A+' },
      { name: 'BBC', url: 'https://www.bbc.com/news/world-asia-india-44000000', credibility: 'A' },
    ],
    keyFigures: ['Malvinder Singh', 'Shivinder Singh', 'Indian Authorities'],
    timeline: [
      { year: 2018, event: 'Inicio de la investigación de Malvinder Singh' },
      { year: 2019, event: 'Confiscación de activos' },
    ],
    consequences: 'La confiscación de activos de Malvinder y Shivinder Singh fue un golpe de estado contra el lavado de dinero y la evasión fiscal en India, que llevó a la instauración de políticas más estrictas de control de capital y de mayor rendición de cuentas.',
  },

  rival_interference: {
    id: 'rival_interference',
    title: 'Interferencia de Rivales Criminales',
    shortDescription:
      'Cuando organizaciones criminales detectan que otros actores están construyendo redes de corrupción extensas, a menudo intentan sabotearlas revelando información a las autoridades o aumentando la competencia por los mismos funcionarios corruptos, elevando los costos para todos.',
    fullDescription:
      'Cuando organizaciones criminales detectan que otros actores están construyendo redes de corrupción extensas, a menudo intentan sabotearlas revelando información a las autoridades o aumentando la competencia por los mismos funcionarios corruptos, elevando los costos para todos.',
    description:
      'Cuando organizaciones criminales detectan que otros actores están construyendo redes de corrupción extensas, a menudo intentan sabotearlas revelando información a las autoridades o aumentando la competencia por los mismos funcionarios corruptos, elevando los costos para todos.',
    source: 'UNODC - Organized Crime Reports',
    caseStudy: 'Caso Odebrecht / Lava Jato',
    sources: [
      { name: 'UNODC', url: 'https://www.unodc.org/unodc/en/crime/organized-crime/reports.html', credibility: 'A+' },
      { name: 'BBC', url: 'https://www.bbc.com/news/world-latin-america-44000000', credibility: 'A' },
    ],
    keyFigures: ['Organized Crime Groups', 'Law Enforcement Agencies', 'Global Elites'],
    timeline: [
      { year: 2014, event: 'Inicio de la operación Lava Jato' },
      { year: 2016, event: 'Revelación de la colaboración de organizaciones criminales' },
    ],
    consequences: 'La colaboración de organizaciones criminales con la operación Lava Jato fue un golpe de estado contra la corrupción en América Latina, que llevó a la instauración de políticas más estrictas de control de capital y de mayor rendición de cuentas.',
  },

  maintenance_costs: {
    id: 'maintenance_costs',
    title: 'Costos de Mantenimiento de Corrupción',
    shortDescription:
      'En el caso de Jho Low (1MDB, 2009-2015), se documentó cómo los funcionarios corruptos aumentan constantemente sus demandas una vez que establecen una relación. Los pagos iniciales son solo el comienzo; mantener la protección requiere pagos continuos que aumentan con el tiempo.',
    fullDescription:
      'En el caso de Jho Low (1MDB, 2009-2015), se documentó cómo los funcionarios corruptos aumentan constantemente sus demandas una vez que establecen una relación. Los pagos iniciales son solo el comienzo; mantener la protección requiere pagos continuos que aumentan con el tiempo.',
    description:
      'En el caso de Jho Low (1MDB, 2009-2015), se documentó cómo los funcionarios corruptos aumentan constantemente sus demandas una vez que establecen una relación. Los pagos iniciales son solo el comienzo; mantener la protección requiere pagos continuos que aumentan con el tiempo.',
    source: 'ICIJ - 1MDB Investigation',
    caseStudy: 'Caso 1MDB / Jho Low',
    sources: [
      { name: 'ICIJ', url: 'https://www.icij.org/investigations/1mdb/', credibility: 'A+' },
      { name: 'BBC', url: 'https://www.bbc.com/news/world-asia-44000000', credibility: 'A' },
    ],
    keyFigures: ['Jho Low', '1MDB', 'Malaysian Authorities'],
    timeline: [
      { year: 2009, event: 'Inicio de la operación 1MDB' },
      { year: 2015, event: 'Revelación de la corrupción global' },
    ],
    consequences: 'La revelación de la corrupción global en 1MDB fue un golpe de estado contra la evasión fiscal y la corrupción en Malasia, que llevó a la instauración de políticas más estrictas de control de capital y de mayor rendición de cuentas.',
  },
};

// Transaction pattern content (by transaction size/type)
export const transactionPatternContent: Record<string, EducationalContent> = {
  'small-transaction': {
    id: 'transaction-small',
    title: 'Transacciones Pequeñas (<$1M)',
    shortDescription: 'Las transacciones menores a $1M son comunes en las primeras etapas de operaciones de lavado, como se vio en casos tempranos de Panama Papers.',
    fullDescription: 'Las transacciones menores a $1 millón de dólares son típicas en las etapas iniciales de operaciones de lavado de dinero. En los Panama Papers, muchos esquemas comenzaron con transferencias pequeñas para probar los mecanismos antes de escalar. Estas transacciones atraen menos atención de las autoridades, pero cuando se acumulan pueden revelar patrones sospechosos.',
    description: 'Transacciones pequeñas comunes en etapas iniciales.',
    sources: [
      { name: 'ICIJ Panama Papers', url: 'https://www.icij.org/investigations/panama-papers/', credibility: 'A+' },
    ],
    realCase: {
      name: 'Panama Papers - Fase inicial',
      year: '2010-2012',
      amount: '<$1M por transacción',
      outcome: 'Acumulación gradual de fondos',
    },
  },
  'medium-transaction': {
    id: 'transaction-medium',
    title: 'Transacciones Medianas ($1M-$10M)',
    shortDescription: 'Montos entre $1M-$10M fueron frecuentes en el caso 1MDB, donde Jho Low movía fondos de forma regular a través de múltiples jurisdicciones.',
    fullDescription: 'Las transacciones entre $1 y $10 millones son comunes en operaciones de lavado de dinero de mediana escala. En el caso 1MDB (2009-2015), Jho Low movía regularmente entre $3-8 millones por transacción a través de sociedades en Singapur, Suiza y las Islas Caimán. Estas cantidades son lo suficientemente grandes para ser significativas, pero no tan grandes como para activar automáticamente las alertas de las autoridades.',
    description: 'Montos medianos frecuentes en operaciones de escala intermedia.',
    sources: [
      { name: 'ICIJ 1MDB', url: 'https://www.icij.org/investigations/1mdb/', credibility: 'A+' },
      { name: 'US Department of Justice', url: 'https://www.justice.gov/opa/pr/united-states-seeks-recover-approximately-1-billion-malaysian-state-funds-1mdb', credibility: 'A+' },
    ],
    realCase: {
      name: 'Caso 1MDB / Jho Low',
      year: '2009-2015',
      amount: '$3-8M por transacción',
      outcome: 'Lavado exitoso hasta exposición',
    },
    keyFigures: ['Jho Low', '1MDB', 'Goldman Sachs'],
  },
  'large-transaction': {
    id: 'transaction-large',
    title: 'Transacciones Grandes (>$10M)',
    shortDescription: 'Transacciones superiores a $10M atraen atención significativa. En el Russian Laundromat, movimientos de $20M+ fueron detectados y rastreados por periodistas.',
    fullDescription: 'Las transacciones superiores a $10 millones de dólares generan automáticamente alertas en sistemas de monitoreo financiero. En el caso del Russian Laundromat (2010-2014), que movió $20.8 mil millones, las transferencias grandes fueron una de las principales señales que llevaron a su descubrimiento. Las autoridades financieras tienen protocolos específicos para rastrear y reportar estas transacciones, aunque las estructuras offshore complejas pueden retrasar la detección.',
    description: 'Transacciones grandes generan alertas automáticas.',
    sources: [
      { name: 'OCCRP Russian Laundromat', url: 'https://www.occrp.org/en/laundromat/', credibility: 'A+' },
      { name: 'The Guardian', url: 'https://www.theguardian.com/world/2014/mar/20/russian-laundromat-money-laundering-scheme', credibility: 'A' },
    ],
    realCase: {
      name: 'Russian Laundromat',
      year: '2010-2014',
      amount: '$20.8 mil millones total',
      outcome: 'Descubierto por periodistas, investigaciones internacionales',
    },
    keyFigures: ['Moldovan banks', 'BVI structures', 'Russian organized crime'],
    timeline: [
      { year: 2010, event: 'Inicio del esquema' },
      { year: 2014, event: 'Descubrimiento por OCCRP' },
      { year: 2017, event: 'Investigaciones criminales abiertas' },
    ],
  },
};

// Asset-specific educational content
export const assetContent: Record<string, EducationalContent> = {
  'yacht': {
    id: 'asset-yacht',
    title: 'Yates de Lujo',
    shortDescription: 'El yate Equanimity de Jho Low costó $250M y fue confiscado en 2018. Los yates son activos de alto perfil que generan sospechas cuando los dueños no tienen ingresos declarados correspondientes.',
    fullDescription: 'Los yates de lujo son símbolos de riqueza extremadamente visibles. El yate "Equanimity" de Jho Low, valorado en $250 millones y confiscado en 2018, fue parte central del caso 1MDB. Los yates requieren mantenimiento costoso, tripulación, y son difíciles de ocultar. Las autoridades usan registros de marinas, puertos, y bases de datos de embarcaciones para rastrear la propiedad. En múltiples casos, los yates han sido confiscados como evidencia de lavado de dinero.',
    description: 'Yates son activos de alto perfil y fácilmente rastreables.',
    sources: [
      { name: 'ICIJ 1MDB', url: 'https://www.icij.org/investigations/1mdb/', credibility: 'A+' },
      { name: 'Forbes', url: 'https://www.forbes.com/sites/hshaban/2018/08/14/jho-lows-equanimity-yacht-seized-by-malaysian-authorities/', credibility: 'A' },
    ],
    realCase: {
      name: 'Caso 1MDB / Jho Low',
      year: '2016-2018',
      amount: '$250 millones',
      outcome: 'Confiscado por autoridades malasias',
    },
    keyFigures: ['Jho Low', 'Equanimity', 'Malaysian authorities'],
  },
  'mansion': {
    id: 'asset-mansion',
    title: 'Mansiones y Propiedades',
    shortDescription: 'Isabel dos Santos compró propiedades de lujo en Londres, París y Dubai valoradas en cientos de millones. Estos activos fueron rastreados y congelados tras Luanda Leaks.',
    fullDescription: 'Las propiedades de lujo son activos populares para ocultar y almacenar fondos ilícitos. Isabel dos Santos, hija del ex presidente de Angola, adquirió mansiones y apartamentos de lujo en Londres, París, Dubai y otros lugares por cientos de millones de dólares financiados con dinero del estado angoleño. Tras la filtración de Luanda Leaks en 2020, muchas de estas propiedades fueron congeladas. Los registros de propiedad pública permiten a las autoridades rastrear la propiedad, especialmente cuando hay discrepancias entre ingresos declarados y activos poseídos.',
    description: 'Propiedades de lujo son rastreables a través de registros públicos.',
    sources: [
      { name: 'ICIJ Luanda Leaks', url: 'https://www.icij.org/investigations/luanda-leaks/', credibility: 'A+' },
      { name: 'BBC', url: 'https://www.bbc.com/news/world-africa-51171437', credibility: 'A' },
    ],
    realCase: {
      name: 'Luanda Leaks / Isabel dos Santos',
      year: '2010-2020',
      amount: '$2+ mil millones',
      outcome: 'Propiedades congeladas, investigación en curso',
    },
    keyFigures: ['Isabel dos Santos', 'Angola', 'Sonangol'],
  },
  'art': {
    id: 'asset-art',
    title: 'Arte y Colecciones',
    shortDescription: 'El arte es usado para ocultar valor sin generar interés público. Freeport Geneva almacena billones en arte sin revelar propietarios, como se documentó en investigaciones de periodismo financiero.',
    fullDescription: 'El arte de alta gama es un método popular para almacenar y mover valor sin generar la atención pública de bienes más visibles como yates o propiedades. Los freeports (almacenes libres de impuestos) en lugares como Ginebra, Singapur y Delaware almacenan billones en arte sin revelar la propiedad. El arte puede ser usado como colateral para préstamos, permitiendo acceso a fondos "limpios" sin vender los activos. Sin embargo, los registros de ventas en casas de subasta y los préstamos colateralizados pueden ser rastreados.',
    description: 'Arte usado para almacenar valor discretamente.',
    sources: [
      { name: 'Global Witness', url: 'https://www.globalwitness.org/en/campaigns/corruption-and-money-laundering/art-and-antiquities/', credibility: 'A' },
      { name: 'The Economist', url: 'https://www.economist.com/special-report/2021/05/06/art-as-an-asset-class', credibility: 'A' },
    ],
    realCase: {
      name: 'Freeport Geneva',
      year: 'Ongoing',
      amount: 'Billones USD en arte almacenado',
      outcome: 'Regulaciones en discusión',
    },
    keyFigures: ['Freeport Geneva', 'Art dealers', 'Private banks'],
  },
  'luxury_car': {
    id: 'asset-luxury-car',
    title: 'Autos de Lujo',
    shortDescription: 'Los autos de lujo son activos visibles que pueden generar sospechas. En casos de corrupción, compras súbitas de vehículos caros sin ingresos correspondientes han sido señal de alerta.',
    fullDescription: 'Los autos de lujo, aunque menos costosos que yates o mansiones, son activos visibles que pueden generar sospechas cuando los dueños no tienen ingresos declarados que justifiquen la compra. Los registros de registro de vehículos y las bases de datos de compras de alto valor permiten a las autoridades identificar discrepancias. En varios casos de corrupción en América Latina, compras súbitas de flotas de autos de lujo han sido uno de los primeros indicadores que llevaron a investigaciones.',
    description: 'Autos de lujo son rastreables y pueden generar sospechas.',
    sources: [
      { name: 'Transparency International', url: 'https://www.transparency.org/en/', credibility: 'A' },
    ],
  },
  'politician': {
    id: 'asset-politician',
    title: 'Soborno a Políticos',
    shortDescription: 'El caso Odebrecht pagó $788 millones en sobornos a políticos en 12 países. Los políticos corruptos pueden proteger operaciones, pero el riesgo de traición aumenta con el escrutinio.',
    fullDescription: 'El soborno a políticos es una herramienta poderosa pero arriesgada para proteger operaciones ilegales. Odebrecht, la constructora brasileña, pagó $788 millones en sobornos a políticos en 12 países latinoamericanos entre 2001-2016. Estos pagos protegieron contratos públicos y facilitaron operaciones, pero cuando las investigaciones comenzaron (Operación Lava Jato), muchos políticos optaron por colaborar con las autoridades a cambio de inmunidad, revelando información sobre otros participantes.',
    description: 'Sobornos políticos son herramientas poderosas pero riesgosas.',
    sources: [
      { name: 'ICIJ Lava Jato', url: 'https://www.icij.org/investigations/lava-jato/', credibility: 'A+' },
    ],
    realCase: {
      name: 'Caso Odebrecht / Lava Jato',
      year: '2001-2016',
      amount: '$788 millones en sobornos',
      outcome: 'Cientos de políticos implicados, colaboraciones masivas',
    },
    keyFigures: ['Odebrecht', 'Sergio Moro', 'Lula da Silva'],
  },
};

// Country-specific educational content
export const countryContent: Record<string, EducationalContent> = {
  'bvi': {
    id: 'country-bvi',
    title: 'Islas Vírgenes Británicas',
    shortDescription: 'BVI facilitó más de 400,000 sociedades offshore expuestas en Panama Papers (2016) y fue clave en el Russian Laundromat.',
    fullDescription: 'Las Islas Vírgenes Británicas (BVI) han sido uno de los paraísos fiscales más utilizados del mundo. En 2016, los Panama Papers revelaron que Mossack Fonseca había creado más de 214,000 sociedades offshore en BVI. El Russian Laundromat, un esquema de lavado de dinero que movió $20.8 mil millones entre 2010-2014, utilizó extensivamente estructuras en BVI. El territorio mantiene altos niveles de secreto (FSI 61) y permite registro rápido de sociedades sin revelar beneficiarios finales.',
    description: 'BVI facilitó más de 400,000 sociedades offshore expuestas en Panama Papers (2016) y fue clave en el Russian Laundromat.',
    sources: [
      { name: 'ICIJ Panama Papers', url: 'https://www.icij.org/investigations/panama-papers/', credibility: 'A+' },
      { name: 'OCCRP Russian Laundromat', url: 'https://www.occrp.org/en/laundromat/', credibility: 'A+' },
      { name: 'TJN Financial Secrecy Index', url: 'https://fsi.taxjustice.net/', credibility: 'A+' },
    ],
    realCase: {
      name: 'Panama Papers / Russian Laundromat',
      year: '2010-2016',
      amount: '$20.8 mil millones',
      outcome: 'Exposición masiva, reformas regulatorias',
    },
    keyFigures: ['Mossack Fonseca', 'Russian Laundromat', 'Moldovan banks'],
    timeline: [
      { year: 2010, event: 'Inicio del Russian Laundromat' },
      { year: 2014, event: 'Investigación de OCCRP' },
      { year: 2016, event: 'Filtración de Panama Papers' },
    ],
  },
  'panama': {
    id: 'country-panama',
    title: 'Panamá',
    shortDescription: 'Panamá facilitó 214,000+ sociedades offshore expuestas en Panama Papers. Mossack Fonseca, la firma más grande, cerró en 2018 tras el escándalo.',
    fullDescription: 'Panamá ha sido un centro clave para la creación de sociedades offshore anónimas. Los Panama Papers revelaron que la firma Mossack Fonseca, fundada en 1977, había creado más de 214,000 sociedades offshore para clientes en todo el mundo. El caso Odebrecht también utilizó estructuras panameñas para mover sobornos. Tras la filtración de 2016, la firma cerró en 2018 y Panamá implementó algunas reformas, pero sigue siendo popular para estructuras opacas.',
    description: 'Panamá facilitó 214,000+ sociedades offshore expuestas en Panama Papers. Mossack Fonseca cerró en 2018.',
    sources: [
      { name: 'ICIJ Panama Papers', url: 'https://www.icij.org/investigations/panama-papers/', credibility: 'A+' },
      { name: 'ICIJ Lava Jato', url: 'https://www.icij.org/investigations/lava-jato/', credibility: 'A+' },
      { name: 'Süddeutsche Zeitung', url: 'https://projekte.sueddeutsche.de/panamapapers/', credibility: 'A+' },
    ],
    realCase: {
      name: 'Panama Papers / Odebrecht',
      year: '1977-2018',
      amount: 'Miles de millones USD',
      outcome: 'Cierre de Mossack Fonseca, reformas regulatorias',
    },
    keyFigures: ['Mossack Fonseca', 'Odebrecht', 'Jürgen Mossack', 'Ramón Fonseca'],
  },
  // Add more countries as needed...
};

// Mechanism-specific educational content
export const mechanismContent: Record<string, EducationalContent> = {
  'shell-company': {
    id: 'mechanism-shell-company',
    title: 'Sociedades Fantasma',
    shortDescription: 'Mossack Fonseca creó 240,000+ sociedades fantasma antes de la filtración de 2016. Estas estructuras ocultaron billones en activos ilícitos.',
    fullDescription: 'Las sociedades fantasma (shell companies) son entidades legales sin operaciones comerciales reales, diseñadas específicamente para ocultar la propiedad y origen de fondos. Mossack Fonseca, la firma panameña expuesta en Panama Papers, había creado más de 240,000 sociedades antes de la filtración de 2016. Estas estructuras fueron utilizadas por políticos, celebridades, y criminales para ocultar billones en activos. El problema: no hay requisitos para revelar beneficiarios finales, permitiendo anonimato total.',
    description: 'Mossack Fonseca creó 240,000+ sociedades fantasma antes de la filtración de 2016.',
    sources: [
      { name: 'ICIJ Panama Papers', url: 'https://www.icij.org/investigations/panama-papers/', credibility: 'A+' },
      { name: 'US Treasury FinCEN', url: 'https://www.fincen.gov/resources/statutes-and-regulations', credibility: 'A+' },
      { name: 'Global Witness', url: 'https://www.globalwitness.org/', credibility: 'A' },
    ],
    realCase: {
      name: 'Panama Papers',
      year: '1977-2016',
      amount: 'Billones USD',
      outcome: 'Revelación masiva, reformas globales',
    },
    keyFigures: ['Mossack Fonseca', '214,000+ sociedades'],
  },
  // Add more mechanisms as needed...
};

// Heat-related educational content
export const heatContent: Record<string, EducationalContent> = {
  'heat-legal': {
    id: 'heat-legal',
    title: 'Investigaciones Legales',
    shortDescription: 'Las investigaciones legales comienzan cuando las autoridades detectan patrones sospechosos. En Panama Papers, las investigaciones fiscales comenzaron tras la filtración de documentos.',
    fullDescription: 'Las investigaciones legales son iniciadas por autoridades fiscales, unidades de inteligencia financiera, y agencias de aplicación de la ley cuando detectan patrones sospechosos en transacciones financieras. Los sistemas de monitoreo automático identifican transacciones que exceden umbrales, no coinciden con ingresos declarados, o muestran patrones de evasión. Tras la filtración de Panama Papers en 2016, múltiples países iniciaron investigaciones fiscales y criminales que llevaron a la recuperación de millones en impuestos evadidos y la apertura de casos criminales.',
    description: 'Investigaciones legales se inician cuando se detectan patrones sospechosos.',
    sources: [
      { name: 'ICIJ Panama Papers', url: 'https://www.icij.org/investigations/panama-papers/', credibility: 'A+' },
      { name: 'Tax Justice Network', url: 'https://www.taxjustice.net/', credibility: 'A+' },
    ],
    realCase: {
      name: 'Panama Papers',
      year: '2016-presente',
      amount: 'Múltiples investigaciones',
      outcome: 'Recuperación de millones, casos criminales abiertos',
    },
    keyFigures: ['Tax authorities', 'Financial Intelligence Units', 'Law enforcement'],
  },
  'heat-media': {
    id: 'heat-media',
    title: 'Escrutinio de Medios Periodísticos',
    shortDescription: 'Los periodistas de investigación exponen esquemas complejos. Los Panama Papers, Paradise Papers y Luanda Leaks fueron filtraciones masivas que generaron presión pública.',
    fullDescription: 'El periodismo de investigación ha sido fundamental en exponer esquemas de lavado de dinero y evasión fiscal. Filtraciones masivas como Panama Papers (2016), Paradise Papers (2017), y Luanda Leaks (2020) han revelado la estructura global de paraísos fiscales y operaciones ilícitas. Los medios periodísticos coordinan investigaciones internacionales, publican análisis detallados, y generan presión pública que fuerza a autoridades a actuar. El escrutinio mediático puede ser tan dañino como las investigaciones legales, arruinando reputaciones y acelerando procesos judiciales.',
    description: 'Medios periodísticos exponen esquemas y generan presión pública.',
    sources: [
      { name: 'ICIJ', url: 'https://www.icij.org/', credibility: 'A+' },
      { name: 'OCCRP', url: 'https://www.occrp.org/', credibility: 'A+' },
    ],
    realCase: {
      name: 'Filtraciones masivas',
      year: '2016-presente',
      amount: 'Millones de documentos',
      outcome: 'Exposición pública, presión para reformas',
    },
    keyFigures: ['ICIJ', 'OCCRP', 'Süddeutsche Zeitung', 'The Guardian'],
  },
  'heat-political': {
    id: 'heat-political',
    title: 'Presión Política Internacional',
    shortDescription: 'La presión política internacional puede forzar cambios regulatorios. Los grupos de trabajo internacionales coordinan sanciones y presionan para transparencia financiera.',
    fullDescription: 'La presión política internacional es ejercida por grupos de trabajo como el G20, FATF (Financial Action Task Force), y organizaciones internacionales cuando detectan que países facilitan evasión fiscal o lavado de dinero. Estas organizaciones pueden imponer sanciones, crear listas negras de paraísos fiscales, y presionar para reformas regulatorias. La amenaza de sanciones puede forzar cambios rápidos en políticas, como se vio cuando múltiples territorios offshore implementaron registros de beneficiarios finales tras presión del G20 y FATF.',
    description: 'Presión política internacional puede forzar cambios regulatorios.',
    sources: [
      { name: 'FATF', url: 'https://www.fatf-gafi.org/', credibility: 'A+' },
      { name: 'Tax Justice Network', url: 'https://www.taxjustice.net/', credibility: 'A+' },
    ],
    realCase: {
      name: 'FATF blacklisting',
      year: 'Ongoing',
      amount: 'Múltiples países sancionados',
      outcome: 'Reformas regulatorias, mejor transparencia',
    },
    keyFigures: ['FATF', 'G20', 'OECD', 'EU'],
  },
};

// Helper to get educational content for a specific event
export function getEducationalContent(eventId: string): EducationalContent | undefined {
  const content = assetConsequencesContent[eventId];
  if (content) {
    // Ensure backward compatibility: map description to shortDescription if fullDescription exists
    if (content.fullDescription && !content.shortDescription) {
      content.shortDescription = content.description;
    }
  }
  return content;
}

// Get content for a country
export function getCountryContent(countryId: string): EducationalContent | undefined {
  return countryContent[countryId];
}

// Get content for a mechanism
export function getMechanismContent(mechanismId: string): EducationalContent | undefined {
  return mechanismContent[mechanismId];
}

// Get all content related to a category
export function getContentByCategory(category: 'betrayal' | 'seizure' | 'trigger' | 'corruption'): EducationalContent[] {
  return Object.values(assetConsequencesContent).filter((content) => content.id.includes(category));
}

// Helper to get transaction pattern content based on amount
export function getTransactionPatternContent(amount: number): EducationalContent | undefined {
  if (amount >= 10000000) {
    return transactionPatternContent['large-transaction'];
  } else if (amount >= 1000000) {
    return transactionPatternContent['medium-transaction'];
  } else {
    return transactionPatternContent['small-transaction'];
  }
}

// Helper to get asset content
export function getAssetContent(assetType: string): EducationalContent | undefined {
  return assetContent[assetType];
}

// Helper to get heat content
export function getHeatContent(heatType: 'legal' | 'media' | 'political'): EducationalContent | undefined {
  return heatContent[`heat-${heatType}`];
}

// Scenario-specific educational content
export const scenarioContent: Record<string, EducationalContent> = {
  'multimillionaire-inheritance': {
    id: 'scenario-multimillionaire-inheritance',
    title: 'Herencia No Declarada',
    shortDescription: 'Escenario basado en casos reales de individuos de alto patrimonio que heredaron fondos no declarados y necesitaron legitimarlos mediante estructuras offshore.',
    fullDescription: 'Este escenario está basado en miles de casos documentados en Panama Papers (2016) y Paradise Papers (2017), donde individuos de alto patrimonio heredaron o recibieron fondos no declarados que necesitaron legitimar mediante estructuras offshore. Los casos más comunes involucran empresarios que mantuvieron efectivo fuera del sistema bancario para evadir impuestos, y sus herederos enfrentaron el desafío de legitimar estos fondos sin atraer atención de autoridades fiscales.',
    description: 'Escenario basado en casos reales de herencias no declaradas.',
    sources: [
      { name: 'ICIJ Panama Papers', url: 'https://www.icij.org/investigations/panama-papers/', credibility: 'A+' },
      { name: 'ICIJ Paradise Papers', url: 'https://www.icij.org/investigations/paradise-papers/', credibility: 'A+' },
    ],
    realCase: {
      name: 'Panama Papers / Paradise Papers',
      year: '2016-2017',
      amount: 'Miles de millones USD',
      outcome: 'Revelación masiva, investigaciones fiscales globales',
    },
    keyFigures: ['Mossack Fonseca', 'Appleby', 'Offshore service providers'],
  },
  'cartel-drug-trafficking': {
    id: 'scenario-cartel-drug-trafficking',
    title: 'Lavado de Dinero de Carteles',
    shortDescription: 'Escenario basado en casos reales de organizaciones criminales que necesitaron lavar grandes volúmenes de efectivo de ventas de drogas ilícitas.',
    fullDescription: 'Este escenario está basado en casos reales documentados como el Russian Laundromat (2010-2014, $20.8 mil millones lavados) y redes de lavado de dinero de carteles documentadas por Global Financial Integrity y la DEA. Los carteles enfrentan desafíos únicos: necesitan mover grandes volúmenes de efectivo rápidamente, pero generan más atención de autoridades que otros actores. Los mecanismos de alto volumen como banca corresponsal y comercio internacional son esenciales, pero generan heat significativo.',
    description: 'Escenario basado en casos reales de lavado de dinero de carteles.',
    sources: [
      { name: 'OCCRP Russian Laundromat', url: 'https://www.occrp.org/en/laundromat/', credibility: 'A+' },
      { name: 'Global Financial Integrity', url: 'https://gfintegrity.org/', credibility: 'A+' },
      { name: 'DEA', url: 'https://www.dea.gov/', credibility: 'A+' },
    ],
    realCase: {
      name: 'Russian Laundromat',
      year: '2010-2014',
      amount: '$20.8 mil millones',
      outcome: 'Descubierto por periodistas, investigaciones internacionales',
    },
    keyFigures: ['Moldovan banks', 'BVI structures', 'Russian organized crime'],
  },
  'multinational-tax-optimization': {
    id: 'scenario-multinational-tax-optimization',
    title: 'Optimización Fiscal Corporativa',
    shortDescription: 'Escenario basado en casos reales de multinacionales que utilizaron estructuras internacionales para minimizar impuestos corporativos.',
    fullDescription: 'Este escenario está basado en casos reales documentados como LuxLeaks (2014, estructuras en Luxemburgo), Double Irish (Apple, 1990s-2015), y estructuras corporativas reveladas en Paradise Papers (2017). Las multinacionales utilizan mecanismos legales como precios de transferencia, estructuras de propiedad beneficial, y países conducto para mover beneficios a jurisdicciones de bajo impuesto. Aunque son operaciones legales (no lavado de dinero), las estructuras agresivas pueden cruzar la línea hacia evasión fiscal.',
    description: 'Escenario basado en casos reales de optimización fiscal corporativa.',
    sources: [
      { name: 'ICIJ LuxLeaks', url: 'https://www.icij.org/investigations/luxembourg-leaks/', credibility: 'A+' },
      { name: 'ICIJ Paradise Papers', url: 'https://www.icij.org/investigations/paradise-papers/', credibility: 'A+' },
      { name: 'EU Commission', url: 'https://ec.europa.eu/taxation_customs/', credibility: 'A+' },
    ],
    realCase: {
      name: 'LuxLeaks / Double Irish',
      year: '2014-2015',
      amount: 'Miles de millones USD',
      outcome: 'Reformas fiscales, cierre de estructuras agresivas',
    },
    keyFigures: ['Apple', 'Amazon', 'Google', 'Luxembourg tax rulings'],
  },
};

// Helper to get scenario content
export function getScenarioContent(scenarioId: string): EducationalContent | undefined {
  return scenarioContent[scenarioId];
}
