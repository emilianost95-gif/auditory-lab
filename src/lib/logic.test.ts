import { beforeEach, describe, expect, it } from 'vitest';
import { EXAM } from '@/data/exam';
import { MODULE_QUIZZES } from '@/data/quizzes';
import { STRUCTURE_BY_ID } from '@/data/anatomy';
import type { AnswerValue, Question } from '@/data/types';
import { answerFraction, gradeExam, isAnswered, stablePermutation } from './grading';
import { formatDuration, safeExposureMinutes, wavelength } from './physics';
import { EMPTY, STORAGE_KEY, isModuleDone, moduleCompletion, overallCompletion, progressStore } from './progress';
import { parseHash } from './router';

const correctAnswer = (q: Question): AnswerValue => {
  switch (q.type) {
    case 'mcq':
      return q.answer;
    case 'tf':
      return q.answer;
    case 'identify':
      return q.answer;
    case 'match':
      return q.pairs.map((_, i) => i);
  }
};

describe('examen final', () => {
  it('tiene 20 preguntas con ids únicos y los cinco tipos requeridos', () => {
    expect(EXAM).toHaveLength(20);
    expect(new Set(EXAM.map((q) => q.id)).size).toBe(20);
    const types = new Set(EXAM.map((q) => (q.type === 'mcq' && q.figure ? 'wave' : q.type)));
    for (const t of ['mcq', 'tf', 'identify', 'match', 'wave']) expect(types.has(t as never)).toBe(true);
  });

  it('las respuestas de cada pregunta son válidas', () => {
    for (const q of [...EXAM, ...Object.values(MODULE_QUIZZES).flat()]) {
      if (q.type === 'mcq') expect(q.options[q.answer]).toBeDefined();
      if (q.type === 'identify') {
        expect(STRUCTURE_BY_ID[q.answer]).toBeDefined();
        if (q.options) expect(q.options).toContain(q.answer);
      }
    }
  });

  it('todo correcto = 100 puntos y 100 %', () => {
    const answers = Object.fromEntries(EXAM.map((q) => [q.id, correctAnswer(q)]));
    const r = gradeExam(EXAM, answers);
    expect(r.score).toBe(100);
    expect(r.percent).toBe(100);
    expect(r.correctCount).toBe(20);
    expect(r.weakTopics).toEqual([]);
  });

  it('sin respuestas = 0 puntos y todos los temas a reforzar', () => {
    const r = gradeExam(EXAM, {});
    expect(r.score).toBe(0);
    expect(r.percent).toBe(0);
    expect(new Set(r.weakTopics.map((t) => t.topic))).toEqual(new Set(EXAM.map((q) => q.topic)));
  });

  it('cada pregunta vale 5 puntos y la relación otorga puntaje parcial', () => {
    const answers: Record<string, AnswerValue> = Object.fromEntries(EXAM.map((q) => [q.id, correctAnswer(q)]));
    answers.e01 = 0; // incorrecta
    answers.e12 = [0, 1, 3, 2]; // 2 de 4 correctas → 2,5 puntos
    const r = gradeExam(EXAM, answers);
    expect(r.score).toBe(Math.round(100 - 5 - 2.5));
    expect(r.correctCount).toBe(18);
    expect(r.percent).toBe(90);
    expect(r.weakTopics[0]).toMatchObject({ topic: 'anatomia', wrong: 1 });
  });

  it('match incompleto no cuenta como respondido', () => {
    const q = EXAM.find((x) => x.id === 'e12')!;
    expect(isAnswered(q, [0, null, 2, 3])).toBe(false);
    expect(isAnswered(q, [0, 1, 2, 3])).toBe(true);
    expect(answerFraction(q, [0, null, 2, 3])).toBe(0.75);
  });

  it('la permutación es estable y nunca es la identidad', () => {
    const a = stablePermutation(4, 'e12');
    expect(a).toEqual(stablePermutation(4, 'e12'));
    expect([...a].sort()).toEqual([0, 1, 2, 3]);
    expect(a.some((v, i) => v !== i)).toBe(true);
  });
});

describe('física', () => {
  it('λ = v / f', () => {
    expect(wavelength(343, 686)).toBeCloseTo(0.5);
    expect(wavelength(343, 343)).toBeCloseTo(1);
  });
  it('tiempo seguro NIOSH: 85 dB → 8 h, 94 dB → 1 h', () => {
    expect(safeExposureMinutes(85)).toBeCloseTo(480);
    expect(safeExposureMinutes(94)).toBeCloseTo(60);
    expect(formatDuration(safeExposureMinutes(100))).toBe('15 min');
  });
});

describe('progreso', () => {
  beforeEach(() => {
    localStorage.clear();
    progressStore._reload();
  });

  it('persiste en localStorage y se recupera', () => {
    progressStore.visit(2);
    progressStore.recordQuiz('m2', 3, 4);
    progressStore.completeExperiment('A');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.visited).toEqual([2]);
    progressStore._reload();
    const p = progressStore.get();
    expect(p.quizzes.m2).toEqual({ best: 3, last: 3, total: 4 });
    expect(isModuleDone(p, 2)).toBe(true);
    expect(moduleCompletion(p, 7)).toBeCloseTo(0.2);
  });

  it('conserva el mejor puntaje', () => {
    progressStore.recordQuiz('m1', 4, 4);
    progressStore.recordQuiz('m1', 1, 4);
    expect(progressStore.get().quizzes.m1).toEqual({ best: 4, last: 1, total: 4 });
    progressStore.recordExam(70);
    progressStore.recordExam(55);
    expect(progressStore.get().exam.best).toBe(70);
  });

  it('avance global vacío = 0 y JSON corrupto no rompe', () => {
    expect(overallCompletion(EMPTY)).toBe(0);
    localStorage.setItem(STORAGE_KEY, '{oops');
    progressStore._reload();
    expect(progressStore.get()).toEqual(EMPTY);
  });
});

describe('rutas', () => {
  it('interpreta los hashes', () => {
    expect(parseHash('')).toEqual({ name: 'home' });
    expect(parseHash('#/modulo/3')).toEqual({ name: 'module', id: 3 });
    expect(parseHash('#/laboratorio')).toEqual({ name: 'module', id: 7 });
    expect(parseHash('#/examen')).toEqual({ name: 'exam' });
    expect(parseHash('#/modulo/9')).toEqual({ name: 'home' });
  });
});
