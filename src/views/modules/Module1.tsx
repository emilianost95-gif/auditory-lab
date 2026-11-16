import { useState } from 'react';
import { ArrowRight, Brain, Compass, Ear, MessageCircle, Music, ShieldAlert } from 'lucide-react';
import { Callout, Fade, SectionTitle, Slider } from '@/components/ui';
import { ParticleWave, WaveScope } from '@/components/waves';

const USES = [
  { Icon: MessageCircle, t: 'Comunicarnos', d: 'Entender el lenguaje hablado y aprender a hablar.' },
  { Icon: ShieldAlert, t: 'Alertarnos', d: 'Detectar peligros que no vemos: una bocina, una alarma.' },
  { Icon: Compass, t: 'Orientarnos', d: 'Localizar de dónde viene un sonido comparando lo que llega a cada oído.' },
  { Icon: Music, t: 'Disfrutar', d: 'Percibir música, voces conocidas y el ambiente.' },
];

const CHAIN = [
  { k: 'Estímulo', d: 'Una onda sonora llega desde el ambiente.', who: 'Ambiente', c: '#22d3ee' },
  { k: 'Recepción y transformación', d: 'El oído capta la onda y la convierte en impulsos nerviosos.', who: 'Oído', c: '#3b82f6' },
  { k: 'Conducción', d: 'El nervio auditivo lleva los impulsos al encéfalo.', who: 'Nervio', c: '#fbbf24' },
  { k: 'Interpretación', d: 'La corteza auditiva reconoce qué es, dónde está y qué significa.', who: 'Cerebro', c: '#f472b6' },
];

const DISTINCTIONS = [
  { t: 'Vibración mecánica', d: 'Movimiento de ida y vuelta de un objeto: la cuerda, el tímpano, los huesecillos.' },
  { t: 'Onda sonora', d: 'Perturbación de presión que se propaga por un medio (aire, agua, sólido).' },
  { t: 'Transmisión de energía', d: 'Lo que viaja de un lugar a otro es energía; las partículas solo oscilan en su sitio.' },
  { t: 'Conversión en señal nerviosa', d: 'En la cóclea, las células ciliadas transforman el movimiento en señales eléctricas.' },
  { t: 'Interpretación cerebral', d: 'El cerebro da sentido a esas señales: reconoce una voz, una palabra o una melodía.' },
];

