import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Check, ClipboardCheck, FlaskConical, RotateCcw } from 'lucide-react';
import { EarArt } from '@/components/EarArt';
import { Bar, ProgressRing } from '@/components/ui';
import { STRUCTURES } from '@/data/anatomy';
import { MODULES } from '@/data/modules';
import { href } from '@/lib/router';
import { LAB_EXPERIMENTS, isModuleDone, moduleCompletion, overallCompletion, progressStore, useProgress } from '@/lib/progress';

const ease = [0.16, 1, 0.3, 1] as const;

export function Dashboard() {
  const p = useProgress();
  const next = MODULES.find((m) => !isModuleDone(p, m.id)) ?? MODULES[0]!;
  const started = p.visited.length > 0;
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="tech-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-6 px-4 pb-10 pt-28 sm:px-6 lg:min-h-[92dvh] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:items-center lg:pb-16">
          <div className="relative z-10">
            <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              Laboratorio de audiología interactiva
            </motion.p>
            <motion.h1
              className="display mt-5 text-[clamp(2.6rem,7vw,5.6rem)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.1 }}
            >
              <span className="text-gradient">Así escucha</span>
              <br />
              el cuerpo humano.
            </motion.h1>
            <motion.p
              className="mt-6 max-w-lg text-lg leading-relaxed text-mute"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.25 }}
            >
              Una vibración en el aire se vuelve movimiento de huesos, ondas en un líquido, impulsos eléctricos y, finalmente, una experiencia en tu cerebro. Explóralo
              paso a paso.
            </motion.p>
            <motion.div className="mt-8 flex flex-wrap gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.8 }}>
              <a href={href.module(next.id)} className="btn btn-primary px-5 py-3">
                {started ? `Continuar · Módulo ${next.code}` : 'Comenzar a estudiar'} <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href={href.module(7)} className="btn btn-ghost px-5 py-3">
                <FlaskConical className="size-4" aria-hidden /> Laboratorio
              </a>
            </motion.div>
            <dl className="mt-10 grid max-w-md grid-cols-4 gap-4 border-t border-line pt-6">
              {[
                ['11', 'estructuras'],
                ['10', 'etapas'],
                ['5', 'experimentos'],
                ['20', 'preguntas'],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-mono text-2xl tabular-nums text-ink">{n}</dd>
                  <dd className="mt-0.5 text-[11px] text-dim">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <motion.div
            className="relative -mx-4 aspect-[1.6] sm:mx-0 xl:-mr-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease, delay: 0.2 }}
          >
            <div className="absolute inset-[8%] rounded-full bg-electric/10 blur-3xl" aria-hidden />
            <EarArt
              view={[0, 70, 1120, 460]}
              showSource
              fx={['source', 'waves', 'canal', 'drum', 'ossicles', 'fluid', 'nerve', 'brain']}
              title="Animación del recorrido del sonido desde una fuente hasta el cerebro"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-[6%] font-mono text-[10px] uppercase tracking-widest text-dim">
              <span>Fuente</span>
              <span className="hidden sm:inline">Externo</span>
              <span className="hidden sm:inline">Medio</span>
              <span>Interno</span>
              <span>Cerebro</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MODOS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {[
            { Icon: BookOpen, t: 'Modo estudio', d: 'Seis módulos con explicaciones breves, modelos interactivos, resumen y autoevaluación.', to: '#/?modulos', c: '#22d3ee' },
            { Icon: FlaskConical, t: 'Modo laboratorio', d: 'Cinco experimentos con ondas, frecuencia, amplitud, timbre y el recorrido del sonido.', to: href.module(7), c: '#3b82f6' },
            { Icon: ClipboardCheck, t: 'Modo evaluación', d: 'Evaluaciones por módulo y un examen final de 20 preguntas con informe de resultados.', to: href.evaluations, c: '#8b5cf6' },
          ].map(({ Icon, t, d, to, c }) => (
            <a key={t} href={to} className="group relative bg-deep p-6 transition-colors hover:bg-surface sm:p-8">
              <Icon className="size-6" style={{ color: c }} aria-hidden />
              <h2 className="mt-5 text-xl font-semibold">{t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-mute">{d}</p>
              <ArrowRight className="absolute right-6 top-6 size-5 text-dim transition-transform group-hover:translate-x-1 group-hover:text-ink" aria-hidden />
            </a>
          ))}
        </div>
      </section>

      {/* MÓDULOS */}
      <section id="modulos" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Ruta de aprendizaje</p>
            <h2 className="display mt-3 text-4xl">Módulos</h2>
          </div>
          <p className="max-w-sm text-sm text-mute">Recomendado en orden: cada módulo usa lo que aprendiste en el anterior.</p>
        </div>
        <ol className="divide-y divide-line border-y border-line">
          {MODULES.map((m, k) => {
            const done = isModuleDone(p, m.id);
            const c = moduleCompletion(p, m.id);
            return (
              <motion.li key={m.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.04, duration: 0.5 }}>
                <a href={href.module(m.id)} className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 py-5 transition-colors hover:bg-white/[0.02] sm:grid-cols-[4.5rem_minmax(0,1fr)_12rem_auto] sm:px-2">
                  <span className={`font-mono text-2xl tabular-nums sm:text-3xl ${done ? 'text-ok' : 'text-dim group-hover:text-cyan'}`}>{m.code}</span>
                  <span className="min-w-0">
                    <span className="block text-lg font-medium leading-tight sm:text-xl">{m.title}</span>
                    <span className="mt-1 block truncate text-sm text-mute">
                      {m.kicker} · {m.minutes} min
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    <Bar value={c} />
                    <span className="mt-1.5 block font-mono text-[11px] text-dim">{done ? 'Completado' : c > 0 ? `${Math.round(c * 100)} %` : 'Sin iniciar'}</span>
                  </span>
                  <span className={`grid size-9 place-items-center rounded-full border ${done ? 'border-ok/50 text-ok' : 'border-line text-dim group-hover:border-cyan/50 group-hover:text-cyan'}`}>
                    {done ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
                  </span>
                </a>
              </motion.li>
            );
          })}
        </ol>
      </section>

      {/* PROGRESO */}
      <section id="progreso" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 pt-8 sm:px-6">
        <div className="panel grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
          <ProgressRing value={overallCompletion(p)} size={132} stroke={8} />
          <div>
            <p className="eyebrow">Tu progreso</p>
            <h2 className="mt-2 text-2xl font-semibold">Avance general del laboratorio</h2>
            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat k="Módulos completados" v={`${MODULES.filter((m) => isModuleDone(p, m.id)).length}/7`} />
              <Stat k="Estructuras exploradas" v={`${p.explored.length}/${STRUCTURES.length}`} />
              <Stat k="Experimentos" v={`${LAB_EXPERIMENTS.filter((e) => p.lab[e]).length}/5`} />
              <Stat k="Examen final" v={p.exam.best === null ? '—' : `${p.exam.best}/100`} />
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-dim">El progreso se guarda en este navegador.</span>
              {confirmReset ? (
                <span className="flex items-center gap-2">
                  <span className="text-warn">¿Borrar todo el progreso?</span>
                  <button
                    type="button"
                    className="btn btn-ghost border-bad/50 py-1.5 text-bad"
                    onClick={() => {
                      progressStore.reset();
                      setConfirmReset(false);
                    }}
                  >
                    Sí, borrar
                  </button>
                  <button type="button" className="btn btn-ghost py-1.5" onClick={() => setConfirmReset(false)}>
                    Cancelar
                  </button>
                </span>
              ) : (
                <button type="button" className="inline-flex items-center gap-1.5 text-dim underline-offset-4 hover:text-ink hover:underline" onClick={() => setConfirmReset(true)}>
                  <RotateCcw className="size-3.5" aria-hidden /> Reiniciar progreso
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-dim">{k}</dt>
      <dd className="mt-1 font-mono text-xl tabular-nums">{v}</dd>
    </div>
  );
}
