import { useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Nav } from './components/Nav';
import { parseHash, useHash } from './lib/router';
import { Dashboard } from './views/Dashboard';
import { ModulePage } from './views/ModulePage';
import { ExamView } from './views/ExamView';
import { GlossaryView } from './views/GlossaryView';
import { EvaluationsView } from './views/EvaluationsView';

export function App() {
  const hash = useHash();
  const route = parseHash(hash);
  const routeKey = route.name === 'module' ? `m${route.id}` : route.name;
  const query = hash.split('?')[1] ?? '';

  // Desplazamiento al cambiar de vista o a un ancla (?modulos, ?eval…)
  useEffect(() => {
    const target = query ? document.getElementById(query) : null;
    if (target) {
      const t = setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
  }, [routeKey, query]);

  useEffect(() => {
    const titles: Record<string, string> = { exam: 'Examen final', glossary: 'Glosario', evaluations: 'Evaluación' };
    document.title = `${route.name === 'module' ? `Módulo ${route.id}` : (titles[route.name] ?? 'El oído humano')} · AUDITORY LAB`;
  }, [route]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-lab min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-cyan focus:px-3 focus:py-2 focus:text-void">
          Saltar al contenido
        </a>
        <Nav route={route} />
        <AnimatePresence mode="wait">
          <motion.main
            id="main"
            key={routeKey}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {route.name === 'home' && <Dashboard />}
            {route.name === 'module' && <ModulePage id={route.id} />}
            {route.name === 'exam' && <ExamView />}
            {route.name === 'glossary' && <GlossaryView />}
            {route.name === 'evaluations' && <EvaluationsView />}
          </motion.main>
        </AnimatePresence>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-dim sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="font-mono tracking-widest">AUDITORY LAB · 2026</span>
            <span>Material educativo. No reemplaza la consulta con profesionales de la salud auditiva.</span>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