export function Module1() {
  const [amp, setAmp] = useState(0.7);
  const [cycles, setCycles] = useState(3);

  return (
    <>
      <section className="grid gap-12 lg:grid-cols-2">
        <Fade>
          <SectionTitle eyebrow="Definiciones" title="Oído y audición no son lo mismo" />
          <div className="prose-lab">
            <p>
              El <strong>oído</strong> es el órgano sensorial que <strong>recibe</strong> las ondas sonoras y las <strong>transforma</strong> en impulsos nerviosos. Se
              ubica dentro del hueso temporal, a cada lado de la cabeza, y además contiene los receptores del equilibrio.
            </p>
            <p>
              La <strong>audición</strong> es el proceso completo de percibir sonidos: empieza en el oído, continúa por el nervio auditivo y termina en el{' '}
              <strong>cerebro</strong>, que interpreta la información. Por eso decimos que oímos con los oídos, pero escuchamos con el cerebro.
            </p>
          </div>
        </Fade>
        <Fade delay={0.1}>
          <h3 className="mb-5 mt-1 font-mono text-xs uppercase tracking-widest text-dim">¿Para qué sirve el sistema auditivo?</h3>
          <ul className="divide-y divide-line border-y border-line">
            {USES.map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-4 py-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden />
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="mt-0.5 text-sm text-mute">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Fade>
      </section>

      <section>
        <SectionTitle
          eyebrow="Animación · onda longitudinal"
          title="Cómo una onda sonora llega al oído"
          lead="Cada punto es una porción de aire. La fuente vibra y empuja a las partículas vecinas: se forman compresiones (zonas brillantes, más presión) y rarefacciones (zonas tenues, menos presión) que avanzan hacia el oído."
        />
        <div className="panel overflow-hidden">
          <div className="relative flex items-stretch">
            <SpeakerIcon />
            <div className="min-w-0 flex-1 py-4">
              <ParticleWave cycles={cycles} amp={amp} speed={0.55} height={170} tracer ariaLabel="Partículas de aire formando compresiones y rarefacciones que se desplazan hacia el oído" />
            </div>
            <EarIcon />
          </div>
          <div className="border-t border-line px-4 pb-2 pt-4 sm:px-6">
            <WaveScope cycles={cycles} amp={amp} speed={0.55} height={120} color="#22d3ee" yLabel="presión" xLabel="distancia →" ariaLabel="Gráfico de presión del aire a lo largo de la distancia" />
          </div>
          <div className="grid gap-5 border-t border-line p-5 sm:grid-cols-2 sm:p-6">
            <Slider label="Intensidad de la vibración (amplitud)" value={amp} min={0.1} max={1} step={0.05} onChange={setAmp} display={`${Math.round(amp * 100)} %`} />
            <Slider label="Compresiones visibles (frecuencia relativa)" value={cycles} min={1} max={8} step={0.5} onChange={setCycles} display={`${cycles}`} />
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Callout kind="tip" title="Observa la partícula amarilla">
            Oscila hacia adelante y hacia atrás, pero <strong className="text-ink">no viaja hasta el oído</strong>. Lo que avanza es la perturbación: la energía.
          </Callout>
          <Callout kind="info" title="El gráfico de abajo">
            Muestra la misma onda como variación de presión. Las crestas coinciden con las compresiones y los valles con las rarefacciones.
          </Callout>
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="Percepción"
          title="Cómo percibimos los sonidos"
          lead="Percibir un sonido requiere cuatro eslabones. Si cualquiera falla, la percepción se altera."
        />
        <ol className="grid gap-3 md:grid-cols-4">
          {CHAIN.map((c, k) => (
            <Fade key={c.k} delay={k * 0.08} className="relative">
              <li className="h-full rounded-2xl border border-line bg-deep p-5">
                <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: c.c }}>
                  {String(k + 1).padStart(2, '0')} · {c.who}
                </span>
                <p className="mt-3 font-medium">{c.k}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-mute">{c.d}</p>
                {k < CHAIN.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden size-5 -translate-y-1/2 text-dim md:block" aria-hidden />}
              </li>
            </Fade>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-line p-4 text-sm text-mute">
          <Ear className="size-5 text-electric" aria-hidden /> El oído <strong className="text-ink">recibe y transforma</strong>.
          <span className="text-dim">|</span>
          <Brain className="size-5 text-[#f472b6]" aria-hidden /> El cerebro <strong className="text-ink">procesa e interpreta</strong>.
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Precisión científica" title="Sonido, vibración y audición: cinco ideas distintas" />
        <dl className="divide-y divide-line border-y border-line">
          {DISTINCTIONS.map((d, k) => (
            <div key={d.t} className="grid gap-1 py-4 sm:grid-cols-[3rem_16rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-sm text-dim">{String(k + 1).padStart(2, '0')}</span>
              <dt className="font-medium">{d.t}</dt>
              <dd className="text-sm leading-relaxed text-mute">{d.d}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5">
          <Callout kind="info" title="Rango audible">
            Un humano joven percibe aproximadamente entre <strong className="text-ink">20 Hz y 20 000 Hz</strong>. Por debajo están los infrasonidos (los detectan los
            elefantes) y por encima, los ultrasonidos (los usan murciélagos y ecógrafos). El límite superior disminuye con la edad.
          </Callout>
        </div>
      </section>
    </>
  );
}

function SpeakerIcon() {
  return (
    <div className="flex w-14 shrink-0 items-center justify-center border-r border-line sm:w-20" aria-hidden>
      <svg viewBox="0 0 40 60" className="w-8 sm:w-10">
        <rect x="2" y="20" width="12" height="20" rx="2" fill="#1e293b" stroke="#64748b" />
        <path d="M14 22 L30 8 L30 52 L14 38 Z" fill="#334155" stroke="#94a3b8" className="svg-anim anim-piston" />
      </svg>
    </div>
  );
}

function EarIcon() {
  return (
    <div className="flex w-14 shrink-0 items-center justify-center border-l border-line sm:w-20" aria-hidden>
      <svg viewBox="0 0 40 60" className="w-8 sm:w-10">
        <path d="M30 50c-2 6-12 7-14 0-1-4 4-8 4-14a10 10 0 1 0-20 0" transform="translate(6 -4)" fill="none" stroke="#e7a3a0" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
