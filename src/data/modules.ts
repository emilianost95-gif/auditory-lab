import type { TopicId } from './types';

export type ModuleId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ModuleMeta {
  id: ModuleId;
  code: string;
  title: string;
  kicker: string;
  topic: TopicId | 'lab';
  minutes: number;
  summary: string[];
  concepts: { term: string; def: string }[];
}

export const MODULES: ModuleMeta[] = [
  {
    id: 1,
    code: '01',
    title: 'Introducción a la audición',
    kicker: 'Sonido, vibración y percepción',
    topic: 'intro',
    minutes: 8,
    summary: [
      'El sonido es una onda mecánica: una vibración que se propaga por un medio material (aire, agua, sólidos). En el vacío no hay sonido.',
      'El oído es el órgano que recibe las ondas sonoras y las transforma en impulsos nerviosos.',
      'La audición es el proceso completo: recepción en el oído, transmisión por el nervio auditivo e interpretación en el cerebro.',
      'Los humanos jóvenes oímos aproximadamente entre 20 Hz y 20 000 Hz.',
    ],
    concepts: [
      { term: 'Vibración', def: 'Movimiento de ida y vuelta de un objeto alrededor de una posición de equilibrio.' },
      { term: 'Onda sonora', def: 'Perturbación de presión que se propaga por un medio transportando energía, no materia.' },
      { term: 'Audición', def: 'Sentido que permite percibir sonidos: oído (recibe y transforma) + cerebro (interpreta).' },
      { term: 'Medio', def: 'Material por el que viaja el sonido. Sin medio no hay propagación.' },
    ],
  },
  {
    id: 2,
    code: '02',
    title: 'Anatomía del oído humano',
    kicker: 'Externo · medio · interno',
    topic: 'anatomia',
    minutes: 15,
    summary: [
      'Oído externo (pabellón y conducto): capta y conduce las ondas hasta el tímpano.',
      'Oído medio (tímpano, martillo, yunque, estribo y trompa de Eustaquio): transforma la onda en vibración mecánica y la amplifica.',
      'Oído interno (cóclea, vestíbulo, canales semicirculares y nervio): transforma la vibración en impulsos nerviosos y detecta el equilibrio.',
      'Vestíbulo y canales semicirculares pertenecen al oído pero su función es el equilibrio, no la audición.',
    ],
    concepts: [
      { term: 'Huesecillos', def: 'Martillo, yunque y estribo: los huesos más pequeños del cuerpo.' },
      { term: 'Ventana oval', def: 'Abertura donde el estribo transmite la vibración al líquido de la cóclea.' },
      { term: 'Órgano de Corti', def: 'Estructura de la cóclea que contiene las células ciliadas.' },
      { term: 'VIII par craneal', def: 'Nervio vestibulococlear: rama coclear (audición) y vestibular (equilibrio).' },
    ],
  },
  {
    id: 3,
    code: '03',
    title: 'El recorrido del sonido',
    kicker: 'De la fuente al cerebro en 10 etapas',
    topic: 'recorrido',
    minutes: 10,
    summary: [
      'El sonido cambia de forma a lo largo del recorrido: onda en el aire → vibración de sólidos → ondas en líquido → señal eléctrica → percepción.',
      'El tímpano y los huesecillos adaptan la energía del aire al líquido del oído interno (adaptación de impedancia).',
      'Las células ciliadas realizan la transducción: convierten el movimiento en señales eléctricas.',
      'El nervio auditivo transporta impulsos nerviosos; la corteza auditiva del lóbulo temporal los interpreta.',
    ],
    concepts: [
      { term: 'Transducción', def: 'Conversión de un tipo de energía en otro: aquí, mecánica en electroquímica.' },
      { term: 'Impulso nervioso', def: 'Señal eléctrica (potencial de acción) que viaja por las neuronas.' },
      { term: 'Tonotopía', def: 'Cada zona de la cóclea responde mejor a una frecuencia: base = agudos, vértice = graves.' },
      { term: 'Corteza auditiva', def: 'Área del lóbulo temporal donde se procesa la información auditiva.' },
    ],
  },
  {
    id: 4,
    code: '04',
    title: 'Física del sonido',
    kicker: 'Frecuencia, amplitud, longitud de onda, velocidad',
    topic: 'fisica',
    minutes: 14,
    summary: [
      'Frecuencia (f): oscilaciones por segundo, en hercios (Hz). Es una magnitud física medible.',
      'Amplitud: tamaño máximo de la variación de presión. A mayor amplitud, más energía e intensidad.',
      'Longitud de onda (λ): distancia entre dos compresiones consecutivas. Se cumple v = λ · f.',
      'La velocidad depende del medio: ~343 m/s en aire (20 °C), ~1 480 m/s en agua, ~5 960 m/s en acero.',
    ],
    concepts: [
      { term: 'Hercio (Hz)', def: 'Una oscilación por segundo.' },
      { term: 'v = λ · f', def: 'En un mismo medio, si la frecuencia se duplica, la longitud de onda se reduce a la mitad.' },
      { term: 'Decibel (dB)', def: 'Escala logarítmica del nivel sonoro: +10 dB ≈ 10 veces más intensidad.' },
      { term: 'Física ≠ percepción', def: 'Frecuencia e intensidad se miden; tono y sonoridad se perciben.' },
    ],
  },
  {
    id: 5,
    code: '05',
    title: 'Características del sonido',
    kicker: 'Tono · timbre · intensidad',
    topic: 'caracteristicas',
    minutes: 10,
    summary: [
      'Tono (altura): cualidad que distingue graves y agudos. Depende principalmente de la frecuencia.',
      'Timbre: permite distinguir dos fuentes que producen la misma nota con igual intensidad. Depende de la forma de onda (armónicos).',
      'Intensidad: distingue sonidos fuertes y débiles. Se relaciona con la amplitud; se mide en dB.',
    ],
    concepts: [
      { term: 'Fundamental', def: 'Frecuencia más baja de un sonido complejo; define la nota.' },
      { term: 'Armónicos', def: 'Frecuencias múltiplos de la fundamental; su mezcla define el timbre.' },
      { term: 'Sonoridad', def: 'Percepción subjetiva de la intensidad; depende también de la frecuencia.' },
    ],
  },
  {
    id: 6,
    code: '06',
    title: 'Salud auditiva',
    kicker: 'Prevención y cuidado',
    topic: 'salud',
    minutes: 9,
    summary: [
      'La exposición a más de 85 dB(A) durante 8 horas puede dañar las células ciliadas; cada +3 dB, el tiempo seguro se reduce a la mitad.',
      'El daño en las células ciliadas produce pérdida neurosensorial permanente: en humanos no se regeneran.',
      'Zumbido (tinnitus) u oído "apagado" tras un concierto son señales de alerta.',
      'Auriculares: volumen ≤ 60 %, pausas y preferir modelos con cancelación de ruido.',
    ],
    concepts: [
      { term: 'Hipoacusia de conducción', def: 'El sonido no llega bien al oído interno (cerumen, tímpano, huesecillos).' },
      { term: 'Hipoacusia neurosensorial', def: 'Daño en la cóclea o el nervio; suele ser permanente.' },
      { term: 'Tinnitus', def: 'Percepción de un zumbido sin fuente externa.' },
      { term: 'Dosis de ruido', def: 'Combinación de nivel (dB) y tiempo de exposición.' },
    ],
  },
  {
    id: 7,
    code: '07',
    title: 'Laboratorio interactivo',
    kicker: '5 experimentos guiados',
    topic: 'lab',
    minutes: 15,
    summary: [
      'Experimenta con frecuencia y amplitud para ver cómo cambia la onda.',
      'Compara ondas de baja y alta frecuencia en la misma escala.',
      'Simula el recorrido del sonido y compara timbres mediante sus formas de onda.',
    ],
    concepts: [
      { term: 'Variable independiente', def: 'Lo que modificas en el experimento (frecuencia, amplitud).' },
      { term: 'Observación', def: 'Lo que cambia como consecuencia y registras.' },
    ],
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, ModuleMeta>;

export const TOPIC_MODULE: Record<TopicId, ModuleId> = {
  intro: 1,
  anatomia: 2,
  recorrido: 3,
  fisica: 4,
  caracteristicas: 5,
  salud: 6,
};

export const TOPIC_NAME: Record<TopicId, string> = {
  intro: 'Introducción a la audición',
  anatomia: 'Anatomía del oído',
  recorrido: 'Recorrido del sonido',
  fisica: 'Física del sonido',
  caracteristicas: 'Características del sonido',
  salud: 'Salud auditiva',
};
