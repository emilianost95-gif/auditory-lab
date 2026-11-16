import { useState } from 'react';
import { Callout, SectionTitle, Slider, ToneButton } from '@/components/ui';
import { TimbreExplorer } from '@/components/TimbreExplorer';
import { WaveScope } from '@/components/waves';
import { fmtHz } from '@/components/WaveStudio';
import { ampToDb } from '@/lib/physics';

const NOTE_NAMES = ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'];
function noteName(f: number) {
  const n = Math.round(12 * Math.log2(f / 440)) + 57; // 57 = La4 contando desde Do0
  return `${NOTE_NAMES[((n % 12) + 12) % 12]}${Math.floor(n / 12)}`;
}

export function Module5() {
  const [low, setLow] = useState(130);
  const [high, setHigh] = useState(1046);
  const [amp, setAmp] = useState(0.5);
  const win = 0.012; // 12 ms

  return (
    <>
      <section>
        <SectionTitle
          eyebrow="Cualidad 01"
          title="Tono: grave o agudo"
          lead="El tono (o altura) es la cualidad perceptiva que nos permite ordenar los sonidos de graves a agudos. Depende principalmente de la frecuencia."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: 'Sonido grave', f: low, set: setLow, min: 60, max: 400, color: '#3b82f6' },
            { label: 'Sonido agudo', f: high, set: setHigh, min: 500, max: 3000, color: '#22d3ee' },
          ].map((s) => (
            <div key={s.label} className="panel p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-dim">{s.label}</p>
                  <p className="mt-1 font-mono text-2xl tabular-nums">
                    {fmtHz(s.f)} <span className="text-sm text-mute">≈ {noteName(s.f)}</span>
                  </p>
                </div>
                <ToneButton frequency={s.f} volume={0.5} />
              </div>
              <div className="mt-3">
                <WaveScope cycles={s.f * win} amp={0.7} speed={0.3} height={110} color={s.color} ariaLabel={`${s.label} de ${Math.round(s.f)} Hz`} />
              </div>
              <Slider label="Frecuencia" value={s.f} min={s.min} max={s.max} log onChange={s.set} display={fmtHz(s.f)} />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-mute">
          Ambos gráficos muestran 12 ms. El agudo completa unas <strong className="text-ink">{(high / low).toFixed(1).replace('.', ',')} veces más ciclos</strong> que el grave en el mismo tiempo. Cada vez que la
          frecuencia se duplica, percibimos la misma nota una octava más arriba.
        </p>
      </section>

      <section>
        <SectionTitle
          eyebrow="Cualidad 02"
          title="Timbre: la identidad de cada fuente"
          lead="Una flauta y un violín pueden tocar la misma nota con la misma intensidad, y aun así los distinguimos. Cada fuente produce, además de la frecuencia fundamental, un conjunto propio de armónicos que da a la onda una forma característica."
        />
        <TimbreExplorer compare />
        <p className="mt-3 text-xs text-dim">
          Los instrumentos son modelos sintéticos simplificados. Los timbres reales también dependen de cómo comienza y se apaga el sonido (ataque y decaimiento).
        </p>
      </section>

      <section>
        <SectionTitle
          eyebrow="Cualidad 03"
          title="Intensidad: fuerte o débil"
          lead="La intensidad está relacionada con la amplitud de la onda: cuanto mayor es la variación de presión, más energía transporta y más fuerte la percibimos. Se expresa en decibeles (dB)."
        />
        <div className="panel grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <WaveScope cycles={440 * 0.01} amp={amp} ghost={{ cycles: 4.4, amp: 0.5, color: 'rgba(147,161,187,0.45)', dash: [4, 4], width: 1.5 }} speed={0.3} height={170} color="#fbbf24" showAmp ampLabel="A" ariaLabel="Onda de 440 Hz con amplitud ajustable" />
            <p className="mt-2 text-xs text-dim">Línea punteada: referencia al 50 %. La frecuencia no cambia: el tono es el mismo.</p>
          </div>
          <div className="space-y-5">
            <Slider label="Amplitud" value={amp} min={0.05} max={1} step={0.01} onChange={setAmp} display={`${Math.round(amp * 100)} %`} />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-line p-3">
                <dt className="text-[11px] text-dim">Respecto a la referencia</dt>
                <dd className="mt-1 font-mono text-lg">
                  {ampToDb(amp, 0.5) >= 0 ? '+' : ''}
                  {ampToDb(amp, 0.5).toFixed(1).replace('.', ',')} dB
                </dd>
              </div>
              <div className="rounded-xl border border-line p-3">
                <dt className="text-[11px] text-dim">Intensidad relativa</dt>
                <dd className="mt-1 font-mono text-lg">×{((amp / 0.5) ** 2).toFixed(2).replace('.', ',')}</dd>
              </div>
            </dl>
            <ToneButton frequency={440} volume={amp} label="Escuchar a esta intensidad" />
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Callout kind="info" title="Amplitud ≠ sonoridad">
            Duplicar la amplitud equivale a +6 dB y cuadruplica la intensidad, pero no percibimos el sonido "4 veces más fuerte": la percepción crece de forma logarítmica, y
            se necesitan unos +10 dB para sentirlo aproximadamente el doble de fuerte.
          </Callout>
          <Callout kind="warn" title="Cuidado con el volumen">
            Este laboratorio limita el volumen máximo del navegador. Aun así, usa auriculares a volumen moderado.
          </Callout>
        </div>
      </section>
    </>
  );
}
