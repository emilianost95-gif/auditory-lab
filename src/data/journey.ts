import type { StructureId } from './anatomy';

export type Medium = 'aire' | 'sólido' | 'líquido' | 'electroquímico' | 'percepción';

export interface JourneyStep {
  n: number;
  title: string;
  text: string;
  /** Qué tipo de fenómeno ocurre en esta etapa. */
  kind: string;
  medium: Medium;
  highlight: StructureId[];
  /** Ventana de la ilustración [x, y, w, h]. */
  view: [number, number, number, number];
  /** Animaciones activas en la ilustración. */
  fx: Array<'source' | 'waves' | 'canal' | 'drum' | 'ossicles' | 'fluid' | 'hair' | 'nerve' | 'brain'>;
}

const ALL: [number, number, number, number] = [0, 40, 1100, 480];

export const JOURNEY: JourneyStep[] = [
  {
    n: 1,
    title: 'Una fuente vibra',
    text: 'Todo sonido comienza con un objeto que vibra: las cuerdas vocales, la cuerda de una guitarra o la membrana de un parlante. Al moverse empuja y separa las partículas de aire que tiene al lado.',
    kind: 'Vibración mecánica de la fuente',
    medium: 'sólido',
    highlight: [],
    view: [0, 120, 420, 229],
    fx: ['source'],
  },
  {
    n: 2,
    title: 'Se generan ondas sonoras',
    text: 'La vibración se propaga como una onda de presión: zonas de aire comprimido (compresiones) y menos denso (rarefacciones) que avanzan a ~343 m/s. Las partículas solo oscilan en su lugar; lo que viaja es la energía.',
    kind: 'Onda mecánica longitudinal en el aire',
    medium: 'aire',
    highlight: [],
    view: [0, 100, 480, 262],
    fx: ['source', 'waves'],
  },
  {
    n: 3,
    title: 'El pabellón recoge las ondas',
    text: 'La oreja funciona como un embudo: capta las ondas y las dirige hacia el conducto. Sus pliegues alteran ligeramente el sonido según su dirección, una pista que el cerebro usa para localizarlo.',
    kind: 'Captación de la onda',
    medium: 'aire',
    highlight: ['pabellon'],
    view: [100, 70, 470, 256],
    fx: ['waves'],
  },
  {
    n: 4,
    title: 'El conducto las lleva al tímpano',
    text: 'Las ondas recorren los ~2,5 cm del conducto auditivo externo. Su resonancia refuerza los sonidos de 2 000–4 000 Hz, la zona clave para entender la voz humana.',
    kind: 'Conducción de la onda por el aire',
    medium: 'aire',
    highlight: ['conducto'],
    view: [260, 120, 360, 196],
    fx: ['canal'],
  },
  {
    n: 5,
    title: 'El tímpano vibra',
    text: 'Las variaciones de presión empujan y retraen el tímpano, que vibra con la misma frecuencia que el sonido. Aquí la onda del aire se convierte en vibración de un sólido.',
    kind: 'Onda de presión → vibración mecánica',
    medium: 'sólido',
    highlight: ['timpano'],
    view: [470, 160, 220, 120],
    fx: ['canal', 'drum'],
  },
  {
    n: 6,
    title: 'Los huesecillos transmiten y amplifican',
    text: 'Martillo, yunque y estribo transmiten la vibración como una cadena de palancas. Como el tímpano es mucho más grande que la ventana oval, la presión aumenta ~20 veces: así la energía puede pasar del aire al líquido del oído interno sin perderse.',
    kind: 'Transmisión mecánica con amplificación de presión',
    medium: 'sólido',
    highlight: ['martillo', 'yunque', 'estribo'],
    view: [500, 150, 200, 109],
    fx: ['drum', 'ossicles'],
  },
  {
    n: 7,
    title: 'La vibración llega a la cóclea',
    text: 'El estribo empuja la ventana oval y genera ondas en el líquido de la cóclea. Esas ondas recorren la membrana basilar: los agudos la mueven más cerca de la base y los graves cerca del vértice.',
    kind: 'Ondas en un líquido (perilinfa)',
    medium: 'líquido',
    highlight: ['estribo', 'coclea'],
    view: [580, 175, 280, 153],
    fx: ['ossicles', 'fluid'],
  },
  {
    n: 8,
    title: 'Las células ciliadas transforman el movimiento',
    text: 'En el órgano de Corti, el movimiento del líquido inclina los estereocilios de las células ciliadas. Esa inclinación abre canales iónicos y genera una señal eléctrica: es la transducción mecano-eléctrica.',
    kind: 'Vibración → señal electroquímica (transducción)',
    medium: 'electroquímico',
    highlight: ['coclea'],
    view: [630, 215, 240, 131],
    fx: ['fluid', 'hair'],
  },
  {
    n: 9,
    title: 'El nervio auditivo transporta la información',
    text: 'Las neuronas del nervio auditivo disparan impulsos nerviosos (potenciales de acción) que viajan hacia el tronco encefálico. Por el nervio no viaja sonido: viajan señales eléctricas codificadas.',
    kind: 'Impulsos nerviosos',
    medium: 'electroquímico',
    highlight: ['nervio'],
    view: [700, 150, 400, 218],
    fx: ['hair', 'nerve'],
  },
  {
    n: 10,
    title: 'El cerebro interpreta el sonido',
    text: 'La información llega a la corteza auditiva, en el lóbulo temporal. Allí, y en otras áreas del cerebro, se reconoce el tono, el timbre, la dirección y el significado: una voz conocida, una palabra, una melodía. El oído recibe y transforma; el cerebro interpreta.',
    kind: 'Procesamiento e interpretación cerebral',
    medium: 'percepción',
    highlight: [],
    view: ALL,
    fx: ['nerve', 'brain'],
  },
];
