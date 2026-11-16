import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Headphones, XCircle } from 'lucide-react';
import { Callout, Fade, SectionTitle, Slider } from '@/components/ui';
import { SOUND_LEVELS, formatDuration, safeExposureMinutes } from '@/lib/physics';

function risk(db: number) {
  if (db < 70) return { label: 'Sin riesgo conocido', color: '#34d399' };
  if (db < 85) return { label: 'Bajo riesgo · molestia posible', color: '#a3e635' };
  if (db < 100) return { label: 'Riesgo con exposición prolongada', color: '#fbbf24' };
  if (db < 120) return { label: 'Riesgo alto en minutos', color: '#fb923c' };
  return { label: 'Peligro: daño posible inmediato', color: '#fb7185' };
}

const DOS = [
  'Mantén el volumen de los auriculares por debajo del 60 % y haz pausas cada hora.',
  'Usa protectores (tapones o orejeras) en conciertos, obras, talleres o deportes de motor.',
  'Aléjate de la fuente: duplicar la distancia reduce el nivel unos 6 dB al aire libre.',
  'Prefiere auriculares con cancelación de ruido: evitan subir el volumen para tapar el entorno.',
  'Consulta a un profesional si notas zumbidos, oído tapado o dificultad para seguir conversaciones.',
];
const DONTS = [
  'Introducir hisopos u objetos en el conducto: empujan el cerumen y pueden lesionar el tímpano.',
  'Dormir con auriculares a volumen alto.',
  'Ignorar un zumbido que dura más de un día después de una exposición fuerte.',
  'Automedicarse con gotas si hay dolor o secreción: puede haber una perforación.',
];

