import { motion } from 'motion/react';
import { Callout, Fade, SectionTitle } from '@/components/ui';
import { WaveStudio } from '@/components/WaveStudio';
import { WaveScope } from '@/components/waves';
import { MEDIA, type MediumId } from '@/lib/physics';

const FREQ_EXAMPLES = [
  { f: '27,5 Hz', d: 'Nota más grave de un piano' },
  { f: '85–180 Hz', d: 'Fundamental de una voz masculina adulta' },
  { f: '165–255 Hz', d: 'Fundamental de una voz femenina adulta' },
  { f: '440 Hz', d: 'La 4 del diapasón de afinación' },
  { f: '2–5 kHz', d: 'Zona de máxima sensibilidad del oído' },
  { f: '4 186 Hz', d: 'Nota más aguda de un piano' },
];

const PHYS_VS_PERC = [
  { phys: 'Frecuencia (Hz)', perc: 'Tono o altura (grave / agudo)', note: 'Se mide con instrumentos.' },
  { phys: 'Amplitud / intensidad (dB)', perc: 'Sonoridad (fuerte / débil)', note: 'La sonoridad depende también de la frecuencia.' },
  { phys: 'Forma de onda / armónicos', perc: 'Timbre', note: 'Permite reconocer la fuente.' },
];

export function Module4() {
  return (
    <>
      <section>
        <SectionTitle
          eyebrow="Estudio de ondas · interactivo"
          title="Controla una onda sonora"
          lead="Modifica la frecuencia, la amplitud o la longitud de onda y observa las dos representaciones. Cambia el medio para ver cómo la velocidad modifica la longitud de onda sin cambiar la frecuencia."
        />
        <WaveStudio />
      </section>

      <section className="grid gap-12 lg:grid-cols-2">
        <Fade>
          <ConceptHead n="01" t="Frecuencia" />
          <div className="prose-lab">
            <p>
              Es el <strong>número de oscilaciones completas por segundo</strong>. Se mide en <strong>hercios (Hz)</strong>: 1 Hz = 1 oscilación por segundo. Su inversa es
              el período (T = 1/f), el tiempo que dura un ciclo.
            </p>
            <p>
              A mayor frecuencia, el sonido se percibe más <strong>agudo</strong>; a menor frecuencia, más <strong>grave</strong>.
            </p>
          </div>
          <ul className="mt-5 divide-y divide-line border-y border-line text-sm">
            {FREQ_EXAMPLES.map((e) => (
              <li key={e.f} className="flex justify-between gap-4 py-2.5">
                <span className="text-mute">{e.d}</span>
                <span className="shrink-0 font-mono text-ink">{e.f}</span>
              </li>
            ))}
          </ul>
        </Fade>
        <Fade delay={0.08}>
          <ConceptHead n="02" t="Amplitud" />
          <div className="prose-lab">
            <p>
              Representa la <strong>máxima variación de presión</strong> respecto de la presión normal del aire. Una onda de mayor amplitud transporta más energía: su{' '}
              <strong>intensidad</strong> es proporcional al cuadrado de la amplitud.
            </p>
            <p>
              La amplitud <strong>no cambia</strong> la frecuencia: puedes tener un sonido grave fuerte o un agudo suave.
            </p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MiniScope label="Misma f, A pequeña" cycles={3} amp={0.3} />
            <MiniScope label="Misma f, A grande" cycles={3} amp={0.9} />
            <MiniScope label="Misma A, f baja" cycles={2} amp={0.6} />
            <MiniScope label="Misma A, f alta" cycles={7} amp={0.6} />
          </div>
        </Fade>
        <Fade>
          <ConceptHead n="03" t="Longitud de onda" />
          <div className="prose-lab">
            <p>
              Es la <strong>distancia entre dos compresiones consecutivas</strong> (o entre dos crestas del gráfico). Se representa con λ (lambda) y se mide en metros.
            </p>
            <p>
              Se relaciona con la frecuencia y la velocidad: <strong>v = λ · f</strong>. En el aire, un La de 440 Hz tiene λ = 343 / 440 ≈ 78 cm; un sonido de 20 Hz, ¡más
              de 17 m!
            </p>
          </div>
        </Fade>
        <Fade delay={0.08}>
          <ConceptHead n="04" t="Velocidad del sonido" />
          <div className="prose-lab">
            <p>
              Es la rapidez con que la perturbación avanza por el medio. Depende de qué tan <strong>rígido</strong> es el medio y de su densidad: en general es mayor en
              sólidos que en líquidos, y en líquidos que en gases. En el aire aumenta con la temperatura (~0,6 m/s por °C).
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {(Object.keys(MEDIA) as MediumId[]).map((m, k) => (
              <div key={m}>
                <div className="flex justify-between text-sm">
                  <span className="text-mute">{MEDIA[m].name}</span>
                  <span className="font-mono">{MEDIA[m].v.toLocaleString('es')} m/s</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: ['#22d3ee', '#3b82f6', '#8b5cf6'][k] }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(MEDIA[m].v / 5960) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: k * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Fade>
      </section>

      <section>
        <SectionTitle
          eyebrow="Importante"
          title="Lo que se mide no es lo mismo que lo que se percibe"
          lead="La física describe la onda; la percepción describe la experiencia que el cerebro construye. Están relacionadas, pero no son idénticas."
        />
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-dim">
              <tr>
                <th className="px-4 py-3 font-medium">Magnitud física (objetiva)</th>
                <th className="px-4 py-3 font-medium">Percepción (subjetiva)</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {PHYS_VS_PERC.map((r) => (
                <tr key={r.phys} className="bg-deep">
                  <td className="px-4 py-3 text-cyan">{r.phys}</td>
                  <td className="px-4 py-3 text-ink">{r.perc}</td>
                  <td className="hidden px-4 py-3 text-mute sm:table-cell">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5">
          <Callout kind="info" title="Ejemplo">
            Un tono de 100 Hz y otro de 3 000 Hz con la misma intensidad física no suenan igual de fuertes: el de 3 000 Hz parece más fuerte porque el oído es más sensible en esa
            zona (curvas de igual sonoridad).
          </Callout>
        </div>
      </section>
    </>
  );
}

function ConceptHead({ n, t }: { n: string; t: string }) {
  return (
    <h3 className="mb-4 flex items-baseline gap-3 text-2xl font-semibold tracking-tight">
      <span className="font-mono text-sm text-cyan">{n}</span>
      {t}
    </h3>
  );
}

function MiniScope({ label, cycles, amp }: { label: string; cycles: number; amp: number }) {
  return (
    <figure className="rounded-xl border border-line bg-deep p-2">
      <WaveScope cycles={cycles} amp={amp} speed={0} height={64} color="#22d3ee" ariaLabel={label} />
      <figcaption className="px-1 pt-1 font-mono text-[10px] text-mute">{label}</figcaption>
    </figure>
  );
}
