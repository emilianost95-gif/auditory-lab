import { useState } from 'react';
import { MEDIA, ampToDb, frequencyFrom, wavelength, type MediumId } from '@/lib/physics';
import { Slider, ToneButton } from './ui';
import { WaveScope } from './waves';

export const TIME_WINDOW_S = 0.01; // 10 ms
export const SPACE_WINDOW_M = 4;

export const fmtHz = (f: number) => (f >= 1000 ? `${(f / 1000).toFixed(2).replace('.', ',')} kHz` : `${Math.round(f)} Hz`);
export const fmtM = (m: number) => (m >= 1 ? `${m.toFixed(2).replace('.', ',')} m` : `${(m * 100).toFixed(1).replace('.', ',')} cm`);

export function WaveStudio() {
  const [medium, setMedium] = useState<MediumId>('aire');
  const [f, setF] = useState(440);
  const [a, setA] = useState(0.6);
  const v = MEDIA[medium].v;
  const lambda = wavelength(v, f);
  const fMin = 50;
  const fMax = 2000;

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:px-6">
        <div role="radiogroup" aria-label="Medio de propagación" className="flex gap-1 rounded-full border border-line p-1">
          {(Object.keys(MEDIA) as MediumId[]).map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={medium === m}
              onClick={() => setMedium(m)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors sm:text-sm ${medium === m ? 'bg-cyan text-void' : 'text-mute hover:text-ink'}`}
            >
              {MEDIA[m].name}
            </button>
          ))}
        </div>
        <ToneButton frequency={f} volume={a} label="Escuchar tono" />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-1 p-4 sm:p-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-dim">Presión en un punto vs tiempo · ventana de 10 ms</p>
          <WaveScope
            cycles={f * TIME_WINDOW_S}
            amp={a}
            speed={0.35}
            height={170}
            color="#22d3ee"
            showAmp
            ampLabel="A"
            xLabel="tiempo →"
            ariaLabel={`Onda de ${Math.round(f)} Hz en función del tiempo`}
          />
          <p className="pt-4 font-mono text-[11px] uppercase tracking-widest text-dim">Presión vs distancia · ventana de 4 m · {MEDIA[medium].name}</p>
          <WaveScope
            cycles={SPACE_WINDOW_M / lambda}
            amp={a}
            speed={0.35}
            height={150}
            color="#8b5cf6"
            showLambda
            lambdaLabel={`λ = ${fmtM(lambda)}`}
            xLabel="distancia →"
            ariaLabel={`Onda en el espacio con longitud de onda de ${fmtM(lambda)}`}
          />
          <p className="pt-1 text-xs text-dim">Animación ralentizada para poder observarla. El tiempo real de un ciclo es {(1000 / f).toFixed(2).replace('.', ',')} ms.</p>
        </div>

        <div className="space-y-6 border-t border-line p-5 sm:p-6 lg:border-l lg:border-t-0">
          <Slider label="Frecuencia (f)" value={f} min={fMin} max={fMax} log onChange={setF} display={fmtHz(f)} hint="Escala logarítmica" />
          <Slider label="Amplitud (A)" value={a} min={0.05} max={1} step={0.01} onChange={setA} display={`${Math.round(a * 100)} %`} />
          <Slider
            label="Longitud de onda (λ)"
            value={lambda}
            min={wavelength(v, fMax)}
            max={wavelength(v, fMin)}
            log
            onChange={(l) => setF(Math.min(fMax, Math.max(fMin, frequencyFrom(v, l))))}
            display={fmtM(lambda)}
            hint="En un mismo medio, cambiar λ obliga a cambiar f (v = λ·f)"
          />
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-sm">
            <Readout k="Frecuencia" v={fmtHz(f)} />
            <Readout k="Período T = 1/f" v={`${(1000 / f).toFixed(2).replace('.', ',')} ms`} />
            <Readout k="Velocidad v" v={`${v.toLocaleString('es')} m/s`} />
            <Readout k="λ = v / f" v={fmtM(lambda)} />
            <Readout k="Nivel relativo" v={`${ampToDb(a).toFixed(1).replace('.', ',')} dB`} />
            <Readout k="Intensidad ∝ A²" v={`${Math.round(a * a * 100)} %`} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Readout({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-deep px-3 py-2.5">
      <dt className="text-[11px] text-dim">{k}</dt>
      <dd className="mt-0.5 font-mono tabular-nums text-ink">{v}</dd>
    </div>
  );
}
