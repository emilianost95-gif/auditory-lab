import type { WaveShape } from '@/data/types';

export const MEDIA = {
  aire: { name: 'Aire (20 °C)', v: 343 },
  agua: { name: 'Agua', v: 1480 },
  acero: { name: 'Acero', v: 5960 },
} as const;
export type MediumId = keyof typeof MEDIA;

/** λ = v / f (metros). */
export const wavelength = (v: number, f: number) => v / f;
/** f = v / λ (Hz). */
export const frequencyFrom = (v: number, lambda: number) => v / lambda;

/** Diferencia de nivel en dB entre dos amplitudes de presión: 20·log10(A/A₀). */
export const ampToDb = (a: number, ref = 1) => (a <= 0 ? -Infinity : 20 * Math.log10(a / ref));

/** Tiempo seguro de exposición diaria (minutos), criterio NIOSH: 85 dB(A) → 8 h, intercambio de 3 dB. */
export const safeExposureMinutes = (db: number) => 480 / 2 ** ((db - 85) / 3);

export function formatDuration(min: number): string {
  if (!Number.isFinite(min) || min >= 24 * 60) return 'Sin límite práctico';
  if (min >= 60) {
    const h = min / 60;
    return `${h >= 10 ? Math.round(h) : Math.round(h * 10) / 10} h`.replace('.', ',');
  }
  if (min >= 1) return `${Math.round(min)} min`;
  const s = Math.round(min * 60);
  return s < 1 ? 'Ninguno: daño inmediato posible' : `${s} s`;
}

/** Amplitudes de armónicos (1 = fundamental) para cada forma. */
export const SHAPE_HARMONICS: Record<WaveShape, number[]> = {
  sine: [1],
  square: [1, 0, 1 / 3, 0, 1 / 5, 0, 1 / 7, 0, 1 / 9],
  saw: Array.from({ length: 12 }, (_, i) => 1 / (i + 1)),
  rich: [1, 0.55, 0.4, 0.22, 0.15, 0.08],
};

export interface TimbrePreset {
  id: string;
  name: string;
  note: string;
  harmonics: number[];
  color: string;
}

/** Modelos simplificados (no son grabaciones reales de instrumentos). */
export const TIMBRES: TimbrePreset[] = [
  { id: 'diapason', name: 'Diapasón', note: 'Casi una sinusoide pura: solo la fundamental.', harmonics: [1], color: '#22d3ee' },
  { id: 'flauta', name: 'Flauta (modelo)', note: 'Fundamental fuerte y pocos armónicos débiles: timbre suave.', harmonics: [1, 0.3, 0.12, 0.05], color: '#3b82f6' },
  { id: 'clarinete', name: 'Clarinete (modelo)', note: 'Predominan los armónicos impares: timbre "hueco".', harmonics: [1, 0, 0.55, 0, 0.32, 0, 0.18, 0, 0.1], color: '#8b5cf6' },
  { id: 'violin', name: 'Violín (modelo)', note: 'Muchos armónicos decrecientes: timbre brillante.', harmonics: Array.from({ length: 14 }, (_, i) => 0.95 / (i + 1)), color: '#f472b6' },
];

/** Valor de una onda compuesta en la fase θ (radianes). */
export function sampleHarmonics(h: number[], theta: number): number {
  let y = 0;
  for (let n = 0; n < h.length; n++) {
    const a = h[n] ?? 0;
    if (a) y += a * Math.sin((n + 1) * theta);
  }
  return y;
}

const peakCache = new Map<string, number>();
/** Pico absoluto de la onda compuesta (para normalizar a ±1). */
export function harmonicsPeak(h: number[]): number {
  const key = h.join(',');
  const hit = peakCache.get(key);
  if (hit) return hit;
  let peak = 0;
  for (let i = 0; i < 720; i++) peak = Math.max(peak, Math.abs(sampleHarmonics(h, (i / 720) * Math.PI * 2)));
  peak ||= 1;
  peakCache.set(key, peak);
  return peak;
}

/** Niveles sonoros de referencia (aproximados, dB(A)). */
export const SOUND_LEVELS = [
  { db: 0, label: 'Umbral de audición' },
  { db: 20, label: 'Susurro, hojas' },
  { db: 40, label: 'Biblioteca' },
  { db: 60, label: 'Conversación normal' },
  { db: 70, label: 'Aspiradora' },
  { db: 85, label: 'Tránsito intenso' },
  { db: 94, label: 'Moto, licuadora cerca' },
  { db: 100, label: 'Auriculares al máximo' },
  { db: 105, label: 'Discoteca' },
  { db: 110, label: 'Concierto de rock' },
  { db: 120, label: 'Sirena cercana · umbral de dolor' },
  { db: 140, label: 'Disparo, avión a reacción cerca' },
];
