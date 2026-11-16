import { useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ListChecks } from 'lucide-react';
import { ModuleQuiz } from '@/components/ModuleQuiz';
import { KeyConcepts } from '@/components/ui';
import { MODULE_BY_ID, type ModuleId } from '@/data/modules';
import { MODULE_QUIZZES } from '@/data/quizzes';
import { href } from '@/lib/router';
import { isModuleDone, progressStore, useProgress } from '@/lib/progress';
import { Module1 } from './modules/Module1';
import { Module2 } from './modules/Module2';
import { Module3 } from './modules/Module3';
import { Module4 } from './modules/Module4';
import { Module5 } from './modules/Module5';
import { Module6 } from './modules/Module6';
import { Module7 } from './modules/Module7';

const CONTENT: Record<ModuleId, () => ReactNode> = {
  1: Module1,
  2: Module2,
  3: Module3,
  4: Module4,
  5: Module5,
  6: Module6,
  7: Module7,
};

export function ModulePage({ id }: { id: number }) {
  const mid = id as ModuleId;
  const meta = MODULE_BY_ID[mid];
  const p = useProgress();
  const Content = CONTENT[mid];
  const done = isModuleDone(p, mid);

  useEffect(() => progressStore.visit(mid), [mid]);

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line">
        <div className="tech-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6">
          <a href="#/?modulos" className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden /> Módulos
          </a>
          <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
            <motion.span
              className="font-mono text-[clamp(4rem,12vw,8rem)] font-semibold leading-[0.8] tracking-tighter text-white/[0.07]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              aria-hidden
            >
              {meta.code}
            </motion.span>
            <div className="min-w-0 flex-1">
              <p className="eyebrow">
                {mid === 7 ? 'Modo laboratorio' : 'Modo estudio'} · Módulo {meta.code}
              </p>
              <h1 className="display mt-3 text-4xl sm:text-5xl">{meta.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="chip">{meta.kicker}</span>
                <span className="chip">
                  <Clock className="size-3" aria-hidden /> {meta.minutes} min
                </span>
                {done && (
                  <span className="chip border-ok/40 text-ok">
                    <CheckCircle2 className="size-3" aria-hidden /> Completado
                  </span>
                )}
                {mid !== 7 && (
                  <a href={`${href.module(mid)}?eval`} className="chip hover:border-cyan/50 hover:text-ink">
                    <ListChecks className="size-3" aria-hidden /> Ir a la evaluación
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-24 px-4 py-16 sm:px-6">
        <Content />

        <section aria-labelledby="resumen" className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="eyebrow">Modo estudio</p>
            <h2 id="resumen" className="display mt-3 text-3xl">
              Resumen del módulo
            </h2>
            <ul className="mt-6 space-y-4">
              {meta.summary.map((s, k) => (
                <li key={k} className="flex gap-3 text-mute">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" aria-hidden />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-dim">Conceptos fundamentales</h3>
            <KeyConcepts items={meta.concepts} />
          </div>
        </section>

        {mid !== 7 && (
          <div id="eval" className="scroll-mt-24">
            <ModuleQuiz quizKey={`m${mid}`} questions={MODULE_QUIZZES[mid as 1]} />
          </div>
        )}

        <nav className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:justify-between" aria-label="Navegación entre módulos">
          {mid > 1 ? (
            <a href={href.module(mid - 1)} className="group flex items-center gap-3 rounded-2xl border border-line p-4 hover:border-white/25">
              <ArrowLeft className="size-4 text-dim group-hover:text-ink" />
              <span>
                <span className="block font-mono text-[11px] text-dim">Anterior · {MODULE_BY_ID[(mid - 1) as ModuleId].code}</span>
                <span className="text-sm">{MODULE_BY_ID[(mid - 1) as ModuleId].title}</span>
              </span>
            </a>
          ) : (
            <span />
          )}
          {mid < 7 ? (
            <a href={href.module(mid + 1)} className="group flex items-center justify-end gap-3 rounded-2xl border border-line p-4 text-right hover:border-cyan/40">
              <span>
                <span className="block font-mono text-[11px] text-dim">Siguiente · {MODULE_BY_ID[(mid + 1) as ModuleId].code}</span>
                <span className="text-sm">{MODULE_BY_ID[(mid + 1) as ModuleId].title}</span>
              </span>
              <ArrowRight className="size-4 text-cyan" />
            </a>
          ) : (
            <a href={href.exam} className="group flex items-center justify-end gap-3 rounded-2xl border border-cyan/40 bg-cyan/[0.05] p-4 text-right">
              <span>
                <span className="block font-mono text-[11px] text-dim">Modo evaluación</span>
                <span className="text-sm">Examen final · 20 preguntas</span>
              </span>
              <ArrowRight className="size-4 text-cyan" />
            </a>
          )}
        </nav>
      </div>
    </article>
  );
}
