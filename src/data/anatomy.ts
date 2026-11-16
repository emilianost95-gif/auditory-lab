export type RegionId = 'externo' | 'medio' | 'interno';

export type StructureId =
  | 'pabellon'
  | 'conducto'
  | 'timpano'
  | 'martillo'
  | 'yunque'
  | 'estribo'
  | 'trompa'
  | 'coclea'
  | 'vestibulo'
  | 'canales'
  | 'nervio';

export interface Structure {
  id: StructureId;
  name: string;
  alias?: string;
  region: RegionId;
  /** Coordenadas del punto interactivo en el sistema del dibujo (1100 × 520). */
  hotspot: [number, number];
  location: string;
  function: string;
  failure: string;
  fact: string;
}

export const REGIONS: Record<RegionId, { name: string; short: string; summary: string; color: string; view: [number, number, number, number] }> = {
  externo: {
    name: 'Oído externo',
    short: 'Captación',
    summary:
      'Recoge las ondas sonoras del ambiente y las conduce hasta el tímpano. Trabaja con vibraciones del aire.',
    color: '#22d3ee',
    view: [140, 88, 620, 339],
  },
  medio: {
    name: 'Oído medio',
    short: 'Transmisión y amplificación',
    summary:
      'Cavidad llena de aire donde el tímpano y tres huesecillos convierten la vibración del aire en vibración mecánica de los huesos y aumentan su presión unas 20 veces.',
    color: '#3b82f6',
    view: [465, 145, 440, 240],
  },
  interno: {
    name: 'Oído interno',
    short: 'Transducción y equilibrio',
    summary:
      'Laberinto óseo lleno de líquido. La cóclea transforma la vibración en impulsos nerviosos; el vestíbulo y los canales semicirculares informan sobre el equilibrio.',
    color: '#8b5cf6',
    view: [580, 105, 480, 262],
  },
};

export const FULL_VIEW: [number, number, number, number] = [170, 60, 790, 430];

