import type { StructureId } from './anatomy';

export type TopicId = 'intro' | 'anatomia' | 'recorrido' | 'fisica' | 'caracteristicas' | 'salud';

export type WaveShape = 'sine' | 'square' | 'saw' | 'rich';

export interface WaveFigureSpec {
  label: string;
  /** Ciclos visibles en el panel. */
  cycles: number;
  /** Amplitud relativa 0–1. */
  amp: number;
  shape?: WaveShape;
}

interface QBase {
  id: string;
  topic: TopicId;
  prompt: string;
  /** Explicación que se muestra después de responder. */
  explanation: string;
}

export interface McqQuestion extends QBase {
  type: 'mcq';
  options: string[];
  answer: number;
  figure?: WaveFigureSpec[];
}

export interface TfQuestion extends QBase {
  type: 'tf';
  answer: boolean;
}

export interface IdentifyQuestion extends QBase {
  type: 'identify';
  /** click: el estudiante señala en el modelo; choose: se resalta y elige el nombre. */
  mode: 'click' | 'choose';
  answer: StructureId;
  options?: StructureId[];
}

export interface MatchQuestion extends QBase {
  type: 'match';
  pairs: { left: string; right: string }[];
}

export type Question = McqQuestion | TfQuestion | IdentifyQuestion | MatchQuestion;

/** Respuesta del estudiante: índice (mcq), booleano (tf), estructura (identify) o índices elegidos por fila (match). */
export type AnswerValue = number | boolean | StructureId | (number | null)[];
