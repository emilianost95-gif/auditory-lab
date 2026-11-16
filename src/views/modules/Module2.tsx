import { AnatomyExplorer } from '@/components/AnatomyExplorer';
import { Callout, Fade, SectionTitle } from '@/components/ui';
import { REGIONS, STRUCTURES, type RegionId } from '@/data/anatomy';

export function Module2() {
  return (
    <>
      <section>
        <SectionTitle
          eyebrow="Modelo anatómico interactivo"
          title="Explora el oído por regiones"
          lead="Corte frontal del oído derecho visto de frente. Selecciona un punto para ver dónde está cada estructura, qué hace y qué ocurre si falla. Usa las pestañas para acercarte a cada región."
        />
        <AnatomyExplorer />
      </section>

      <section className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
        {(Object.keys(REGIONS) as RegionId[]).map((r, k) => (
          <Fade key={r} delay={k * 0.06} className="bg-deep p-6 sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: REGIONS[r].color }}>
              {REGIONS[r].short}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{REGIONS[r].name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{REGIONS[r].summary}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {STRUCTURES.filter((s) => s.region === r).map((s) => (
                <li key={s.id} className="chip">
                  {s.name}
                </li>
              ))}
            </ul>
          </Fade>
        ))}
      </section>

      <section className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <SectionTitle
            eyebrow="Oído medio · física de la transmisión"
            title="Por qué los huesecillos amplifican"
            lead="El oído interno está lleno de líquido. Si la onda del aire chocara directamente con él, casi el 99,9 % de la energía se reflejaría, como cuando no oímos bien bajo el agua a alguien que habla fuera de ella."
          />
          <div className="prose-lab">
            <p>
              El oído medio resuelve este problema con dos mecanismos. El <strong>tímpano</strong> tiene un área unas <strong>17 veces mayor</strong> que la ventana oval:
              la misma fuerza concentrada en un área menor produce más presión. Además, martillo y yunque funcionan como una <strong>palanca</strong> que la multiplica unas
              1,3 veces.
            </p>
            <p>
              Resultado: la presión que llega al oído interno es <strong>≈ 20 veces mayor</strong> (unos 25–30 dB). A esto se le llama <strong>adaptación de impedancia</strong>.
            </p>
          </div>
        </div>
        <Fade>
          <AmplificationDiagram />
        </Fade>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Callout kind="info" title="De la vibración a la señal eléctrica">
          En el oído interno, el estribo mueve el líquido de la cóclea. Ese movimiento inclina los estereocilios de las células ciliadas, que abren canales iónicos y liberan
          neurotransmisores: así se generan impulsos en el nervio auditivo que viajan al cerebro. Lo verás en detalle en el módulo 03.
        </Callout>
        <Callout kind="tip" title="El oído también te mantiene en equilibrio">
          Vestíbulo y canales semicirculares comparten el líquido y el nervio (VIII par) con la cóclea, pero su información va a los centros del equilibrio, no a la
          corteza auditiva.
        </Callout>
      </section>
    </>
  );
}

function AmplificationDiagram() {
  return (
    <figure className="panel p-5 sm:p-6">
      <svg viewBox="0 0 420 240" className="w-full" role="img" aria-label="Esquema: la fuerza del tímpano grande se concentra en la ventana oval pequeña">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#22d3ee" />
          </marker>
        </defs>
        {/* tímpano */}
        <ellipse cx="70" cy="120" rx="14" ry="85" fill="#f1d5cf" fillOpacity="0.2" stroke="#f1d5cf" />
        <text x="70" y="226" textAnchor="middle" fontSize="12" fill="#93a1bb" fontFamily="var(--font-mono)">
          Tímpano ≈ 55 mm²
        </text>
        {[60, 90, 120, 150, 180].map((y) => (
          <line key={y} x1="10" y1={y} x2="52" y2={y} stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arr)" className="anim-flow" />
        ))}
        {/* palanca */}
        <path d="M84,120 L300,120" stroke="#e8dcc0" strokeWidth="5" strokeLinecap="round" />
        <path d="M150,120 l-10,22 h20 z" fill="#93a1bb" />
        <text x="150" y="160" textAnchor="middle" fontSize="11" fill="#93a1bb" fontFamily="var(--font-mono)">
          palanca ×1,3
        </text>
        {/* ventana oval */}
        <rect x="300" y="108" width="10" height="24" rx="3" fill="#e8dcc0" />
        <ellipse cx="318" cy="120" rx="5" ry="14" fill="#8b5cf6" fillOpacity="0.35" stroke="#a78bfa" />
        <rect x="324" y="40" width="90" height="160" rx="12" fill="#8b5cf6" fillOpacity="0.12" stroke="#8b5cf6" strokeOpacity="0.4" />
        <text x="369" y="125" textAnchor="middle" fontSize="12" fill="#c4b5fd" fontFamily="var(--font-mono)">
          líquido
        </text>
        <text x="318" y="226" textAnchor="middle" fontSize="12" fill="#93a1bb" fontFamily="var(--font-mono)">
          Ventana oval ≈ 3,2 mm²
        </text>
        <text x="210" y="40" textAnchor="middle" fontSize="15" fill="#f1f5fb" fontWeight="600">
          17 × 1,3 ≈ 22 veces más presión
        </text>
      </svg>
    </figure>
  );
}
