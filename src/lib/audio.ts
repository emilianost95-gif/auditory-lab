import { useCallback, useEffect, useRef, useState } from 'react';

/** Ganancia máxima absoluta: protege los oídos aunque el control esté al 100 %. */
export const MAX_GAIN = 0.22;

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export const audioSupported = () =>
  typeof window !== 'undefined' && !!(window.AudioContext ?? (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext);

export interface ToneParams {
  frequency: number;
  /** Volumen relativo 0–1 (se escala a MAX_GAIN). */
  volume: number;
  /** Amplitudes de armónicos; [1] = sinusoide pura. */
  harmonics?: number[];
}

/** Solo un tono suena a la vez en toda la app. */
let stopActive: (() => void) | null = null;

/**
 * Generador de tono controlado por el usuario (Web Audio API).
 * Nunca suena automáticamente: requiere llamar a `start()` desde un gesto.
 */
export function useTone(params: ToneParams) {
  const [playing, setPlaying] = useState(false);
  const nodes = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const stop = useCallback(() => {
    const n = nodes.current;
    const c = ctx;
    if (n && c) {
      const t = c.currentTime;
      n.gain.gain.cancelScheduledValues(t);
      n.gain.gain.setTargetAtTime(0, t, 0.03);
      n.osc.stop(t + 0.2);
    }
    nodes.current = null;
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    const c = getCtx();
    if (!c) return;
    stopActive?.();
    const p = paramsRef.current;
    const osc = c.createOscillator();
    applyShape(c, osc, p.harmonics);
    osc.frequency.value = p.frequency;
    const gain = c.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(p.volume * MAX_GAIN, c.currentTime, 0.04);
    osc.connect(gain).connect(c.destination);
    osc.start();
    nodes.current = { osc, gain };
    stopActive = stop;
    setPlaying(true);
  }, [stop]);

  const toggle = useCallback(() => (nodes.current ? stop() : start()), [start, stop]);

  // Actualización en vivo de los parámetros.
  const harmonicsKey = params.harmonics?.join(',') ?? '1';
  useEffect(() => {
    const n = nodes.current;
    const c = ctx;
    if (!n || !c) return;
    n.osc.frequency.setTargetAtTime(params.frequency, c.currentTime, 0.02);
    n.gain.gain.setTargetAtTime(params.volume * MAX_GAIN, c.currentTime, 0.03);
  }, [params.frequency, params.volume]);
  useEffect(() => {
    const n = nodes.current;
    if (n && ctx) applyShape(ctx, n.osc, paramsRef.current.harmonics);
  }, [harmonicsKey]);

  useEffect(
    () => () => {
      if (stopActive === stop) stopActive = null;
      stop();
    },
    [stop],
  );

  return { playing, start, stop, toggle, supported: audioSupported() };
}

function applyShape(c: AudioContext, osc: OscillatorNode, harmonics?: number[]) {
  if (!harmonics || (harmonics.length === 1 && harmonics[0] === 1)) {
    osc.type = 'sine';
    return;
  }
  const real = new Float32Array(harmonics.length + 1);
  const imag = new Float32Array(harmonics.length + 1);
  harmonics.forEach((a, i) => (imag[i + 1] = a));
  osc.setPeriodicWave(c.createPeriodicWave(real, imag));
}
