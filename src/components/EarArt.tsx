import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { REGIONS, STRUCTURES, STRUCTURE_BY_ID, type StructureId } from '@/data/anatomy';
import { prefersReducedMotion } from '@/lib/hooks';

export type Fx = 'source' | 'waves' | 'canal' | 'drum' | 'ossicles' | 'fluid' | 'hair' | 'nerve' | 'brain';
type View = [number, number, number, number];

interface Props {
  view: View;
  highlight?: StructureId[];
  /** Atenúa lo que no está resaltado. */
  dim?: boolean;
  selected?: StructureId | null;
  onSelect?: (id: StructureId) => void;
  hotspots?: boolean;
  /** Oculta nombres (modo evaluación). */
  anonymous?: boolean;
  labels?: StructureId[];
  fx?: Fx[];
  showSource?: boolean;
  showBrain?: boolean;
  /** Marca de respuesta correcta/incorrecta en modo evaluación. */
  mark?: { id: StructureId; ok: boolean } | null;
  className?: string;
  title?: string;
  children?: ReactNode;
}

const FULL_W = 790;

/** Posición de cada etiqueta (unidades del dibujo) y alineación, para evitar superposiciones. */
const LABEL_POS: Record<StructureId, [number, number, 'start' | 'middle' | 'end']> = {
  pabellon: [214, 176, 'middle'],
  conducto: [420, 236, 'middle'],
  timpano: [548, 308, 'middle'],
  martillo: [560, 177, 'end'],
  yunque: [602, 177, 'start'],
  estribo: [628, 280, 'middle'],
  trompa: [642, 377, 'start'],
  coclea: [742, 384, 'middle'],
  vestibulo: [700, 250, 'start'],
  canales: [684, 106, 'middle'],
  nervio: [826, 292, 'middle'],
};

/* ------------------------------------------------------------------ */
/* Geometría                                                           */
/* ------------------------------------------------------------------ */

