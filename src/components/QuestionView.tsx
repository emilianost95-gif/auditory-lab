import { Check, X } from 'lucide-react';
import { FULL_VIEW, STRUCTURE_BY_ID, type StructureId } from '@/data/anatomy';
import type { AnswerValue, Question } from '@/data/types';
import { stablePermutation } from '@/lib/grading';
import { EarArt } from './EarArt';
import { WaveFigure } from './waves';

interface Props {
  q: Question;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
  /** Muestra la corrección (solo después de responder). */
  reveal?: boolean;
  disabled?: boolean;
}

const TYPE_LABEL: Record<string, string> = {
  mcq: 'Selección múltiple',
  tf: 'Verdadero o falso',
  identify: 'Identificación anatómica',
  match: 'Relación de conceptos',
  wave: 'Interpretación de ondas',
};

export const questionTypeLabel = (q: Question) => TYPE_LABEL[q.type === 'mcq' && q.figure ? 'wave' : q.type];

function optionClass(selected: boolean, state: 'ok' | 'bad' | null) {
  if (state === 'ok') return 'border-ok/70 bg-ok/10 text-ink';
  if (state === 'bad') return 'border-bad/70 bg-bad/10 text-ink';
  return selected ? 'border-cyan/70 bg-cyan/10 text-ink' : 'border-line bg-deep/60 text-mute hover:border-cyan/40 hover:text-ink';
}

function Choice({
  children,
  selected,
  state,
  onClick,
  disabled,
  letter,
}: {
  children: React.ReactNode;
  selected: boolean;
  state: 'ok' | 'bad' | null;
  onClick: () => void;
  disabled?: boolean;
  letter: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default ${optionClass(selected, state)}`}
    >
      <span
        className={`mt-px grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[11px] ${
          selected ? 'border-cyan bg-cyan text-void' : 'border-line'
        }`}
      >
        {state === 'ok' ? <Check className="size-3.5" /> : state === 'bad' ? <X className="size-3.5" /> : letter}
      </span>
      <span className="leading-relaxed">{children}</span>
    </button>
  );
}

const LETTERS = 'ABCDEFGH';

export function QuestionView({ q, value, onChange, reveal = false, disabled = false }: Props) {
  const lock = disabled || reveal;

  if (q.type === 'mcq') {
    return (
      <div className="space-y-4">
        {q.figure && (
          <div className="grid gap-3 sm:grid-cols-2">
            {q.figure.map((f, i) => (
              <WaveFigure key={f.label} spec={f} color={i ? '#8b5cf6' : '#22d3ee'} />
            ))}
          </div>
        )}
        <div role="radiogroup" className="grid gap-2">
          {q.options.map((opt, i) => (
            <Choice
              key={opt}
              letter={LETTERS[i]!}
              selected={value === i}
              disabled={lock}
              onClick={() => onChange(i)}
              state={reveal ? (i === q.answer ? 'ok' : value === i ? 'bad' : null) : null}
            >
              {opt}
            </Choice>
          ))}
        </div>
      </div>
    );
  }

  if (q.type === 'tf') {
    return (
      <div role="radiogroup" className="grid grid-cols-2 gap-2">
        {[true, false].map((b, i) => (
          <Choice
            key={String(b)}
            letter={b ? 'V' : 'F'}
            selected={value === b}
            disabled={lock}
            onClick={() => onChange(b)}
            state={reveal ? (b === q.answer ? 'ok' : value === b ? 'bad' : null) : null}
          >
            {i === 0 ? 'Verdadero' : 'Falso'}
          </Choice>
        ))}
      </div>
    );
  }

  if (q.type === 'identify') {
    const sel = (typeof value === 'string' ? value : null) as StructureId | null;
    if (q.mode === 'click') {
      return (
        <div>
          <div className="aspect-[1.84] overflow-hidden rounded-2xl border border-line bg-deep">
            <EarArt
              view={FULL_VIEW}
              hotspots
              anonymous
              selected={sel}
              onSelect={(id) => !lock && onChange(id)}
              mark={reveal && sel ? { id: sel, ok: sel === q.answer } : null}
              labels={reveal ? [q.answer] : []}
              highlight={reveal ? [q.answer] : []}
              title="Modelo del oído para identificar estructuras"
            />
          </div>
          <p className="mt-3 text-sm text-mute" aria-live="polite">
            {!sel
              ? 'Toca uno de los puntos del modelo.'
              : reveal
                ? <>Seleccionaste: <strong className="text-ink">{STRUCTURE_BY_ID[sel].name}</strong>.</>
                : 'Punto seleccionado. Puedes cambiarlo antes de confirmar.'}
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div className="aspect-[1.84] overflow-hidden rounded-2xl border border-line bg-deep">
          <EarArt view={FULL_VIEW} highlight={[q.answer]} dim title="Modelo del oído con una estructura resaltada" />
        </div>
        <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
          {(q.options ?? []).map((id, i) => (
            <Choice
              key={id}
              letter={LETTERS[i]!}
              selected={value === id}
              disabled={lock}
              onClick={() => onChange(id)}
              state={reveal ? (id === q.answer ? 'ok' : value === id ? 'bad' : null) : null}
            >
              {STRUCTURE_BY_ID[id].name}
            </Choice>
          ))}
        </div>
      </div>
    );
  }

  // match
  const perm = stablePermutation(q.pairs.length, q.id);
  const arr = Array.isArray(value) ? value : q.pairs.map(() => null);
  return (
    <div className="space-y-2">
      {q.pairs.map((pair, i) => {
        const chosen = arr[i] ?? null;
        const state = reveal ? (chosen === i ? 'ok' : 'bad') : null;
        return (
          <div
            key={pair.left}
            className={`grid items-center gap-2 rounded-xl border p-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] ${optionClass(chosen !== null, state)}`}
          >
            <span className="text-sm font-medium text-ink">{pair.left}</span>
            <div>
              <select
                aria-label={`Relación para ${pair.left}`}
                disabled={lock}
                value={chosen ?? ''}
                onChange={(e) => {
                  const next = [...arr];
                  next[i] = e.target.value === '' ? null : Number(e.target.value);
                  onChange(next);
                }}
                className="w-full rounded-lg border border-line bg-void px-3 py-2 text-sm text-ink disabled:opacity-80"
              >
                <option value="">Elegir…</option>
                {perm.map((j) => (
                  <option key={j} value={j}>
                    {q.pairs[j]!.right}
                  </option>
                ))}
              </select>
              {reveal && chosen !== i && <p className="mt-1.5 text-xs text-ok">Correcto: {pair.right}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
