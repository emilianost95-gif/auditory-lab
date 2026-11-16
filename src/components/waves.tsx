import { useEffect, useRef } from 'react';
import type { WaveFigureSpec } from '@/data/types';
import { SHAPE_HARMONICS, harmonicsPeak, sampleHarmonics } from '@/lib/physics';
import { prefersReducedMotion, useElementWidth, useInView } from '@/lib/hooks';

const TAU = Math.PI * 2;

interface Trace {
  cycles: number;
  amp: number;
  harmonics?: number[];
  color: string;
  width?: number;
  dash?: number[];
}

interface ScopeProps extends Trace {
  height?: number;
  /** Ciclos de fase por segundo en la animación (0 = estática). */
  speed?: number;
  ghost?: Trace | null;
  showLambda?: boolean;
  lambdaLabel?: string;
  showAmp?: boolean;
  ampLabel?: string;
  xLabel?: string;
  yLabel?: string;
  ariaLabel: string;
  className?: string;
}

/** Osciloscopio en canvas: dibuja presión vs tiempo o vs distancia. */
export function WaveScope({
  height = 220,
  speed = 0.6,
  ghost = null,
  showLambda = false,
  lambdaLabel = 'λ',
  showAmp = false,
  ampLabel = 'A',
  xLabel,
  yLabel,
  ariaLabel,
  className = '',
  ...trace
}: ScopeProps) {
  const [wrap, width] = useElementWidth<HTMLDivElement>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const visible = useInView(wrap);
  const props = useRef({ trace, ghost, showLambda, lambdaLabel, showAmp, ampLabel, xLabel, yLabel, speed });
  props.current = { trace, ghost, showLambda, lambdaLabel, showAmp, ampLabel, xLabel, yLabel, speed };
  const phase = useRef(0);
  // En modo estático se redibuja cuando cambian los datos; en animación se leen en cada cuadro.
  const staticKey = speed > 0 && !prefersReducedMotion() ? '' : JSON.stringify([trace, ghost, showLambda, showAmp, lambdaLabel, ampLabel]);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = width * dpr;
    cv.height = height * dpr;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const reduce = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();

    const draw = () => {
      const p = props.current;
      const W = width;
      const H = height;
      const pad = { l: p.yLabel ? 26 : 8, r: 8, t: 14, b: p.xLabel ? 24 : 10 };
      const iw = W - pad.l - pad.r;
      const ih = H - pad.t - pad.b;
      const mid = pad.t + ih / 2;
      const half = ih / 2 - 6;
      ctx.clearRect(0, 0, W, H);

      // rejilla
      ctx.strokeStyle = 'rgba(147,161,187,0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const x = pad.l + (iw * i) / 10;
        ctx.beginPath();
        ctx.moveTo(x, pad.t);
        ctx.lineTo(x, pad.t + ih);
        ctx.stroke();
      }
      for (let j = 0; j <= 4; j++) {
        const y = pad.t + (ih * j) / 4;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(pad.l + iw, y);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(147,161,187,0.35)';
      ctx.beginPath();
      ctx.moveTo(pad.l, mid);
      ctx.lineTo(pad.l + iw, mid);
      ctx.stroke();

      const plot = (t: Trace) => {
        const h = t.harmonics ?? [1];
        const peak = harmonicsPeak(h);
        ctx.strokeStyle = t.color;
        ctx.lineWidth = t.width ?? 2.25;
        ctx.setLineDash(t.dash ?? []);
        ctx.lineJoin = 'round';
        ctx.beginPath();
        const n = Math.max(200, Math.min(2400, Math.round(iw * 2)));
        for (let i = 0; i <= n; i++) {
          const fx = i / n;
          const th = TAU * t.cycles * fx - phase.current;
          const y = mid - (sampleHarmonics(h, th) / peak) * t.amp * half;
          const x = pad.l + fx * iw;
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };
      if (p.ghost) plot(p.ghost);
      ctx.shadowColor = p.trace.color;
      ctx.shadowBlur = 10;
      plot(p.trace);
      ctx.shadowBlur = 0;

      ctx.font = '11px "Geist Mono Variable", monospace';
      // λ: distancia entre dos crestas consecutivas
      if (p.showLambda && p.trace.cycles > 0) {
        const period = iw / p.trace.cycles;
        let x0 = (((Math.PI / 2 + phase.current) % TAU) + TAU) % TAU;
        x0 = pad.l + (x0 / TAU) * period;
        while (x0 - period >= pad.l) x0 -= period;
        const yTop = mid - p.trace.amp * half - 10;
        ctx.strokeStyle = '#f1f5fb';
        ctx.fillStyle = '#f1f5fb';
        ctx.lineWidth = 1.2;
        if (x0 + period <= pad.l + iw) {
          ctx.beginPath();
          ctx.moveTo(x0, yTop - 4);
          ctx.lineTo(x0, yTop + 4);
          ctx.moveTo(x0, yTop);
          ctx.lineTo(x0 + period, yTop);
          ctx.moveTo(x0 + period, yTop - 4);
          ctx.lineTo(x0 + period, yTop + 4);
          ctx.stroke();
          ctx.textAlign = 'center';
          ctx.fillText(p.lambdaLabel, x0 + period / 2, Math.max(11, yTop - 6));
        } else {
          ctx.textAlign = 'left';
          ctx.fillText(`${p.lambdaLabel} (mayor que la ventana)`, pad.l + 6, 12);
        }
      }
      if (p.showAmp && p.trace.amp > 0.02) {
        const x = pad.l + iw - 18;
        const yA = mid - p.trace.amp * half;
        ctx.strokeStyle = '#fbbf24';
        ctx.fillStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(pad.l, yA);
        ctx.lineTo(pad.l + iw, yA);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x, mid);
        ctx.lineTo(x, yA);
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.fillText(p.ampLabel, x - 5, (mid + yA) / 2 + 4);
      }
      ctx.fillStyle = 'rgba(147,161,187,0.85)';
      if (p.xLabel) {
        ctx.textAlign = 'right';
        ctx.fillText(p.xLabel, pad.l + iw, H - 6);
      }
      if (p.yLabel) {
        ctx.save();
        ctx.translate(12, pad.t + ih / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText(p.yLabel, 0, 0);
        ctx.restore();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      phase.current = (phase.current + dt * props.current.speed * TAU) % (TAU * 1000);
      draw();
      raf = requestAnimationFrame(loop);
    };
    if (!reduce && visible && speed > 0) raf = requestAnimationFrame(loop);
    else draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height, visible, speed, staticKey]);

  return (
    <div ref={wrap} className={`relative w-full ${className}`}>
      <canvas ref={canvas} style={{ width: '100%', height }} role="img" aria-label={ariaLabel} />
    </div>
  );
}

