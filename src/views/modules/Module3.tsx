import { Callout, SectionTitle } from '@/components/ui';
import { HairCells, SoundJourney } from '@/components/SoundJourney';

const SEGMENTS = [
  { where: 'Fuente → pabellón → conducto', what: 'Onda de presión en el aire', c: '#22d3ee' },
  { where: 'Tímpano → martillo → yunque → estribo', what: 'Vibración mecánica de sólidos (amplificada)', c: '#e8dcc0' },
  { where: 'Ventana oval → cóclea', what: 'Ondas en un líquido y en la membrana basilar', c: '#8b5cf6' },
  { where: 'Células ciliadas → nervio auditivo', what: 'Señal electroquímica (impulsos nerviosos)', c: '#fbbf24' },
  { where: 'Tronco encefálico → corteza auditiva', what: 'Procesamiento e interpretación', c: '#f472b6' },
];

export function Module3() {
  return (
    <>
      <section>
        <SectionTitle
          eyebrow="Simulación paso a paso"
          title="De la fuente al cerebro"
          lead="Avanza y retrocede por las diez etapas. Observa cómo cambia la forma de la señal en la barra inferior: la información se conserva, pero su soporte físico cambia."
        />
        <SoundJourney />
      </section>

      <section className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <SectionTitle eyebrow="Mapa del recorrido" title="Qué viaja en cada tramo" />
          <ol className="divide-y divide-line border-y border-line">
            {SEGMENTS.map((s, k) => (
              <li key={s.where} className="grid gap-1 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4">
                <span className="font-mono text-sm" style={{ color: s.c }}>
                  {k + 1}
                </span>
                <span className="font-medium">{s.where}</span>
                <span className="text-sm text-mute">{s.what}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-5">
          <figure className="panel p-5">
            <HairCells />
            <figcaption className="mt-3 text-sm leading-relaxed text-mute">
              <strong className="text-ink">Transducción.</strong> Cuando la membrana basilar se mueve, los estereocilios se inclinan contra la membrana tectoria. Se abren
              canales iónicos, la célula se despolariza y libera neurotransmisores que activan las fibras del nervio auditivo.
            </figcaption>
          </figure>
          <Callout kind="tip" title="Tonotopía: un piano enrollado">
            La base de la cóclea (cerca de la ventana oval) es rígida y estrecha: vibra con los agudos. El vértice es ancho y flexible: vibra con los graves. Así el cerebro
            sabe qué frecuencias contiene un sonido según qué fibras se activan.
          </Callout>
        </div>
      </section>

      <Callout kind="warn" title="No confundir oído y cerebro">
        El oído no "entiende" nada: recibe la onda y la transforma en señales. El reconocimiento de una voz, una palabra o una canción ocurre en el cerebro. Por eso una lesión
        cerebral puede impedir reconocer sonidos aunque el oído funcione perfectamente.
      </Callout>
    </>
  );
}
