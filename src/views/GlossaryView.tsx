import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { GLOSSARY } from '@/data/glossary';
import { href } from '@/lib/router';

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function GlossaryView() {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const n = norm(q.trim());
    return [...GLOSSARY]
      .sort((a, b) => a.term.localeCompare(b.term, 'es'))
      .filter((e) => !n || norm(e.term).includes(n) || norm(e.def).includes(n));
  }, [q]);
  const groups = useMemo(() => {
    const m = new Map<string, typeof list>();
    for (const e of list) {
      const L = norm(e.term)[0]!.toUpperCase();
      m.set(L, [...(m.get(L) ?? []), e]);
    }
    return [...m.entries()];
  }, [list]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
      <p className="eyebrow">Modo estudio</p>
      <h1 className="display mt-3 text-5xl">Glosario científico</h1>
      <p className="mt-4 max-w-2xl text-mute">{GLOSSARY.length} términos de anatomía, física del sonido y salud auditiva, con enlace al módulo donde se explican.</p>
      <label className="relative mt-8 block max-w-md">
        <span className="sr-only">Buscar término</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-dim" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar: cóclea, frecuencia, tinnitus…"
          className="w-full rounded-full border border-line bg-deep py-3 pl-11 pr-4 text-sm text-ink placeholder:text-dim focus:border-cyan/60 focus:outline-none"
        />
      </label>
      <div className="mt-10 space-y-10">
        {groups.length === 0 && <p className="text-mute">No hay términos que coincidan con «{q}».</p>}
        {groups.map(([L, items]) => (
          <section key={L} aria-labelledby={`g-${L}`} className="grid gap-4 sm:grid-cols-[4rem_minmax(0,1fr)]">
            <h2 id={`g-${L}`} className="font-mono text-3xl text-cyan/70">
              {L}
            </h2>
            <dl className="divide-y divide-line border-y border-line">
              {items.map((e) => (
                <div key={e.term} className="grid gap-1 py-4 sm:grid-cols-[13rem_minmax(0,1fr)_auto] sm:gap-4">
                  <dt className="font-medium">{e.term}</dt>
                  <dd className="text-sm leading-relaxed text-mute">{e.def}</dd>
                  <dd>
                    <a href={href.module(e.module)} className="chip hover:border-cyan/50 hover:text-ink">
                      Módulo {String(e.module).padStart(2, '0')}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
