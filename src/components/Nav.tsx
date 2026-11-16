import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, ClipboardCheck, FlaskConical, Library, Menu, X } from 'lucide-react';
import { MODULES } from '@/data/modules';
import { href, type Route } from '@/lib/router';
import { isModuleDone, overallCompletion, useProgress } from '@/lib/progress';
import { ProgressRing } from './ui';

export function Logo() {
  return (
    <a href={href.home} className="group flex items-center gap-2.5" aria-label="AUDITORY LAB — inicio">
      <svg viewBox="0 0 64 64" className="size-8" aria-hidden>
        <rect width="64" height="64" rx="16" fill="#0f1626" stroke="rgba(147,161,187,0.2)" />
        <path d="M40 46c-2 6-12 7-14 0-1-4 4-7 4-12a8 8 0 1 0-16 0" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
        <path d="M44 22c3 3 3 9 0 12M50 17c6 6 6 17 0 23" fill="none" stroke="#8b5cf6" strokeWidth="3.5" strokeLinecap="round" className="origin-left transition-transform duration-500 group-hover:scale-110" />
      </svg>
      <span className="font-mono text-[13px] font-semibold tracking-[0.22em]">
        AUDITORY<span className="text-cyan">LAB</span>
      </span>
    </a>
  );
}

type Mode = 'study' | 'lab' | 'eval' | 'glossary' | null;
const modeOf = (r: Route): Mode => {
  if (r.name === 'module') return r.id === 7 ? 'lab' : 'study';
  if (r.name === 'exam' || r.name === 'evaluations') return 'eval';
  if (r.name === 'glossary') return 'glossary';
  return null;
};

const LINKS = [
  { mode: 'study' as const, label: 'Estudio', to: '#/?modulos', Icon: BookOpen },
  { mode: 'lab' as const, label: 'Laboratorio', to: href.module(7), Icon: FlaskConical },
  { mode: 'eval' as const, label: 'Evaluación', to: href.evaluations, Icon: ClipboardCheck },
  { mode: 'glossary' as const, label: 'Glosario', to: href.glossary, Icon: Library },
];

export function Nav({ route }: { route: Route }) {
  const progress = useProgress();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mode = modeOf(route);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [route]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? 'glass border-x-0 border-t-0' : 'border-b border-transparent'}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Principal">
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ mode: m, label, to, Icon }) => (
            <li key={m}>
              <a
                href={to}
                aria-current={mode === m ? 'page' : undefined}
                className={`relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-colors ${mode === m ? 'text-ink' : 'text-mute hover:text-ink'}`}
              >
                {mode === m && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full border border-cyan/30 bg-cyan/10" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
                <Icon className="relative size-4" aria-hidden />
                <span className="relative">{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#/?progreso" className="flex items-center gap-2" aria-label={`Progreso total ${Math.round(overallCompletion(progress) * 100)} %`}>
            <ProgressRing value={overallCompletion(progress)} size={38} stroke={3.5} />
          </a>
          <button type="button" className="rounded-full p-2 text-mute hover:text-ink md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menú">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden md:hidden">
            <div className="space-y-1 px-4 pb-5">
              {LINKS.map(({ mode: m, label, to, Icon }) => (
                <a key={m} href={to} className={`flex items-center gap-3 rounded-xl px-3 py-3 ${mode === m ? 'bg-cyan/10 text-ink' : 'text-mute'}`}>
                  <Icon className="size-4" aria-hidden /> {label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-1 border-t border-line pt-3">
                {MODULES.map((m) => (
                  <a key={m.id} href={href.module(m.id)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-mute hover:text-ink">
                    <span className={`font-mono ${isModuleDone(progress, m.id) ? 'text-ok' : 'text-cyan'}`}>{m.code}</span>
                    <span className="truncate">{m.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
