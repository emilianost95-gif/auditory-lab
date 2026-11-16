import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Flag, RotateCcw, XCircle } from 'lucide-react';
import { QuestionView, questionTypeLabel } from '@/components/QuestionView';
import { ProgressRing } from '@/components/ui';
import { EXAM } from '@/data/exam';
import { TOPIC_MODULE, TOPIC_NAME } from '@/data/modules';
import type { AnswerValue, TopicId } from '@/data/types';
import { gradeExam, gradeLabel, isAnswered, type ExamResult } from '@/lib/grading';
import { progressStore, useProgress } from '@/lib/progress';
import { href } from '@/lib/router';

type Phase = 'intro' | 'running' | 'results';

const RECOMMENDATIONS: Record<TopicId, string> = {
  intro: 'Repasa la diferencia entre oído (recibe y transforma) y cerebro (interpreta), y por qué el sonido necesita un medio.',
  anatomia: 'Recorre el modelo anatómico región por región y lee la ficha de cada estructura, prestando atención a su ubicación.',
  recorrido: 'Repite la simulación de 10 etapas fijándote en la barra de forma de la energía: aire → sólido → líquido → señal nerviosa.',
  fisica: 'Usa el estudio de ondas: cambia f y observa λ; practica cálculos con v = λ·f y distingue amplitud de frecuencia.',
  caracteristicas: 'Compara tono, timbre e intensidad en el módulo 05: escucha y observa qué propiedad de la onda cambia en cada caso.',
  salud: 'Practica con el simulador de dosis de ruido (regla de los 3 dB) y repasa los tipos de pérdida auditiva.',
};