export function Module6() {
  const [db, setDb] = useState(94);
  const r = risk(db);
  const minutes = safeExposureMinutes(db);
  const nearest = SOUND_LEVELS.reduce((a, b) => (Math.abs(b.db - db) < Math.abs(a.db - db) ? b : a));

  return (
    <>
      <section>
        <SectionTitle
          eyebrow="Simulador de dosis de ruido"
          title="¿Cuánto tiempo es seguro?"
          lead="El daño auditivo depende de dos factores: el nivel sonoro y el tiempo de exposición. Según el criterio de NIOSH, 85 dB(A) es seguro hasta 8 horas diarias, y cada +3 dB el tiempo seguro se reduce a la mitad (la energía se duplica)."
        />
        <div className="panel grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <Slider label="Nivel sonoro" value={db} min={40} max={130} step={1} onChange={setDb} display={`${db} dB(A)`} />
            <div className="relative mt-6 h-56 sm:h-64" role="img" aria-label="Escala de niveles sonoros">
              <div className="absolute inset-y-0 left-16 w-3 rounded-full bg-gradient-to-t from-ok via-warn to-bad opacity-80 sm:left-20" />
              {SOUND_LEVELS.filter((l) => l.db >= 40 && l.db <= 130).map((l) => {
                const y = 100 - ((l.db - 40) / 90) * 100;
                const on = l === nearest;
                return (
                  <div key={l.db} className="absolute left-0 right-0 flex -translate-y-1/2 items-center gap-3 text-xs" style={{ top: `${y}%` }}>
                    <span className={`w-12 text-right font-mono sm:w-16 ${on ? 'text-ink' : 'text-dim'}`}>{l.db} dB</span>
                    <span className={`ml-6 truncate sm:ml-8 ${on ? 'font-medium text-ink' : 'text-mute'}`}>{l.label}</span>
                  </div>
                );
              })}
              <motion.div
                className="absolute left-[3.6rem] size-5 -translate-y-1/2 rounded-full border-2 border-white sm:left-[4.6rem]"
                style={{ background: r.color, boxShadow: `0 0 18px ${r.color}` }}
                animate={{ top: `${100 - ((db - 40) / 90) * 100}%` }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center" aria-live="polite">
            <p className="font-mono text-[11px] uppercase tracking-widest text-dim">Exposición diaria máxima recomendada</p>
            <p className="display mt-3 text-5xl tabular-nums sm:text-6xl" style={{ color: r.color }}>
              {formatDuration(minutes)}
            </p>
            <p className="mt-3 font-medium" style={{ color: r.color }}>
              {r.label}
            </p>
            <p className="mt-2 text-sm text-mute">Comparable a: {nearest.label.toLowerCase()}.</p>
            <p className="mt-6 text-xs leading-relaxed text-dim">
              Cálculo: 8 h ÷ 2<sup>(nivel − 85) / 3</sup>. Es una guía preventiva de salud laboral; la sensibilidad individual varía. Por encima de 140 dB un solo impulso puede
              causar daño inmediato.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-12 lg:grid-cols-2">
        <Fade>
          <SectionTitle eyebrow="Mecanismo del daño" title="Exposición prolongada y pérdida auditiva" />
          <div className="prose-lab">
            <p>
              Los sonidos muy intensos o prolongados sobrecargan las <strong>células ciliadas</strong>: sus estereocilios se dañan y, si el estrés se repite, las células
              mueren. En los humanos <strong>no se regeneran</strong>, por eso la pérdida auditiva inducida por ruido es <strong>permanente</strong>, aunque también es
              totalmente prevenible.
            </p>
            <p>
              Suele empezar por las frecuencias agudas (alrededor de 4 000 Hz), lo que dificulta entender consonantes como "s", "f" o "t", sobre todo con ruido de fondo. Las
              señales de alerta son el <strong>zumbido (tinnitus)</strong>, la sensación de oído tapado y tener que subir el volumen del televisor.
            </p>
          </div>
        </Fade>
        <Fade delay={0.08}>
          <h3 className="mb-4 mt-1 font-mono text-xs uppercase tracking-widest text-dim">Tipos de pérdida auditiva</h3>
          <dl className="space-y-3">
            {[
              { t: 'De conducción', d: 'El sonido no llega bien al oído interno: tapón de cerumen, otitis, perforación del tímpano, otosclerosis. Con frecuencia es tratable.', c: '#3b82f6' },
              { t: 'Neurosensorial', d: 'Daño en la cóclea (células ciliadas) o en el nervio: ruido, edad (presbiacusia), algunos fármacos. Suele ser permanente; se compensa con audífonos o implantes cocleares.', c: '#8b5cf6' },
              { t: 'Mixta', d: 'Combinación de ambas.', c: '#93a1bb' },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-line bg-deep p-4">
                <dt className="font-medium" style={{ color: x.c }}>
                  {x.t}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-mute">{x.d}</dd>
              </div>
            ))}
          </dl>
        </Fade>
      </section>

      <section className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <SectionTitle eyebrow="Entorno" title="Contaminación acústica" />
          <div className="prose-lab">
            <p>
              Es el exceso de ruido en el ambiente: tránsito, obras, aviones, locales nocturnos. Aunque no siempre alcanza niveles que dañan el oído, el ruido crónico afecta la{' '}
              <strong>salud general</strong>: altera el sueño, aumenta el estrés y se asocia con mayor riesgo cardiovascular y peor rendimiento escolar.
            </p>
            <p>
              La Organización Mundial de la Salud recomienda que el ruido del tránsito no supere unos <strong>53 dB</strong> de promedio diario y <strong>45 dB</strong> durante
              la noche.
            </p>
          </div>
        </div>
        <div className="panel p-6">
          <Headphones className="size-6 text-cyan" aria-hidden />
          <h3 className="mt-4 text-xl font-semibold">Uso responsable de auriculares</h3>
          <ul className="mt-4 space-y-3 text-sm text-mute">
            <li>
              <strong className="text-ink">Regla 60/60:</strong> no más del 60 % del volumen durante no más de 60 minutos seguidos, y luego una pausa.
            </li>
            <li>
              <strong className="text-ink">Referencia OMS:</strong> hasta 80 dB durante un máximo de 40 horas por semana en adultos (75 dB en niños).
            </li>
            <li>
              <strong className="text-ink">Prueba rápida:</strong> si alguien a un metro no puede hablarte sin gritar, o escucha tu música, el volumen es excesivo.
            </li>
            <li>
              <strong className="text-ink">Activa el límite de volumen</strong> que ofrecen la mayoría de los teléfonos.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Prevención" title="Recomendaciones prácticas" />
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="space-y-3 rounded-2xl border border-ok/25 bg-ok/[0.04] p-5">
            {DOS.map((d) => (
              <li key={d} className="flex gap-3 text-sm leading-relaxed text-mute">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
                {d}
              </li>
            ))}
          </ul>
          <ul className="space-y-3 rounded-2xl border border-bad/25 bg-bad/[0.04] p-5">
            {DONTS.map((d) => (
              <li key={d} className="flex gap-3 text-sm leading-relaxed text-mute">
                <XCircle className="mt-0.5 size-4 shrink-0 text-bad" aria-hidden />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5">
          <Callout kind="info" title="Importancia de la prevención">
            La pérdida auditiva no duele y avanza lentamente, por eso suele detectarse tarde. Un control auditivo (audiometría) con un profesional de la salud permite detectarla a
            tiempo. Ante dolor de oído, secreción, pérdida brusca de audición o vértigo, consulta de inmediato.
          </Callout>
        </div>
      </section>
    </>
  );
}
