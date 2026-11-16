import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, FlaskConical, XCircle } from 'lucide-react';
import { SectionTitle, Slider, ToneButton } from '@/components/ui';
import { SoundJourney } from '@/components/SoundJourney';
import { TimbreExplorer } from '@/components/TimbreExplorer';
import { WaveScope } from '@/components/waves';
import { SPACE_WINDOW_M, TIME_WINDOW_S, fmtHz, fmtM } from '@/components/WaveStudio';
import { LAB_EXPERIMENTS, progressStore, useProgress } from '@/lib/progress';

interface Check {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export function Module7() {
  const p = useProgress();
  const done = LAB_EXPERIMENTS.filter((e) => p.lab[e]).length;
  return (
    <>
      <section>
        <SectionTitle
          eyebrow="Modo laboratorio"
          title="Cinco experimentos guiados"
          lead="Cada experimento tiene un objetivo, un procedimiento y una pregunta de observación. Responde correctamente para registrarlo como completado. Los sonidos solo se reproducen cuando presionas «Escuchar»."
        />
        <div className="flex flex-wrap items-center gap-2">
          {LAB_EXPERIMENTS.map((e) => (
            <a key={e} href={`#/laboratorio?exp-${e}`} className={`chip ${p.lab[e] ? 'border-ok/50 text-ok' : ''}`}>
              {p.lab[e] ? <CheckCircle2 className="size-3" aria-hidden /> : <FlaskConical className="size-3" aria-hidden />} Experimento {e}
            </a>
          ))}
          <span className="ml-auto font-mono text-sm text-mute">{done}/5 completados</span>
        </div>
      </section>
      <ExpA />
      <ExpB />
      <ExpC />
      <ExpD />
      <ExpE />
    </>
  );
}

function Experiment({
  id,
  title,
  goal,
  steps,
  check,
  children,
}: {
  id: (typeof LAB_EXPERIMENTS)[number];
  title: string;
  goal: string;
  steps: string[];
  check: Check;
  children: ReactNode;
}) {
  const p = useProgress();
  const [sel, setSel] = useState<number | null>(null);
  const answered = sel !== null;
  const ok = sel === check.answer;
  return (
    <section id={`exp-${id}`} className="scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-start gap-x-6 gap-y-3">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-cyan/30 bg-cyan/[0.06] font-mono text-2xl text-cyan">{id}</span>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Experimento {id}</p>
          <h2 className="display mt-2 text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-mute">
            <strong className="text-ink">Objetivo:</strong> {goal}
          </p>
        </div>
        {p.lab[id] && (
          <span className="chip border-ok/50 text-ok">
            <CheckCircle2 className="size-3" aria-hidden /> Completado
          </span>
        )}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">{children}</div>
        <aside className="space-y-5">
          <div className="rounded-2xl border border-line p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-dim">Procedimiento</p>
            <ol className="mt-3 space-y-2 text-sm text-mute">
              {steps.map((s, k) => (
                <li key={k} className="flex gap-2.5">
                  <span className="font-mono text-cyan">{k + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-line bg-deep p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-dim">Observación</p>
            <p className="mt-2 text-sm font-medium">{check.prompt}</p>
            <div className="mt-3 grid gap-1.5" role="radiogroup">
              {check.options.map((o, k) => {
                const state = answered ? (k === check.answer ? 'ok' : k === sel ? 'bad' : '') : '';
                return (
                  <button
                    key={o}
                    role="radio"
                    aria-checked={sel === k}
                    onClick={() => {
                      if (answered && ok) return;
                      setSel(k);
                      if (k === check.answer) progressStore.completeExperiment(id);
                    }}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      state === 'ok' ? 'border-ok/60 bg-ok/10 text-ink' : state === 'bad' ? 'border-bad/60 bg-bad/10 text-ink' : 'border-line text-mute hover:border-cyan/40 hover:text-ink'
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {answered && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex gap-2 text-sm text-mute" aria-live="polite">
                {ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ok" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-bad" />}
                <span>{ok ? check.explanation : 'Vuelve a observar la simulación e intenta otra opción.'}</span>
              </motion.p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ExpA() {
  const [f, setF] = useState(200);
  return (
    <Experiment
      id="A"
      title="Modificar la frecuencia"
      goal="Observar cómo cambia la onda cuando aumenta o disminuye la frecuencia."
      steps={['Ubica la frecuencia en 100 Hz y cuenta los ciclos en la ventana.', 'Súbela a 1 000 Hz y vuelve a contar.', 'Opcional: escucha ambos tonos y compara.']}
      check={{
        prompt: 'Al aumentar la frecuencia, en la misma ventana de tiempo…',
        options: ['Aparecen más ciclos, más juntos', 'La onda se hace más alta', 'La onda se hace más baja', 'No cambia nada'],
        answer: 0,
        explanation: 'Más oscilaciones por segundo → más ciclos en el mismo intervalo y período más corto. La altura (amplitud) no cambia.',
      }}
    >
      <div className="panel p-5">
        <WaveScope cycles={f * TIME_WINDOW_S} amp={0.7} speed={0.35} height={200} color="#22d3ee" xLabel="tiempo (10 ms) →" ariaLabel={`Onda de ${Math.round(f)} Hz`} />
        <div className="mt-4 grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Slider label="Frecuencia" value={f} min={50} max={2000} log onChange={setF} display={fmtHz(f)} hint={`Ciclos visibles: ${(f * TIME_WINDOW_S).toFixed(1).replace('.', ',')} · Período: ${(1000 / f).toFixed(2).replace('.', ',')} ms`} />
          <ToneButton frequency={f} volume={0.5} />
        </div>
      </div>
    </Experiment>
  );
}

function ExpB() {
  const [a, setA] = useState(0.3);
  return (
    <Experiment
      id="B"
      title="Modificar la amplitud"
      goal="Observar qué cambia en la onda cuando varía la amplitud, manteniendo fija la frecuencia (440 Hz)."
      steps={['Ubica la amplitud en 20 % y observa la altura de las crestas.', 'Súbela a 100 %.', 'Fíjate si cambia la cantidad de ciclos.']}
      check={{
        prompt: 'Al aumentar la amplitud…',
        options: ['Aumenta la cantidad de ciclos', 'Aumenta la altura de la onda; los ciclos no cambian', 'La onda se vuelve más aguda', 'Cambia la velocidad del sonido'],
        answer: 1,
        explanation: 'La amplitud es la magnitud de la variación de presión: crestas más altas y valles más profundos, misma frecuencia. Se percibe más fuerte, no más agudo.',
      }}
    >
      <div className="panel p-5">
        <WaveScope cycles={4.4} amp={a} speed={0.35} height={200} color="#fbbf24" showAmp ampLabel="A" xLabel="tiempo (10 ms) →" ariaLabel="Onda de 440 Hz con amplitud variable" />
        <div className="mt-4 grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Slider label="Amplitud" value={a} min={0.05} max={1} step={0.01} onChange={setA} display={`${Math.round(a * 100)} %`} hint="Frecuencia fija: 440 Hz" />
          <ToneButton frequency={440} volume={a} />
        </div>
      </div>
    </Experiment>
  );
}

function ExpC() {
  const [lo, setLo] = useState(100);
  const [hi, setHi] = useState(1000);
  const v = 343;
  return (
    <Experiment
      id="C"
      title="Baja frecuencia vs alta frecuencia"
      goal="Comparar en la misma escala una onda grave y una aguda, en el tiempo y en el espacio."
      steps={['Observa ambas ondas en la ventana de 4 m (aire).', 'Compara sus longitudes de onda.', 'Cambia las frecuencias y comprueba que v = λ·f.']}
      check={{
        prompt: 'Si un sonido tiene 10 veces más frecuencia que otro, en el aire su longitud de onda es…',
        options: ['10 veces mayor', 'Igual', '10 veces menor', '100 veces menor'],
        answer: 2,
        explanation: 'En un mismo medio la velocidad es constante: λ = v/f. Si f se multiplica por 10, λ se divide por 10.',
      }}
    >
      <div className="panel space-y-5 p-5">
        {[
          { label: 'Baja frecuencia', f: lo, set: setLo, min: 50, max: 300, color: '#3b82f6' },
          { label: 'Alta frecuencia', f: hi, set: setHi, min: 500, max: 2000, color: '#22d3ee' },
        ].map((w) => (
          <div key={w.label}>
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: w.color }}>
                {w.label}
              </span>
              <span className="font-mono text-xs text-mute">
                {fmtHz(w.f)} · λ = {fmtM(v / w.f)}
              </span>
            </div>
            <WaveScope cycles={SPACE_WINDOW_M / (v / w.f)} amp={0.7} speed={0.3} height={110} color={w.color} showLambda lambdaLabel="λ" ariaLabel={`${w.label}: ${Math.round(w.f)} Hz`} />
            <div className="mt-2 grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Slider label="Frecuencia" value={w.f} min={w.min} max={w.max} log onChange={w.set} display={fmtHz(w.f)} />
              <ToneButton frequency={w.f} volume={0.5} />
            </div>
          </div>
        ))}
        <p className="rounded-xl border border-line bg-deep px-4 py-3 font-mono text-sm text-mute">
          Relación: f<sub>alta</sub> / f<sub>baja</sub> = {(hi / lo).toFixed(1).replace('.', ',')} → λ<sub>baja</sub> / λ<sub>alta</sub> = {(hi / lo).toFixed(1).replace('.', ',')}
        </p>
      </div>
    </Experiment>
  );
}

function ExpD() {
  return (
    <Experiment
      id="D"
      title="Simular el recorrido del sonido"
      goal="Seguir la transformación de la señal desde la fuente hasta el cerebro."
      steps={['Recorre las 10 etapas con «Siguiente» o con «Auto».', 'Observa la barra de forma de la energía.', 'Identifica dónde deja de ser una vibración mecánica.']}
      check={{
        prompt: '¿En qué punto la señal deja de ser mecánica y pasa a ser electroquímica?',
        options: ['En el tímpano', 'En los huesecillos', 'En las células ciliadas de la cóclea', 'En la corteza auditiva'],
        answer: 2,
        explanation: 'Las células ciliadas realizan la transducción: transforman el movimiento del líquido coclear en señales eléctricas que viajan por el nervio auditivo.',
      }}
    >
      <SoundJourney compact />
    </Experiment>
  );
}

function ExpE() {
  return (
    <Experiment
      id="E"
      title="Comparar timbres"
      goal="Comparar visualmente las ondas de distintas fuentes que producen la misma nota con la misma amplitud."
      steps={['Elige dos fuentes diferentes (A y B).', 'Observa la superposición y los espectros.', 'Escucha cada una y compara.']}
      check={{
        prompt: 'Las ondas tienen el mismo período y la misma amplitud, pero distinta forma. ¿Qué cualidad cambia?',
        options: ['El tono', 'La intensidad', 'El timbre', 'La velocidad de propagación'],
        answer: 2,
        explanation: 'Mismo período → mismo tono. Misma amplitud → intensidad similar. La forma (contenido armónico) define el timbre.',
      }}
    >
      <TimbreExplorer compare />
    </Experiment>
  );
}
