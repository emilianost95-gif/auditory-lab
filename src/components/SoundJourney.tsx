import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { JOURNEY, type Medium } from '@/data/journey';
import { progressStore } from '@/lib/progress';
import { EarArt } from './EarArt';

const MEDIA: { id: Medium; label: string; color: string }[] = [
  { id: 'aire', label: 'Onda en el aire', color: '#22d3ee' },
  { id: 'sólido', label: 'Vibración mecánica', color: '#e8dcc0' },
  { id: 'líquido', label: 'Onda en líquido', color: '#8b5cf6' },
  { id: 'electroquímico', label: 'Señal nerviosa', color: '#fbbf24' },
  { id: 'percepción', label: 'Percepción', color: '#f472b6' },
];

export function SoundJourney({ compact = false, onComplete }: { compact?: boolean; onComplete?: () => void }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const step = JOURNEY[i]!;
  const last = JOURNEY.length - 1;

  const go = (n: number) => {
    const k = Math.max(0, Math.min(last, n));
    setI(k);
    progressStore.journey(k + 1);
    if (k === last) onComplete?.();
  };

  useEffect(() => {
    if (!auto) return;
    if (i >= last) {
      setAuto(false);
      return;
    }
    const t = setTimeout(() => go(i + 1), 5200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, i]);

  const toggleAuto = () => {
    if (auto) return setAuto(false);
    if (i === last) go(0);
    setAuto(true);
  };

  const mediumIndex = MEDIA.findIndex((m) => m.id === step.medium);

  return (
    <div
      className="panel overflow-hidden"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1);
        if (e.key === 'ArrowLeft') go(i - 1);
      }}
    >
      <div className="relative aspect-[1.84] border-b border-line bg-[radial-gradient(ellipse_at_center,#0f1830,#05070d_75%)]">
        <EarArt view={step.view} showSource highlight={step.highlight} dim={step.highlight.length > 0} fx={step.fx} labels={step.highlight} />
        <AnimatePresence>
          {step.fx.includes('hair') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="glass absolute right-3 top-3 w-[42%] max-w-[260px] rounded-2xl p-2"
            >
              <HairCells firing={step.fx.includes('nerve') || step.n === 8} />
              <p className="px-1 pb-1 font-mono text-[10px] leading-tight text-mute">Órgano de Corti (ampliado): estereocilios que se inclinan</p>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="chip absolute left-3 top-3 bg-void/70 backdrop-blur">
          Etapa {step.n}/{JOURNEY.length}
        </span>
      </div>

      {/* Forma de la energía */}
      <div className="flex overflow-x-auto border-b border-line" aria-label="Forma que adopta la señal">
        {MEDIA.map((m, k) => (
          <div key={m.id} className="relative min-w-[7.5rem] flex-1 px-3 py-2.5 text-center">
            <span className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${k === mediumIndex ? '' : 'text-dim'}`} style={k === mediumIndex ? { color: m.color } : undefined}>
              {m.label}
            </span>
            {k === mediumIndex && <motion.span layoutId={`medium-bar-${compact}`} className="absolute inset-x-3 bottom-0 h-0.5 rounded-full" style={{ background: m.color }} />}
          </div>
        ))}
      </div>

      <div className={`grid gap-6 p-5 sm:p-7 ${compact ? '' : 'md:grid-cols-[minmax(0,1fr)_auto]'}`}>
        <AnimatePresence mode="wait">
          <motion.div key={step.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} aria-live="polite">
            <p className="font-mono text-xs text-cyan">
              {String(step.n).padStart(2, '0')} · {step.kind}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-mute">{step.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-end gap-2 md:flex-col md:items-end md:justify-between">
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Etapa anterior">
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" className="btn btn-ghost" onClick={toggleAuto} aria-label={auto ? 'Pausar recorrido' : 'Reproducir recorrido'}>
              {auto ? <Pause className="size-4" /> : <Play className="size-4" />}
              <span className="hidden sm:inline">{auto ? 'Pausar' : 'Auto'}</span>
            </button>
            <button type="button" className="btn btn-primary" onClick={() => go(i + 1)} disabled={i === last} aria-label="Etapa siguiente">
              Siguiente <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <ol className="flex gap-1 px-5 pb-5 sm:px-7" aria-label="Etapas">
        {JOURNEY.map((s, k) => (
          <li key={s.n} className="flex-1">
            <button type="button" onClick={() => go(k)} className="group block w-full py-2" aria-label={`Etapa ${s.n}: ${s.title}`} aria-current={k === i ? 'step' : undefined}>
              <span className={`block h-1 rounded-full transition-colors ${k < i ? 'bg-cyan/70' : k === i ? 'bg-cyan' : 'bg-white/10 group-hover:bg-white/25'}`} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Esquema ampliado de células ciliadas internas sobre la membrana basilar. */
export function HairCells({ firing = true }: { firing?: boolean }) {
  return (
    <svg viewBox="0 0 240 130" className="w-full" role="img" aria-label="Células ciliadas con estereocilios que se inclinan y generan impulsos">
      <rect x="0" y="96" width="240" height="10" rx="3" fill="#8b5cf6" opacity="0.7" />
      <text x="6" y="122" fontSize="9" fill="#93a1bb" fontFamily="var(--font-mono)">
        membrana basilar
      </text>
      <rect x="0" y="16" width="240" height="7" rx="3" fill="#475569" opacity="0.8" />
      <text x="6" y="11" fontSize="9" fill="#93a1bb" fontFamily="var(--font-mono)">
        membrana tectoria
      </text>
      {[40, 100, 160].map((x, k) => (
        <g key={x}>
          <rect x={x - 12} y="52" width="24" height="44" rx="10" fill="#fbcfe8" opacity="0.9" />
          <circle cx={x} cy="80" r="5" fill="#9d174d" opacity="0.7" />
          <g className="anim-hair" style={{ transformBox: 'fill-box', animationDelay: `${k * 0.08}s` }}>
            {[-6, -2, 2, 6].map((dx, j) => (
              <line key={dx} x1={x + dx} y1="52" x2={x + dx} y2={40 - j * 3} stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
            ))}
          </g>
          {firing && (
            <path d={`M${x},96 L${x},128`} stroke="#fbbf24" strokeWidth="2.5" className="anim-flow-fast" style={{ animationDelay: `${k * 0.15}s` }} />
          )}
        </g>
      ))}
      <path d="M204,60 q8,-8 16,0 q8,8 16,0" stroke="#22d3ee" fill="none" strokeWidth="1.5" className="anim-flow" />
    </svg>
  );
}