/** Fila de partículas de aire: muestra compresiones y rarefacciones de una onda longitudinal. */
export function ParticleWave({
  cycles = 3,
  amp = 0.7,
  speed = 0.5,
  height = 160,
  rows = 7,
  color = '34,211,238',
  tracer = false,
  ariaLabel,
  className = '',
}: {
  tracer?: boolean;
  cycles?: number;
  amp?: number;
  speed?: number;
  height?: number;
  rows?: number;
  color?: string;
  ariaLabel: string;
  className?: string;
}) {
  const [wrap, width] = useElementWidth<HTMLDivElement>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const visible = useInView(wrap);
  const p = useRef({ cycles, amp, speed });
  p.current = { cycles, amp, speed };

  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = width * dpr;
    cv.height = height * dpr;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = Math.max(30, Math.round(width / 9));
    let phase = 0;
    let last = performance.now();
    let raf = 0;
    const draw = () => {
      const { cycles: c, amp: a } = p.current;
      ctx.clearRect(0, 0, width, height);
      const dx = width / cols;
      const maxDisp = dx * 1.6 * a;
      for (let i = 0; i < cols; i++) {
        const x0 = (i + 0.5) * dx;
        const th = (TAU * c * x0) / width - phase;
        const disp = maxDisp * Math.sin(th);
        // densidad relativa ∝ −ds/dx → compresión cuando es positiva
        const dens = -Math.cos(th) * a;
        const alpha = 0.35 + 0.6 * Math.max(0, dens);
        const r = 1.6 + 0.9 * Math.max(0, dens);
        ctx.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
        for (let j = 0; j < rows; j++) {
          const y = ((j + 0.5) * height) / rows + (i % 2 ? 2 : -2);
          ctx.beginPath();
          ctx.arc(x0 + disp, y, r, 0, TAU);
          ctx.fill();
        }
        if (tracer && i === Math.round(cols * 0.4)) {
          const y = ((Math.floor(rows / 2) + 0.5) * height) / rows;
          ctx.strokeStyle = 'rgba(251,191,36,0.35)';
          ctx.beginPath();
          ctx.moveTo(x0, y - 14);
          ctx.lineTo(x0, y + 14);
          ctx.stroke();
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(x0 + disp, y, 4.2, 0, TAU);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      phase = (phase + dt * p.current.speed * TAU) % (TAU * 1000);
      draw();
      raf = requestAnimationFrame(loop);
    };
    if (!prefersReducedMotion() && visible) raf = requestAnimationFrame(loop);
    else draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height, rows, color, visible, tracer, prefersReducedMotion() ? `${cycles},${amp}` : '']);

  return (
    <div ref={wrap} className={`relative w-full ${className}`}>
      <canvas ref={canvas} style={{ width: '100%', height }} role="img" aria-label={ariaLabel} />
    </div>
  );
}

/** Gráfico estático de onda (para preguntas de interpretación). */
export function WaveFigure({ spec, color = '#22d3ee' }: { spec: WaveFigureSpec; color?: string }) {
  const W = 260;
  const H = 110;
  const h = SHAPE_HARMONICS[spec.shape ?? 'sine'];
  const peak = harmonicsPeak(h);
  let d = '';
  const n = 300;
  for (let i = 0; i <= n; i++) {
    const fx = i / n;
    const y = H / 2 - (sampleHarmonics(h, TAU * spec.cycles * fx) / peak) * spec.amp * (H / 2 - 8);
    d += `${i ? 'L' : 'M'}${(fx * W).toFixed(1)},${y.toFixed(1)}`;
  }
  return (
    <figure className="rounded-xl border border-line bg-deep p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Onda ${spec.label}`}>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} stroke="rgba(147,161,187,0.12)" />
        ))}
        <line x1={0} x2={W} y1={H / 2} y2={H / 2} stroke="rgba(147,161,187,0.4)" />
        <path d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
      </svg>
      <figcaption className="mt-1 font-mono text-xs text-mute">Onda {spec.label} · mismo intervalo de tiempo</figcaption>
    </figure>
  );
}
