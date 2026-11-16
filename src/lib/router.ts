import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'module'; id: number }
  | { name: 'exam' }
  | { name: 'glossary' }
  | { name: 'evaluations' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').split('?')[0]!.replace(/\/$/, '');
  if (!path) return { name: 'home' };
  const m = /^modulo\/(\d)$/.exec(path);
  if (m) {
    const id = Number(m[1]);
    if (id >= 1 && id <= 7) return { name: 'module', id };
  }
  if (path === 'laboratorio') return { name: 'module', id: 7 };
  if (path === 'examen') return { name: 'exam' };
  if (path === 'glosario') return { name: 'glossary' };
  if (path === 'evaluaciones') return { name: 'evaluations' };
  return { name: 'home' };
}

export const href = {
  home: '#/',
  module: (id: number) => (id === 7 ? '#/laboratorio' : `#/modulo/${id}`),
  exam: '#/examen',
  glossary: '#/glosario',
  evaluations: '#/evaluaciones',
};

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

export function useHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash, () => '');
}
