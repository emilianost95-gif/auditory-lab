import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { AnswerValue, Question } from '@/data/types';
import { isAnswered, isCorrect } from '@/lib/grading';
import { progressStore, useProgress } from '@/lib/progress';
import { QuestionView, questionTypeLabel } from './QuestionView';

/** Mini-evaluación con retroalimentación inmediata tras cada respuesta. */
export function ModuleQuiz({ quizKey, questions, title = 'Evaluación del módulo' }: { quizKey: string; questions: Question[]; title?: string }) {
  const progress = useProgress();
  const record = progress.quizzes[quizKey];
  const [i, setI] = useState(0);
  const [value, setValue] = useState<AnswerValue | undefined>(undefined);
  const [checked, setChecked] = useState(false);
  const [hits, setHits] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i]!;

  const check = () => {
    setChecked(true);
    if (isCorrect(q, value)) setHits((h) => h + 1);
  };
  const next = () => {
    if (i + 1 >= questions.length) {
      const final = hits;
      progressStore.recordQuiz(quizKey, final, questions.length);
      setDone(true);
      return;
    }
    setI(i + 1);
    setValue(undefined);
    setChecked(false);
  };
  const restart = () => {
    setI(0);
    setValue(undefined);
    setChecked(false);
    setHits(0);
    setDone(false);
  };

  const ok = checked && isCorrect(q, value);

  return (
    <section className="panel corner-ticks p-5 sm:p-8" aria-labelledby={`${quizKey}-title`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Autoevaluación</p>
          <h3 id={`${quizKey}-title`} className="mt-1 text-xl font-semibold">
            {title}
          </h3>
        </div>
        {record && (
          <span className="chip">
            Mejor resultado: {record.best}/{record.total}
          </span>
        )}
      </div>

      {done ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <p className="display text-5xl tabular-nums">
            {hits}
            <span className="text-mute">/{questions.length}</span>
          </p>
          <p className="mt-3 text-mute">
            {hits === questions.length
              ? 'Perfecto. Dominas los conceptos de este módulo.'
              : hits / questions.length >= 0.75
                ? 'Muy bien: módulo completado. Repasa la explicación de la pregunta que fallaste.'
                : 'Te conviene repasar el resumen y volver a intentarlo (se necesita 75 % para completar el módulo).'}
          </p>
          <button type="button" onClick={restart} className="btn btn-ghost mt-5">
            <RotateCcw className="size-4" aria-hidden /> Repetir evaluación
          </button>
        </motion.div>
      ) : (
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden>
              {questions.map((_, k) => (
                <span key={k} className={`h-1 w-7 rounded-full ${k < i ? 'bg-cyan' : k === i ? 'bg-cyan/60' : 'bg-white/10'}`} />
              ))}
            </div>
            <span className="font-mono text-xs text-dim">
              {i + 1}/{questions.length} · {questionTypeLabel(q)}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
              <p className="mb-4 text-lg font-medium leading-snug">{q.prompt}</p>
              <QuestionView q={q} value={value} onChange={setValue} reveal={checked} />
            </motion.div>
          </AnimatePresence>

          <div aria-live="polite">
            {checked && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-5 flex gap-3 rounded-xl border p-4 text-sm ${ok ? 'border-ok/40 bg-ok/[0.07]' : 'border-bad/40 bg-bad/[0.07]'}`}
              >
                {ok ? <CheckCircle2 className="size-5 shrink-0 text-ok" aria-hidden /> : <XCircle className="size-5 shrink-0 text-bad" aria-hidden />}
                <p className="leading-relaxed text-mute">
                  <strong className="text-ink">{ok ? 'Correcto. ' : 'No es correcto. '}</strong>
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </div>

          <div className="mt-5 flex justify-end">
            {!checked ? (
              <button type="button" className="btn btn-primary" disabled={!isAnswered(q, value)} onClick={check}>
                Comprobar
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={next}>
                {i + 1 >= questions.length ? 'Ver resultado' : 'Siguiente'} <ArrowRight className="size-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
