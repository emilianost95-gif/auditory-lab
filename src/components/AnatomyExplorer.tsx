import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, MapPin, Sparkles, Workflow, X } from 'lucide-react';
import { FULL_VIEW, REGIONS, STRUCTURES, STRUCTURE_BY_ID, type RegionId, type StructureId } from '@/data/anatomy';
import { progressStore, useProgress } from '@/lib/progress';
import { EarArt } from './EarArt';

type Tab = 'todo' | RegionId;
const TABS: { id: Tab; label: string }[] = [
  { id: 'todo', label: 'Vista completa' },
  { id: 'externo', label: 'Oído externo' },
  { id: 'medio', label: 'Oído medio' },
  { id: 'interno', label: 'Oído interno' },
];

export function AnatomyExplorer() {
  const [tab, setTab] = useState<Tab>('todo');
  const [selected, setSelected] = useState<StructureId | null>(null);
  const progress = useProgress();
  const explored = progress.explored.length;

  const select = (id: StructureId) => {
    setSelected(id);
    progressStore.explore(id);
    const region = STRUCTURE_BY_ID[id].region;
    if (tab !== 'todo' && tab !== region) setTab(region);
  };
  const changeTab = (t: Tab) => {
    setTab(t);
    if (selected && t !== 'todo' && STRUCTURE_BY_ID[selected].region !== t) setSelected(null);
  };

  const regionIds = tab === 'todo' ? [] : STRUCTURES.filter((s) => s.region === tab).map((s) => s.id);
  const view = tab === 'todo' ? FULL_VIEW : REGIONS[tab].view;
  const st = selected ? STRUCTURE_BY_ID[selected] : null;
  const listed = tab === 'todo' ? STRUCTURES : STRUCTURES.filter((s) => s.region === tab);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <div role="tablist" aria-label="Regiones del oído" className="mb-3 flex gap-1 overflow-x-auto rounded-full border border-line bg-deep/70 p-1">
          {TABS.map((t) => {
            const on = tab === t.id;
            const color = t.id === 'todo' ? '#f1f5fb' : REGIONS[t.id].color;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => changeTab(t.id)}
                className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${on ? 'text-void' : 'text-mute hover:text-ink'}`}
              >
                {on && <motion.span layoutId="region-pill" className="absolute inset-0 rounded-full" style={{ background: color }} transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }} />}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative aspect-[1.84] overflow-hidden rounded-3xl border border-line bg-[radial-gradient(ellipse_at_center,#0f1830,#05070d_75%)]">
          <EarArt
            view={view}
            hotspots
            selected={selected}
            onSelect={select}
            highlight={regionIds}
            dim={tab !== 'todo' || !!selected}
            labels={tab === 'todo' ? (selected ? [selected] : []) : regionIds}
          />
          <div className="pointer-events-none absolute left-3 top-3 hidden max-w-[70%] flex-wrap gap-2 sm:flex">
            {(Object.keys(REGIONS) as RegionId[]).map((r) => (
              <span key={r} className="chip bg-void/70 backdrop-blur">
                <span className="size-2 rounded-full" style={{ background: REGIONS[r].color }} />
                {REGIONS[r].name}
              </span>
            ))}
          </div>
          <span className="chip absolute right-3 top-3 bg-void/70 backdrop-blur">
            Exploradas {explored}/{STRUCTURES.length}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Estructuras">
          {listed.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => select(s.id)}
              aria-pressed={selected === s.id}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                selected === s.id ? 'border-transparent text-void' : 'border-line text-mute hover:border-white/30 hover:text-ink'
              }`}
              style={selected === s.id ? { background: REGIONS[s.region].color } : undefined}
            >
              {progress.explored.includes(s.id) && selected !== s.id && <span className="mr-1 text-ok">●</span>}
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <aside className="panel min-h-[22rem] p-6" aria-live="polite">
        <AnimatePresence mode="wait">
          {st ? (
            <motion.div key={st.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="chip" style={{ color: REGIONS[st.region].color, borderColor: `${REGIONS[st.region].color}55` }}>
                    {REGIONS[st.region].name}
                  </span>
                  <h3 className="display mt-3 text-3xl">{st.name}</h3>
                  {st.alias && <p className="mt-1 font-mono text-xs text-dim">{st.alias}</p>}
                </div>
                <button type="button" onClick={() => setSelected(null)} className="rounded-full p-1.5 text-dim hover:bg-white/5 hover:text-ink" aria-label="Cerrar ficha">
                  <X className="size-4" />
                </button>
              </div>
              <dl className="mt-6 space-y-5 text-sm leading-relaxed">
                <Row icon={<MapPin className="size-4 text-cyan" />} title="Ubicación" text={st.location} />
                <Row icon={<Workflow className="size-4 text-electric" />} title="Función" text={st.function} />
                <Row icon={<AlertTriangle className="size-4 text-warn" />} title="Si deja de funcionar" text={st.failure} />
                <Row icon={<Sparkles className="size-4 text-violet" />} title="Dato" text={st.fact} />
              </dl>
            </motion.div>
          ) : (
            <motion.div key={`r-${tab}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="eyebrow">{tab === 'todo' ? 'Tres regiones, una cadena' : REGIONS[tab].short}</p>
              <h3 className="display mt-3 text-3xl">{tab === 'todo' ? 'El oído humano' : REGIONS[tab].name}</h3>
              {tab === 'todo' ? (
                <div className="mt-5 space-y-4">
                  {(Object.keys(REGIONS) as RegionId[]).map((r) => (
                    <button key={r} type="button" onClick={() => changeTab(r)} className="group block w-full rounded-xl border border-line p-4 text-left transition-colors hover:border-white/25">
                      <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: REGIONS[r].color }}>
                        <span className="size-2 rounded-full" style={{ background: REGIONS[r].color }} />
                        {REGIONS[r].name}
                        <span className="ml-auto font-mono text-[11px] font-normal text-dim group-hover:text-mute">{REGIONS[r].short} →</span>
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-mute">{REGIONS[r].summary}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-mute">{REGIONS[tab].summary}</p>
                  <p className="mt-6 text-sm text-dim">Selecciona un punto del modelo para ver su ficha.</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

function Row({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0" aria-hidden>
        {icon}
      </span>
      <div>
        <dt className="font-mono text-[11px] uppercase tracking-widest text-dim">{title}</dt>
        <dd className="mt-1 text-mute">{text}</dd>
      </div>
    </div>
  );
}
