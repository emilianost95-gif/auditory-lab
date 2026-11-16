import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Info, Lightbulb, Pause, Play, Volume2 } from 'lucide-react';
import { useTone } from '@/lib/audio';

export function SectionTitle({ eyebrow, title, lead, id }: { eyebrow: string; title: ReactNode; lead?: ReactNode; id?: string }) {
  return (
    <header id={id} className="mb-8 max-w-3xl scroll-mt-24">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-3 text-3xl sm:text-4xl">{title}</h2>
      {lead && <p className="mt-4 text-base leading-relaxed text-mute sm:text-lg">{lead}</p>}
    </header>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  hint,
  log = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display: string;
  hint?: string;
  /** Escala logarítmica (útil para frecuencia). */
  log?: boolean;
}) {
  const toPos = (v: number) => (log ? (Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min)) : (v - min) / (max - min));
  const fromPos = (p: number) => (log ? Math.exp(Math.log(min) + p * (Math.log(max) - Math.log(min))) : min + p * (max - min));
  const pos = Math.min(1, Math.max(0, toPos(value)));
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-mute">{label}</span>
        <span className="font-mono text-sm tabular-nums text-ink">{display}</span>
      </span>
      <input
        type="range"
        className="range mt-1"
        min={0}
        max={1000}
        step={log ? 1 : Math.max(1, Math.round((step / (max - min)) * 1000))}
        value={Math.round(pos * 1000)}
        style={{ ['--fill' as string]: `${pos * 100}%` }}
        onChange={(e) => {
          const raw = fromPos(Number(e.target.value) / 1000);
          const snapped = log ? raw : Math.round(raw / step) * step;
          onChange(Number(snapped.toFixed(6)));
        }}
        aria-valuetext={display}
      />
      {hint && <span className="mt-0.5 block text-xs text-dim">{hint}</span>}
    </label>
  );
}

export function Callout({ kind = 'info', title, children }: { kind?: 'info' | 'tip' | 'warn'; title?: string; children: ReactNode }) {
  const map = {
    info: { Icon: Info, cls: 'border-electric/30 bg-electric/[0.06]', ic: 'text-electric' },
    tip: { Icon: Lightbulb, cls: 'border-cyan/30 bg-cyan/[0.05]', ic: 'text-cyan' },
    warn: { Icon: AlertTriangle, cls: 'border-warn/30 bg-warn/[0.06]', ic: 'text-warn' },
  }[kind];
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 ${map.cls}`}>
      <map.Icon className={`mt-0.5 size-5 shrink-0 ${map.ic}`} aria-hidden />
      <div className="text-sm leading-relaxed text-mute">
        {title && <p className="mb-1 font-semibold text-ink">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 56, stroke = 5, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(147 161 187 / 0.18)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value) }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-mono text-xs tabular-nums">{label ?? `${Math.round(value * 100)}%`}</span>
    </div>
  );
}

export function Bar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-white/10 ${className}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-cyan to-violet"
        initial={{ width: 0 }}
        animate={{ width: `${Math.round(value * 100)}%` }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/** Botón de reproducción de un tono (nunca suena solo). */
export function ToneButton({
  frequency,
  volume,
  harmonics,
  label = 'Escuchar',
  className = '',
}: {
  frequency: number;
  volume: number;
  harmonics?: number[];
  label?: string;
  className?: string;
}) {
  const tone = useTone({ frequency, volume, harmonics });
  if (!tone.supported) return <span className="text-xs text-dim">Audio no disponible en este navegador</span>;
  return (
    <button
      type="button"
      onClick={tone.toggle}
      aria-pressed={tone.playing}
      className={`btn ${tone.playing ? 'btn-primary' : 'btn-ghost'} ${className}`}
    >
      {tone.playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
      {tone.playing ? 'Detener' : label}
      {tone.playing && <Volume2 className="size-4 animate-pulse" aria-hidden />}
    </button>
  );
}

export function KeyConcepts({ items }: { items: { term: string; def: string }[] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
      {items.map((c) => (
        <div key={c.term} className="bg-deep p-5">
          <dt className="font-mono text-xs uppercase tracking-widest text-cyan">{c.term}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-mute">{c.def}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Fade({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
