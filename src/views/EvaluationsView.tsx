import { ArrowRight, CheckCircle2, ClipboardCheck, FlaskConical } from 'lucide-react';
import { Bar } from '@/components/ui';
import { MODULES } from '@/data/modules';
import { href } from '@/lib/router';
import { LAB_EXPERIMENTS, useProgress } from '@/lib/progress';

export function EvaluationsView() {
  const p = useProgress();
  const labDone = LAB_EXPERIMENTS.filter((e) => p.lab[e]).length;
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
      <p className="eyebrow">Modo evaluación</p>
      <h1 className="display mt-3 text-5xl">Evalúa lo que aprendiste</h1>
      <p className="mt-4 max-w-2xl text-mute">Cada módulo termina con una autoevaluación con retroalimentación inmediata. Cuando te sientas preparado, rinde el examen final.</p>

      <a href={href.exam} className="group panel corner-ticks mt-10 flex flex-wrap items-center gap-6 p-6 sm:p-8">
        <ClipboardCheck className="size-10 text-cyan" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold">Examen final</h2>
          <p className="mt-1 text-sm text-mute">20 preguntas · 100 puntos · 5 tipos de pregunta · informe con temas a reforzar</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl tabular-nums">{p.exam.best === null ? '—' : `${p.exam.best}/100`}</p>
          <p className="text-xs text-dim">mejor puntaje</p>
        </div>
        <ArrowRight className="size-5 text-dim transition-transform group-hover:translate-x-1 group-hover:text-cyan" aria-hidden />
      </a>

      <h2 className="mt-14 font-mono text-xs uppercase tracking-widest text-dim">Autoevaluaciones por módulo</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {MODULES.filter((m) => m.id !== 7).map((m) => {
          const r = p.quizzes[`m${m.id}`];
          const pass = r && r.best / r.total >= 0.75;
          return (
            <li key={m.id}>
              <a href={`${href.module(m.id)}?eval`} className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 py-4">
                <span className={`font-mono text-xl ${pass ? 'text-ok' : 'text-dim'}`}>{m.code}</span>
                <span className="min-w-0">
                  <span className="block font-medium">{m.title}</span>
                  <Bar value={r ? r.best / r.total : 0} className="mt-2 max-w-xs" />
                </span>
                <span className="flex items-center gap-2 font-mono text-sm text-mute">
                  {r ? `${r.best}/${r.total}` : 'Pendiente'}
                  {pass && <CheckCircle2 className="size-4 text-ok" aria-hidden />}
                </span>
              </a>
            </li>
          );
        })}
        <li>
          <a href={href.module(7)} className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 py-4">
            <FlaskConical className={`size-5 ${labDone === 5 ? 'text-ok' : 'text-dim'}`} aria-hidden />
            <span className="min-w-0">
              <span className="block font-medium">Observaciones del laboratorio</span>
              <Bar value={labDone / 5} className="mt-2 max-w-xs" />
            </span>
            <span className="font-mono text-sm text-mute">{labDone}/5</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
