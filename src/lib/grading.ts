import type { AnswerValue, Question, TopicId } from '@/data/types';

export const POINTS_PER_QUESTION = 5;

/** Fracción de acierto (0–1) de una respuesta. */
export function answerFraction(q: Question, a: AnswerValue | undefined): number {
  if (a === undefined || a === null) return 0;
  switch (q.type) {
    case 'mcq':
      return a === q.answer ? 1 : 0;
    case 'tf':
      return a === q.answer ? 1 : 0;
    case 'identify':
      return a === q.answer ? 1 : 0;
    case 'match': {
      if (!Array.isArray(a)) return 0;
      const ok = q.pairs.reduce((n, _, i) => n + (a[i] === i ? 1 : 0), 0);
      return ok / q.pairs.length;
    }
  }
}

export const isCorrect = (q: Question, a: AnswerValue | undefined) => answerFraction(q, a) === 1;

export function isAnswered(q: Question, a: AnswerValue | undefined): boolean {
  if (a === undefined || a === null) return false;
  if (q.type === 'match') return Array.isArray(a) && a.length === q.pairs.length && a.every((v) => v !== null && v !== undefined);
  return true;
}

export interface QuestionResult {
  question: Question;
  answer: AnswerValue | undefined;
  points: number;
  correct: boolean;
}

export interface ExamResult {
  /** Puntaje sobre 100 (redondeado). */
  score: number;
  /** Respuestas completamente correctas. */
  correctCount: number;
  total: number;
  /** Porcentaje de respuestas correctas (0–100). */
  percent: number;
  results: QuestionResult[];
  /** Temas con errores, ordenados por cantidad de puntos perdidos. */
  weakTopics: { topic: TopicId; lost: number; wrong: number }[];
}

export function gradeExam(questions: Question[], answers: Record<string, AnswerValue | undefined>): ExamResult {
  const maxPerQ = 100 / questions.length;
  const results = questions.map((q) => {
    const frac = answerFraction(q, answers[q.id]);
    return { question: q, answer: answers[q.id], points: frac * maxPerQ, correct: frac === 1 };
  });
  const raw = results.reduce((s, r) => s + r.points, 0);
  const correctCount = results.filter((r) => r.correct).length;
  const topicMap = new Map<TopicId, { lost: number; wrong: number }>();
  for (const r of results) {
    if (r.correct) continue;
    const t = topicMap.get(r.question.topic) ?? { lost: 0, wrong: 0 };
    t.lost += maxPerQ - r.points;
    t.wrong += 1;
    topicMap.set(r.question.topic, t);
  }
  const weakTopics = [...topicMap.entries()]
    .map(([topic, v]) => ({ topic, ...v }))
    .sort((a, b) => b.lost - a.lost);
  return {
    score: Math.round(raw),
    correctCount,
    total: questions.length,
    percent: Math.round((correctCount / questions.length) * 100),
    results,
    weakTopics,
  };
}

/** Permutación determinista (no identidad) para mezclar las columnas de un ejercicio de relación. */
export function stablePermutation(n: number, seed: string): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  const p = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j]!, p[i]!];
  }
  if (n > 1 && p.every((v, i) => v === i)) p.push(p.shift()!);
  return p;
}

export function gradeLabel(score: number): { label: string; tone: 'ok' | 'warn' | 'bad' } {
  if (score >= 90) return { label: 'Excelente dominio', tone: 'ok' };
  if (score >= 70) return { label: 'Aprobado con buen nivel', tone: 'ok' };
  if (score >= 60) return { label: 'Aprobado justo', tone: 'warn' };
  return { label: 'Necesitas reforzar', tone: 'bad' };
}
