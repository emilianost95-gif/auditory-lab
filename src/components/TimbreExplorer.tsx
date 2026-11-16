import { useState } from 'react';
import { motion } from 'motion/react';
import { TIMBRES } from '@/lib/physics';
import { ToneButton } from './ui';
import { WaveScope } from './waves';

/** Compara formas de onda y espectros de distintos timbres con la misma fundamental. */
export function TimbreExplorer({ compare = false }: { compare?: boolean }) {
  const [a, setA] = useState(TIMBRES[0]!.id);
  const [b, setB] = useState(TIMBRES[3]!.id);
  const ta = TIMBRES.find((t) => t.id === a)!;
  const tb = TIMBRES.find((t) => t.id === b)!;
  const fundamental = 220;

  return (
    <div className="panel overflow-hidden">
      <div className={`grid ${compare ? 'md:grid-cols-2' : ''} divide-y divide-line md:divide-x md:divide-y-0`}>
        <TimbrePanel title={compare ? 'Fuente A' : 'Elige una fuente'} value={a} onChange={setA} fundamental={fundamental} />
        {compare && <TimbrePanel title="Fuente B" value={b} onChange={setB} fundamental={fundamental} />}
      </div>
      {compare && (
        <div className="border-t border-line p-4 sm:p-6">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-dim">Superposición · misma fundamental ({fundamental} Hz) y amplitud</p>
          <WaveScope
            cycles={3}
            amp={0.85}
            harmonics={ta.harmonics}
            color={ta.color}
            ghost={{ cycles: 3, amp: 0.85, harmonics: tb.harmonics, color: tb.color, width: 2, dash: [6, 4] }}
            speed={0}
            height={160}
            ariaLabel={`Superposición de las ondas de ${ta.name} y ${tb.name}`}
          />
          <p className="mt-2 text-sm text-mute">
            Las dos ondas se repiten cada mismo intervalo (mismo período → mismo tono) y alcanzan la misma altura (misma amplitud), pero su <strong className="text-ink">forma</strong> es
            distinta: eso es el timbre.
          </p>
        </div>
      )}
    </div>
  );
}

function TimbrePanel({ title, value, onChange, fundamental }: { title: string; value: string; onChange: (id: string) => void; fundamental: number }) {
  const t = TIMBRES.find((x) => x.id === value)!;
  const max = Math.max(...t.harmonics);
  return (
    <div className="min-w-0 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-dim">{title}</p>
        <ToneButton frequency={fundamental} volume={0.55} harmonics={t.harmonics} label="Escuchar" />
      </div>
      <div role="radiogroup" aria-label={title} className="mt-3 flex flex-wrap gap-1.5">
        {TIMBRES.map((x) => (
          <button
            key={x.id}
            role="radio"
            aria-checked={x.id === value}
            onClick={() => onChange(x.id)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${x.id === value ? 'border-transparent text-void' : 'border-line text-mute hover:text-ink'}`}
            style={x.id === value ? { background: x.color } : undefined}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <WaveScope cycles={3} amp={0.85} harmonics={t.harmonics} color={t.color} speed={0.25} height={130} ariaLabel={`Forma de onda de ${t.name}`} />
      </div>
      <p className="mt-2 text-sm text-mute">{t.note}</p>
      <div className="mt-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-dim">Espectro: intensidad de cada armónico</p>
        <div className="flex h-20 items-end gap-1" role="img" aria-label={`Espectro de armónicos de ${t.name}`}>
          {Array.from({ length: 14 }, (_, k) => {
            const v = (t.harmonics[k] ?? 0) / max;
            return (
              <div key={k} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t"
                  style={{ background: t.color, opacity: 0.35 + 0.65 * v }}
                  animate={{ height: `${Math.max(2, v * 64)}px` }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
                <span className="font-mono text-[9px] text-dim">{k + 1}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-dim">
          1 = fundamental ({fundamental} Hz) · 2 = {fundamental * 2} Hz · 3 = {fundamental * 3} Hz…
        </p>
      </div>
    </div>
  );
}
