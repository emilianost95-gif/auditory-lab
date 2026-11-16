import { useSyncExternalStore } from 'react';

export const STORAGE_KEY = 'auditory-lab:progress:v1';

export interface QuizRecord {
  best: number;
  last: number;
  total: number;
}

export interface ProgressState {
  visited: number[];
  quizzes: Record<string, QuizRecord>;
  lab: Record<string, boolean>;
  explored: string[];
  journeyMax: number;
  exam: { best: number | null; attempts: { at: string; score: number }[] };
}

export const EMPTY: ProgressState = {
  visited: [],
  quizzes: {},
  lab: {},
  explored: [],
  journeyMax: 0,
  exam: { best: null, attempts: [] },
};

export const LAB_EXPERIMENTS = ['A', 'B', 'C', 'D', 'E'] as const;

function read(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      ...EMPTY,
      ...parsed,
      exam: { ...EMPTY.exam, ...(parsed.exam ?? {}) },
    };
  } catch {
    return EMPTY;
  }
}

let state: ProgressState = typeof window === 'undefined' ? EMPTY : read();
const listeners = new Set<() => void>();

function commit(next: ProgressState) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* almacenamiento no disponible: el progreso vive solo en memoria */
  }
  listeners.forEach((l) => l());
}

export const progressStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  visit(moduleId: number) {
    if (state.visited.includes(moduleId)) return;
    commit({ ...state, visited: [...state.visited, moduleId] });
  },
  recordQuiz(key: string, correct: number, total: number) {
    const prev = state.quizzes[key];
    commit({
      ...state,
      quizzes: { ...state.quizzes, [key]: { best: Math.max(prev?.best ?? 0, correct), last: correct, total } },
    });
  },
  completeExperiment(id: string) {
    if (state.lab[id]) return;
    commit({ ...state, lab: { ...state.lab, [id]: true } });
  },
  explore(structureId: string) {
    if (state.explored.includes(structureId)) return;
    commit({ ...state, explored: [...state.explored, structureId] });
  },
  journey(step: number) {
    if (step <= state.journeyMax) return;
    commit({ ...state, journeyMax: step });
  },
  recordExam(score: number) {
    commit({
      ...state,
      exam: {
        best: Math.max(state.exam.best ?? 0, score),
        attempts: [...state.exam.attempts, { at: new Date().toISOString(), score }].slice(-10),
      },
    });
  },
  reset() {
    commit(EMPTY);
  },
  /** Solo para tests. */
  _reload() {
    state = read();
  },
};

export function useProgress(): ProgressState {
  return useSyncExternalStore(progressStore.subscribe, progressStore.get, () => EMPTY);
}

/** Avance (0–1) de un módulo. */
export function moduleCompletion(p: ProgressState, id: number): number {
  if (id === 7) return LAB_EXPERIMENTS.filter((e) => p.lab[e]).length / LAB_EXPERIMENTS.length;
  const visited = p.visited.includes(id) ? 0.25 : 0;
  const q = p.quizzes[`m${id}`];
  const quiz = q ? (q.best / q.total) * 0.75 : 0;
  return Math.min(1, visited + quiz);
}

export const isModuleDone = (p: ProgressState, id: number) => {
  if (id === 7) return moduleCompletion(p, 7) === 1;
  const q = p.quizzes[`m${id}`];
  return p.visited.includes(id) && !!q && q.best / q.total >= 0.75;
};

/** Avance global: 7 módulos + examen final. */
export function overallCompletion(p: ProgressState): number {
  let sum = 0;
  for (let i = 1; i <= 7; i++) sum += moduleCompletion(p, i);
  sum += (p.exam.best ?? 0) / 100;
  return sum / 8;
}