export const STRUCTURES: Structure[] = [
  {
    id: 'pabellon',
    name: 'Pabellón auricular',
    alias: 'Oreja · aurícula',
    region: 'externo',
    hotspot: [218, 200],
    location: 'Parte visible del oído, a cada lado de la cabeza. Está formada por cartílago elástico cubierto de piel.',
    function:
      'Capta las ondas sonoras y las dirige hacia el conducto auditivo. Sus pliegues modifican levemente el sonido según la dirección de la que llega, lo que ayuda al cerebro a localizar la fuente (arriba/abajo, delante/detrás).',
    failure:
      'Una malformación o ausencia (microtia) reduce la captación y dificulta localizar sonidos, aunque por sí sola no suele causar sordera porque el resto del oído funciona.',
    fact: 'Los pliegues del pabellón son únicos en cada persona, como una huella.',
  },
  {
    id: 'conducto',
    name: 'Conducto auditivo externo',
    region: 'externo',
    hotspot: [420, 258],
    location: 'Tubo de unos 2,5 cm de largo que va desde el pabellón hasta el tímpano.',
    function:
      'Conduce las ondas sonoras hacia el tímpano. Por su forma de tubo resuena y refuerza los sonidos de entre 2 000 y 4 000 Hz, importantes para entender la voz. Produce cerumen, que lo protege de polvo y microbios.',
    failure:
      'Un tapón de cerumen o una inflamación (otitis externa) bloquea el paso del sonido: es una pérdida auditiva de conducción, generalmente reversible.',
    fact: 'El cerumen se desplaza solo hacia afuera; los hisopos suelen empujarlo hacia dentro.',
  },
  {
    id: 'timpano',
    name: 'Tímpano',
    alias: 'Membrana timpánica',
    region: 'medio',
    hotspot: [548, 240],
    location: 'Membrana delgada (≈0,1 mm) y tensa que separa el conducto auditivo externo del oído medio.',
    function:
      'Vibra cuando le llegan las ondas sonoras: convierte las variaciones de presión del aire en vibración mecánica, que transmite al martillo.',
    failure:
      'Si se perfora (por infección, golpe o cambio brusco de presión) vibra peor y se oye menos. Las perforaciones pequeñas suelen cerrarse solas.',
    fact: 'Puede detectar desplazamientos menores que el diámetro de un átomo.',
  },
  {
    id: 'martillo',
    name: 'Martillo',
    alias: 'Malleus',
    region: 'medio',
    hotspot: [568, 196],
    location: 'Primer huesecillo de la cadena. Su mango está unido a la cara interna del tímpano.',
    function: 'Recibe la vibración del tímpano y la transmite al yunque, actuando como una palanca.',
    failure:
      'Si la cadena de huesecillos se rompe o se fija (por ejemplo, tras infecciones repetidas), la vibración no llega bien al oído interno: pérdida de conducción.',
    fact: 'Es el más grande de los tres huesecillos, y aun así mide unos 8 mm.',
  },
  {
    id: 'yunque',
    name: 'Yunque',
    alias: 'Incus',
    region: 'medio',
    hotspot: [593, 197],
    location: 'Huesecillo central, articulado entre el martillo y el estribo.',
    function: 'Transmite la vibración del martillo al estribo, formando parte del sistema de palanca.',
    failure: 'Su desarticulación (por ejemplo, tras un traumatismo) interrumpe la transmisión: pérdida de conducción.',
    fact: 'El martillo y el yunque derivan de estructuras que en reptiles forman parte de la mandíbula.',
  },
  {
    id: 'estribo',
    name: 'Estribo',
    alias: 'Stapes',
    region: 'medio',
    hotspot: [624, 249],
    location: 'Último huesecillo. Su base (platina) encaja en la ventana oval, la entrada al oído interno.',
    function:
      'Empuja la ventana oval como un pistón y pone en movimiento el líquido de la cóclea. Como el tímpano es ~17 veces más grande que la ventana oval, la presión aumenta unas 20 veces.',
    failure:
      'En la otosclerosis el estribo queda fijado por hueso anormal y no puede moverse: la audición disminuye progresivamente. Puede tratarse con cirugía.',
    fact: 'Es el hueso más pequeño del cuerpo humano: unos 3 mm.',
  },
  {
    id: 'trompa',
    name: 'Trompa de Eustaquio',
    alias: 'Tuba auditiva',
    region: 'medio',
    hotspot: [625, 372],
    location: 'Conducto que une el oído medio con la parte alta de la garganta (nasofaringe).',
    function:
      'Iguala la presión del aire a ambos lados del tímpano y drena secreciones. Se abre al tragar o bostezar.',
    failure:
      'Si se bloquea (resfrío, alergia) la presión se desequilibra: sensación de oído tapado, dolor y acumulación de líquido (otitis media).',
    fact: 'Es la razón por la que "se destapan" los oídos al tragar en un avión.',
  },
  {
    id: 'coclea',
    name: 'Cóclea',
    alias: 'Caracol',
    region: 'interno',
    hotspot: [742, 312],
    location: 'Tubo óseo enrollado en espiral de unas 2,5 vueltas, dentro del hueso temporal. Está lleno de líquido.',
    function:
      'Contiene el órgano de Corti con unas 15 000 células ciliadas. Cuando el líquido se mueve, las células ciliadas se inclinan y transforman la vibración en impulsos nerviosos. La base responde a sonidos agudos y el vértice a los graves (tonotopía).',
    failure:
      'El daño de las células ciliadas (ruido, edad, ciertos fármacos) produce pérdida auditiva neurosensorial. En los humanos estas células no se regeneran.',
    fact: 'Desenrollada mediría unos 35 mm.',
  },
  {
    id: 'vestibulo',
    name: 'Vestíbulo',
    region: 'interno',
    hotspot: [672, 246],
    location: 'Cavidad central del oído interno, entre la cóclea y los canales semicirculares, junto a la ventana oval.',
    function:
      'Contiene el utrículo y el sáculo, que detectan la gravedad y las aceleraciones en línea recta (por ejemplo, inclinar la cabeza o subir en un ascensor). Es parte del sistema del equilibrio, no de la audición.',
    failure: 'Su alteración provoca vértigo, mareo e inestabilidad al moverse.',
    fact: 'Contiene diminutos cristales de carbonato de calcio llamados otolitos.',
  },
  {
    id: 'canales',
    name: 'Canales semicirculares',
    region: 'interno',
    hotspot: [684, 126],
    location: 'Tres conductos en forma de arco, orientados en planos perpendiculares, encima y detrás del vestíbulo.',
    function: 'Detectan los giros de la cabeza (aceleraciones de rotación) gracias al movimiento del líquido de su interior.',
    failure:
      'Si se alteran (por ejemplo, otolitos desplazados en el vértigo posicional) aparece sensación de giro al mover la cabeza.',
    fact: 'Sus tres planos cubren los tres ejes de giro: asentir, negar e inclinar la cabeza hacia el hombro.',
  },
  {
    id: 'nervio',
    name: 'Nervio auditivo',
    alias: 'Rama coclear del VIII par craneal',
    region: 'interno',
    hotspot: [820, 308],
    location: 'Sale de la cóclea (unido a la rama vestibular) y entra en el tronco encefálico.',
    function:
      'Transporta los impulsos nerviosos generados en la cóclea hacia el tronco encefálico y, desde allí, hasta la corteza auditiva del lóbulo temporal. No transporta sonido: transporta señales eléctricas.',
    failure:
      'Su lesión (por ejemplo, un tumor benigno llamado neurinoma del acústico) produce pérdida auditiva aunque el oído funcione bien.',
    fact: 'Tiene unas 30 000 fibras nerviosas.',
  },
];

export const STRUCTURE_BY_ID = Object.fromEntries(STRUCTURES.map((s) => [s.id, s])) as Record<StructureId, Structure>;