export function ExamView() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue | undefined>>({});
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const p = useProgress();

  const answeredCount = EXAM.filter((q) => isAnswered(q, answers[q.id])).length;
  const q = EXAM[i]!;

  const start = () => {
    setAnswers({});
    setI(0);
    setResult(null);
    setConfirming(false);
    setPhase('running');
    window.scrollTo({ top: 0 });
  };
  const finish = () => {
    const r = gradeExam(EXAM, answers);
    progressStore.recordExam(r.score);
    setResult(r);
    setPhase('results');
    setConfirming(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.section key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="eyebrow">Modo evaluación</p>
            <h1 className="display mt-3 text-5xl">Examen final</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mute">
              20 preguntas sobre todo el laboratorio. Cada una vale 5 puntos (las de relación otorgan puntaje parcial). Las respuestas correctas se muestran recién al finalizar.
            </p>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-5">
              {['Selección múltiple', 'Verdadero o falso', 'Identificación anatómica', 'Relación de conceptos', 'Interpretación de ondas'].map((t) => (
                <li key={t} className="bg-deep p-4 text-sm text-mute">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" className="btn btn-primary px-6 py-3" onClick={start}>
                <ClipboardCheck className="size-4" aria-hidden /> Comenzar examen
              </button>
              {p.exam.best !== null && (
                <span className="text-sm text-mute">
                  Mejor puntaje: <strong className="font-mono text-ink">{p.exam.best}/100</strong> · {p.exam.attempts.length} intento{p.exam.attempts.length === 1 ? '' : 's'}
                </span>
              )}
            </div>
            {p.exam.attempts.length > 1 && (
              <div className="mt-8">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-dim">Intentos recientes</p>
                <div className="flex h-20 items-end gap-2">
                  {p.exam.attempts.map((a) => (
                    <div key={a.at} className="flex w-8 flex-col items-center gap-1" title={`${a.score}/100`}>
                      <div className="w-full rounded-t bg-gradient-to-t from-electric to-cyan" style={{ height: `${Math.max(3, a.score * 0.6)}px` }} />
                      <span className="font-mono text-[10px] text-dim">{a.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {phase === 'running' && (
          <motion.section key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow">Examen final · pregunta {i + 1} de {EXAM.length}</p>
              <span className="font-mono text-xs text-mute">
                Respondidas {answeredCount}/{EXAM.length}
              </span>
            </div>
            <nav className="mt-4 flex flex-wrap gap-1.5" aria-label="Preguntas del examen">
              {EXAM.map((x, k) => {
                const done = isAnswered(x, answers[x.id]);
                return (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setI(k)}
                    aria-current={k === i ? 'step' : undefined}
                    aria-label={`Pregunta ${k + 1}${done ? ', respondida' : ''}`}
                    className={`grid size-8 place-items-center rounded-lg border font-mono text-xs transition-colors ${
                      k === i ? 'border-cyan bg-cyan text-void' : done ? 'border-cyan/40 bg-cyan/10 text-ink' : 'border-line text-dim hover:text-ink'
                    }`}
                  >
                    {k + 1}
                  </button>
                );
              })}
            </nav>

            <div className="panel mt-6 p-5 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div key={q.id} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.22 }}>
                  <span className="chip">{questionTypeLabel(q)}</span>
                  <h2 className="mt-4 text-xl font-medium leading-snug sm:text-2xl">{q.prompt}</h2>
                  <div className="mt-6">
                    <QuestionView q={q} value={answers[q.id]} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                <button type="button" className="btn btn-ghost" onClick={() => setI(i - 1)} disabled={i === 0}>
                  <ArrowLeft className="size-4" aria-hidden /> Anterior
                </button>
                {i < EXAM.length - 1 ? (
                  <button type="button" className="btn btn-primary" onClick={() => setI(i + 1)}>
                    Siguiente <ArrowRight className="size-4" aria-hidden />
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={() => (answeredCount < EXAM.length ? setConfirming(true) : finish())}>
                    <Flag className="size-4" aria-hidden /> Finalizar examen
                  </button>
                )}
              </div>
              {i < EXAM.length - 1 && (
                <div className="mt-3 text-right">
                  <button type="button" className="text-xs text-dim underline-offset-4 hover:text-ink hover:underline" onClick={() => (answeredCount < EXAM.length ? setConfirming(true) : finish())}>
                    Finalizar ahora
                  </button>
                </div>
              )}
              {confirming && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-xl border border-warn/40 bg-warn/[0.06] p-4" role="alertdialog" aria-label="Confirmar finalización">
                  <p className="text-sm text-ink">
                    Tienes {EXAM.length - answeredCount} pregunta{EXAM.length - answeredCount === 1 ? '' : 's'} sin responder (o incompletas). Se calificarán con 0 puntos.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost py-1.5"
                      onClick={() => {
                        setConfirming(false);
                        const first = EXAM.findIndex((x) => !isAnswered(x, answers[x.id]));
                        if (first >= 0) setI(first);
                      }}
                    >
                      Ir a la primera pendiente
                    </button>
                    <button type="button" className="btn btn-primary py-1.5" onClick={finish}>
                      Finalizar igualmente
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {phase === 'results' && result && <Results key="res" result={result} onRetry={start} />}
      </AnimatePresence>
    </div>
  );
}

function Results({ result, onRetry }: { result: ExamResult; onRetry: () => void }) {
  const g = gradeLabel(result.score);
  const toneColor = { ok: '#34d399', warn: '#fbbf24', bad: '#fb7185' }[g.tone];
  const wrong = result.results.filter((r) => !r.correct);
  const byTopic = useMemo(() => {
    const m = new Map<TopicId, { got: number; max: number }>();
    for (const r of result.results) {
      const t = m.get(r.question.topic) ?? { got: 0, max: 0 };
      t.got += r.points;
      t.max += 100 / result.total;
      m.set(r.question.topic, t);
    }
    return [...m.entries()];
  }, [result]);

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <p className="eyebrow">Resultados del examen final</p>
      <div className="mt-6 grid gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
        <ProgressRing value={result.score / 100} size={168} stroke={10} label={`${result.score}/100`} />
        <div>
          <h1 className="display text-5xl" style={{ color: toneColor }}>
            {g.label}
          </h1>
          <dl className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-dim">Calificación</dt>
              <dd className="mt-1 font-mono text-3xl tabular-nums">{result.score}</dd>
            </div>
            <div>
              <dt className="text-xs text-dim">Respuestas correctas</dt>
              <dd className="mt-1 font-mono text-3xl tabular-nums">{result.percent}%</dd>
            </div>
            <div>
              <dt className="text-xs text-dim">Aciertos</dt>
              <dd className="mt-1 font-mono text-3xl tabular-nums">
                {result.correctCount}/{result.total}
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onRetry} className="btn btn-primary">
              <RotateCcw className="size-4" aria-hidden /> Repetir examen
            </button>
            <a href="#/?modulos" className="btn btn-ghost">
              <BookOpen className="size-4" aria-hidden /> Volver a estudiar
            </a>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Rendimiento por tema</h2>
          <ul className="mt-5 space-y-4">
            {byTopic.map(([t, v]) => {
              const pct = v.got / v.max;
              return (
                <li key={t}>
                  <div className="flex justify-between text-sm">
                    <span className="text-mute">{TOPIC_NAME[t]}</span>
                    <span className="font-mono">{Math.round(pct * 100)} %</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: pct >= 0.75 ? '#34d399' : pct >= 0.5 ? '#fbbf24' : '#fb7185' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct * 100}%` }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Temas que debes reforzar</h2>
          {result.weakTopics.length === 0 ? (
            <p className="mt-5 flex gap-2 text-mute">
              <CheckCircle2 className="size-5 text-ok" aria-hidden /> Ninguno: respondiste todo correctamente. Puedes profundizar en el laboratorio.
            </p>
          ) : (
            <ul className="mt-5 space-y-3">
              {result.weakTopics.map((w) => (
                <li key={w.topic} className="rounded-2xl border border-line p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{TOPIC_NAME[w.topic]}</span>
                    <span className="chip">
                      {w.wrong} error{w.wrong === 1 ? '' : 'es'} · −{Math.round(w.lost * 10) / 10} pts
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{RECOMMENDATIONS[w.topic]}</p>
                  <a href={href.module(TOPIC_MODULE[w.topic])} className="mt-2 inline-flex items-center gap-1 text-sm text-cyan hover:underline">
                    Ir al módulo {String(TOPIC_MODULE[w.topic]).padStart(2, '0')} <ArrowRight className="size-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-semibold">Recomendaciones de estudio</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-mute">
          {result.score < 60 && <li>• Vuelve a recorrer los módulos en orden y completa cada autoevaluación con al menos 75 % antes de repetir el examen.</li>}
          {result.score >= 60 && result.score < 90 && <li>• Concéntrate en los temas señalados: relee el resumen, revisa los conceptos clave y repite la autoevaluación del módulo.</li>}
          {result.score >= 90 && <li>• Excelente. Para consolidar, intenta explicar con tus palabras el recorrido completo del sonido sin mirar el material.</li>}
          <li>• Usa el glosario para repasar términos que hayas confundido.</li>
          <li>• Estudia en sesiones cortas (20–30 min) y vuelve a evaluarte otro día: la práctica espaciada mejora la memoria a largo plazo.</li>
        </ul>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-semibold">
          Respuestas incorrectas explicadas <span className="font-mono text-base text-dim">({wrong.length})</span>
        </h2>
        {wrong.length === 0 ? (
          <p className="mt-4 text-mute">No hay respuestas incorrectas.</p>
        ) : (
          <ol className="mt-6 space-y-6">
            {wrong.map((r) => {
              const n = EXAM.indexOf(r.question) + 1;
              return (
                <li key={r.question.id} className="panel p-5 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm text-dim">#{n}</span>
                    <span className="chip">{questionTypeLabel(r.question)}</span>
                    <span className="chip">{TOPIC_NAME[r.question.topic]}</span>
                    <span className="ml-auto flex items-center gap-1 font-mono text-xs text-bad">
                      <XCircle className="size-3.5" aria-hidden />
                      {r.answer === undefined ? 'Sin responder' : `${Math.round(r.points * 10) / 10}/5 pts`}
                    </span>
                  </div>
                  <p className="mt-4 font-medium">{r.question.prompt}</p>
                  <div className="mt-4">
                    <QuestionView q={r.question} value={r.answer} onChange={() => {}} reveal />
                  </div>
                  <p className="mt-4 rounded-xl border border-electric/30 bg-electric/[0.06] p-4 text-sm leading-relaxed text-mute">
                    <strong className="text-ink">Explicación: </strong>
                    {r.question.explanation}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </motion.section>
  );
}