function spiralPath(cx: number, cy: number, r0: number, r1: number, turns: number, start: number): string {
  const total = turns * Math.PI * 2;
  const steps = Math.round(turns * 48);
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const th = start + t * total;
    const r = r0 + (r1 - r0) * t;
    const x = cx + r * Math.cos(th);
    const y = cy + r * Math.sin(th);
    d += `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

const COCHLEA = spiralPath(742, 312, 52, 7, 2.5, (200 * Math.PI) / 180);

const PATHS = {
  pinna:
    'M302,112 C262,80 200,98 192,165 C186,215 214,240 210,290 C206,340 220,402 262,420 C290,432 306,412 302,392 C300,330 298,180 302,112 Z',
  helix: 'M292,126 C254,108 214,128 208,176 C204,216 228,242 226,288 C224,330 236,378 262,398',
  antihelix: 'M276,150 C248,166 240,206 254,240 C262,258 262,276 258,300',
  canal: 'M298,240 C380,226 450,248 545,226 L548,290 C450,294 380,274 298,284 Z',
  canalCenter: 'M300,262 C380,250 450,270 542,258',
  cavity: 'M552,186 C590,168 642,176 658,198 L662,318 C642,342 590,344 560,322 C556,290 556,220 552,186 Z',
  tube: 'M588,330 C620,380 680,430 770,482 L786,466 C700,420 648,374 618,326 Z',
  nerveCoch: 'M742,312 C800,306 870,300 986,342',
  nerveVest: 'M694,240 C750,236 830,262 984,334',
  brain:
    'M936,250 C930,168 992,128 1052,140 C1104,150 1112,222 1096,272 C1084,312 1050,330 1010,326 C990,346 960,346 950,322 C936,302 938,276 936,250 Z',
  sulcus: 'M948,300 C978,280 1030,284 1064,302',
  sulcus2: 'M990,170 C1000,210 1020,230 1060,236',
  stem: 'M992,322 C996,350 994,380 990,410',
};

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

function useAnimatedView(target: View): View {
  const [view, setView] = useState<View>(target);
  const from = useRef<View>(target);
  const key = target.join(',');
  useEffect(() => {
    const start = from.current;
    if (prefersReducedMotion()) {
      from.current = target;
      setView(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 750;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 4);
      const v = start.map((s, i) => s + ((target[i] ?? s) - s) * e) as View;
      from.current = v;
      setView(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return view;
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export function EarArt({
  view: targetView,
  highlight = [],
  dim = false,
  selected = null,
  onSelect,
  hotspots = false,
  anonymous = false,
  labels = [],
  fx = [],
  showSource = false,
  showBrain = true,
  mark = null,
  className = '',
  title = 'Corte anatómico del oído humano',
  children,
}: Props) {
  const uid = useId().replace(/:/g, '');
  const view = useAnimatedView(targetView);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pxW, setPxW] = useState(0);
  useEffect(() => {
    const el = svgRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => e && setPxW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  /** Unidades del dibujo por píxel de pantalla (para que puntos y textos tengan tamaño constante). */
  const upp = pxW > 0 ? view[2] / pxW : view[2] / FULL_W;
  const s = view[2] / FULL_W; // escala del zoom
  const hl = useMemo(() => new Set<StructureId>([...highlight, ...(selected ? [selected] : [])]), [highlight, selected]);
  const has = (f: Fx) => fx.includes(f);

  const part = (id: StructureId) => {
    const active = hl.has(id);
    const faded = dim && hl.size > 0 && !active;
    const color = REGIONS[STRUCTURE_BY_ID[id].region].color;
    return {
      'data-structure': id,
      className: `transition-opacity duration-500 ${onSelect ? 'cursor-pointer' : ''}`,
      style: { opacity: faded ? 0.28 : 1 },
      filter: active ? `url(#glow-${uid})` : undefined,
      onClick: onSelect ? () => onSelect(id) : undefined,
      stroke: active ? color : undefined,
    };
  };
  const strokeFor = (id: StructureId, fallback: string) => (hl.has(id) ? REGIONS[STRUCTURE_BY_ID[id].region].color : fallback);

  return (
    <svg
      ref={svgRef}
      viewBox={view.join(' ')}
      className={`block h-full w-full select-none ${className}`}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id={`glow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={3 * s} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`tissue-${uid}`} cx="35%" cy="40%" r="75%">
          <stop offset="0" stopColor="#f0b8b0" />
          <stop offset="0.6" stopColor="#c98583" />
          <stop offset="1" stopColor="#8f5560" />
        </radialGradient>
        <linearGradient id={`bone-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a33" />
          <stop offset="1" stopColor="#1a1b24" />
        </linearGradient>
        <linearGradient id={`ossicle-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf3df" />
          <stop offset="1" stopColor="#c9b78f" />
        </linearGradient>
        <linearGradient id={`laby-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <pattern id={`trab-${uid}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="4" r="1.4" fill="#d8cbb0" opacity="0.07" />
          <circle cx="10" cy="10" r="1" fill="#d8cbb0" opacity="0.06" />
        </pattern>
        <clipPath id={`wclip-${uid}`}>
          <rect x="118" y="0" width="190" height="600" />
        </clipPath>
      </defs>

      {/* Fuente sonora */}
      {showSource && (
        <g>
          <g className={has('source') ? 'svg-anim anim-piston' : ''}>
            <rect x="40" y="232" width="42" height="56" rx="6" fill="#1e293b" stroke="#475569" />
            <path d="M82,236 L116,206 L116,314 L82,284 Z" fill="#334155" stroke="#64748b" />
            <ellipse cx="116" cy="260" rx="5" ry="54" fill="#0f172a" stroke="#94a3b8" />
          </g>
          <text x="78" y="345" textAnchor="middle" fontSize={12} fill="#93a1bb" fontFamily="var(--font-mono)">
            FUENTE
          </text>
        </g>
      )}
      {has('waves') && (
        <g clipPath={`url(#wclip-${uid})`} fill="none" stroke="#22d3ee" strokeWidth={2.5}>
          {[0, 0.6, 1.2, 1.8].map((d) => (
            <circle
              key={d}
              cx="116"
              cy="260"
              r="110"
              className="anim-wave"
              style={{ animationDelay: `${d}s`, transformBox: 'view-box', transformOrigin: '116px 260px' }}
            />
          ))}
        </g>
      )}

      {/* Hueso temporal */}
      <path
        d="M300,70 C480,52 760,56 920,96 L920,476 C760,512 480,506 300,470 Z"
        fill={`url(#bone-${uid})`}
        stroke="#d8cbb0"
        strokeOpacity={0.14}
      />
      <path d="M300,70 C480,52 760,56 920,96 L920,476 C760,512 480,506 300,470 Z" fill={`url(#trab-${uid})`} />
      <path d="M286,40 C300,180 300,360 286,520" stroke="#c98583" strokeOpacity={0.35} strokeWidth={10} fill="none" />

      {/* ============ OÍDO EXTERNO ============ */}
      <g {...part('pabellon')}>
        <path d={PATHS.pinna} fill={`url(#tissue-${uid})`} stroke={strokeFor('pabellon', '#7b4650')} strokeWidth={hl.has('pabellon') ? 3 : 1.5} />
        <path d={PATHS.helix} fill="none" stroke="#7b4650" strokeWidth={2} opacity={0.75} />
        <path d={PATHS.antihelix} fill="none" stroke="#7b4650" strokeWidth={2} opacity={0.6} />
        <ellipse cx="282" cy="262" rx="20" ry="30" fill="#7b4650" opacity={0.55} />
      </g>
      <g {...part('conducto')}>
        <path d={PATHS.canal} fill="#0b1222" stroke={strokeFor('conducto', '#c98583')} strokeWidth={hl.has('conducto') ? 3 : 1.5} />
      </g>
      {has('canal') && (
        <path d={PATHS.canalCenter} fill="none" stroke="#22d3ee" strokeWidth={3} strokeLinecap="round" className="anim-flow" />
      )}

      {/* ============ OÍDO MEDIO ============ */}
      <path d={PATHS.cavity} fill="#0b1222" stroke="#d8cbb0" strokeOpacity={0.3} />
      <g {...part('trompa')}>
        <path d={PATHS.tube} fill="#5b3a4a" fillOpacity={0.75} stroke={strokeFor('trompa', '#c98583')} strokeWidth={hl.has('trompa') ? 3 : 1.2} />
      </g>
      <g {...part('timpano')}>
        <g className={has('drum') ? 'svg-anim anim-drum' : ''}>
          <ellipse
            cx="548"
            cy="258"
            rx="5"
            ry="35"
            transform="rotate(-12 548 258)"
            fill="#f1d5cf"
            fillOpacity={0.85}
            stroke={strokeFor('timpano', '#f8e1dc')}
            strokeWidth={hl.has('timpano') ? 3 : 1}
          />
        </g>
      </g>
      <g
        className={has('ossicles') ? 'anim-rock' : ''}
        style={{ transformBox: 'view-box', transformOrigin: '584px 200px' }}
      >
        <g {...part('martillo')}>
          <path d="M568,204 C562,228 556,246 551,262" stroke={`url(#ossicle-${uid})`} strokeWidth={6} strokeLinecap="round" fill="none" />
          <circle cx="571" cy="196" r="10" fill={`url(#ossicle-${uid})`} stroke={strokeFor('martillo', '#a8956c')} strokeWidth={hl.has('martillo') ? 2.5 : 1} />
        </g>
        <g {...part('yunque')}>
          <ellipse cx="592" cy="199" rx="11" ry="9" fill={`url(#ossicle-${uid})`} stroke={strokeFor('yunque', '#a8956c')} strokeWidth={hl.has('yunque') ? 2.5 : 1} />
          <path d="M600,194 L612,190" stroke={`url(#ossicle-${uid})`} strokeWidth={5} strokeLinecap="round" />
          <path d="M594,206 C598,222 602,234 606,244" stroke={`url(#ossicle-${uid})`} strokeWidth={4.5} strokeLinecap="round" fill="none" />
        </g>
      </g>
      <g className={has('ossicles') ? 'svg-anim anim-piston' : ''}>
        <g {...part('estribo')}>
          <circle cx="609" cy="247" r="4" fill={`url(#ossicle-${uid})`} />
          <path d="M611,245 L639,236 M611,250 L639,262" stroke={strokeFor('estribo', '#e8dcc0')} strokeWidth={3.2} strokeLinecap="round" />
          <path d="M641,232 L641,266" stroke={`url(#ossicle-${uid})`} strokeWidth={6} strokeLinecap="round" />
        </g>
      </g>

      {/* ============ OÍDO INTERNO ============ */}
      <g {...part('canales')} fill="none">
        <g stroke={strokeFor('canales', '#a78bfa')} strokeWidth={8} strokeOpacity={0.9}>
          <ellipse cx="680" cy="166" rx="25" ry="42" transform="rotate(-14 680 166)" />
          <ellipse cx="716" cy="196" rx="40" ry="20" transform="rotate(28 716 196)" />
          <ellipse cx="650" cy="203" rx="33" ry="15" transform="rotate(-8 650 203)" />
        </g>
        <g stroke="#1a1b24" strokeWidth={3} strokeOpacity={0.6}>
          <ellipse cx="680" cy="166" rx="25" ry="42" transform="rotate(-14 680 166)" />
          <ellipse cx="716" cy="196" rx="40" ry="20" transform="rotate(28 716 196)" />
          <ellipse cx="650" cy="203" rx="33" ry="15" transform="rotate(-8 650 203)" />
        </g>
      </g>
      <g {...part('vestibulo')}>
        <ellipse cx="672" cy="246" rx="23" ry="27" fill={`url(#laby-${uid})`} fillOpacity={0.85} stroke={strokeFor('vestibulo', '#ddd6fe')} strokeWidth={hl.has('vestibulo') ? 3 : 1} />
      </g>
      <g {...part('coclea')}>
        <path d="M688,266 L696,290" stroke="#a78bfa" strokeWidth={12} strokeLinecap="round" />
        <path d={COCHLEA} fill="none" stroke={hl.has('coclea') ? '#c4b5fd' : '#8b5cf6'} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        <path d={COCHLEA} fill="none" stroke="#1e1338" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      </g>
      {has('fluid') && <path d={COCHLEA} fill="none" stroke="#f5f3ff" strokeWidth={3} strokeLinecap="round" className="anim-flow" />}
      {has('hair') && (
        <g opacity={0.3} pointerEvents="none">
          <circle cx="742" cy="312" r="62" fill="#fbbf24" className="anim-glow" />
        </g>
      )}
      <g {...part('nervio')} fill="none" strokeLinecap="round">
        <path d={PATHS.nerveVest} stroke="#d4a72c" strokeWidth={6} opacity={0.75} />
        <path d={PATHS.nerveCoch} stroke={strokeFor('nervio', '#fbbf24')} strokeWidth={9} />
      </g>
      {has('nerve') && (
        <path d={PATHS.nerveCoch} fill="none" stroke="#fff7d6" strokeWidth={3} strokeLinecap="round" className="anim-flow-fast" />
      )}

      {/* ============ CEREBRO ============ */}
      {showBrain && (
        <g>
          <path d={PATHS.stem} stroke="#7a6a8a" strokeWidth={22} strokeLinecap="round" fill="none" opacity={0.7} />
          <path d={PATHS.brain} fill="#2a2140" stroke="#8b7aa8" strokeWidth={1.5} />
          <path d={PATHS.sulcus} stroke="#8b7aa8" strokeWidth={2} fill="none" opacity={0.8} />
          <path d={PATHS.sulcus2} stroke="#8b7aa8" strokeWidth={1.5} fill="none" opacity={0.5} />
          <ellipse
            cx="1004"
            cy="288"
            rx="28"
            ry="10"
            fill="#22d3ee"
            opacity={has('brain') ? 0.9 : 0.25}
            className={has('brain') ? 'anim-glow' : ''}
          />
          {has('brain') && (
            <g fontFamily="var(--font-mono)" fontSize={13} fill="#e0f2fe" textAnchor="middle">
              <text x="1015" y="118">CORTEZA AUDITIVA</text>
              <text x="1015" y="134" fill="#93a1bb" fontSize={11}>
                lóbulo temporal
              </text>
              <path d="M1012,140 L1006,276" stroke="#22d3ee" strokeWidth={1} strokeDasharray="3 3" />
            </g>
          )}
        </g>
      )}

      {/* Marca de evaluación */}
      {mark && (
        <g pointerEvents="none">
          <circle
            cx={STRUCTURE_BY_ID[mark.id].hotspot[0]}
            cy={STRUCTURE_BY_ID[mark.id].hotspot[1]}
            r={16 * upp}
            fill="none"
            stroke={mark.ok ? '#34d399' : '#fb7185'}
            strokeWidth={3 * upp}
          />
        </g>
      )}

      {/* Puntos interactivos */}
      {hotspots &&
        STRUCTURES.map((st, i) => {
          const [x, y] = st.hotspot;
          const on = selected === st.id;
          const color = REGIONS[st.region].color;
          const r = Math.min(9 * upp, 11 * s);
          return (
            <g
              key={st.id}
              role="button"
              tabIndex={0}
              aria-label={anonymous ? `Estructura ${i + 1}` : st.name}
              aria-pressed={on}
              className="cursor-pointer outline-none [&:focus-visible>circle:last-child]:stroke-white"
              onClick={() => onSelect?.(st.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect?.(st.id);
                }
              }}
            >
              <circle cx={x} cy={y} r={r * 2.4} fill="transparent" />
              {!on && <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={1.5 * upp} className="hotspot-ring" />}
              <circle
                cx={x}
                cy={y}
                r={on ? r * 1.25 : r}
                fill={on ? color : '#05070d'}
                stroke={on ? '#fff' : color}
                strokeWidth={2 * upp}
              />
              {!on && <circle cx={x} cy={y} r={r * 0.38} fill={color} />}
            </g>
          );
        })}

      {/* Etiquetas */}
      {!anonymous &&
        labels.map((id) => {
          const [x, y, anchor] = LABEL_POS[id];
          return (
            <text
              key={id}
              x={x}
              y={y}
              textAnchor={anchor}
              fontSize={Math.min(13 * upp, 20 * s)}
              fontWeight={600}
              fill="#f1f5fb"
              stroke="#05070d"
              strokeWidth={4 * upp}
              paintOrder="stroke"
              pointerEvents="none"
            >
              {STRUCTURE_BY_ID[id].name}
            </text>
          );
        })}
      {children}
    </svg>
  );
}
