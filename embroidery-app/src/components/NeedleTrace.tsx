import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Maths helpers ─────────────────────────────────────────────────────────────
const TAU = Math.PI * 2;
function pts2d(fn: (t: number) => [number, number], steps: number): string {
  const arr: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const [x, y] = fn(i / steps);
    arr.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return arr.join(' ');
}

// ── Pattern generators — return SVG `d` strings ───────────────────────────────
// All patterns are centered at (0,0) and fit within ±1 unit; caller scales via transform.

/** Plum blossom 梅花 — 5 petals traced as individual loops */
function plumPaths(R = 1): string[] {
  const paths: string[] = [];
  // stamen circle
  paths.push(pts2d(t => [R * 0.18 * Math.cos(t * TAU), R * 0.18 * Math.sin(t * TAU)], 64));
  // five petals
  for (let p = 0; p < 5; p++) {
    const ba = (p / 5) * TAU - Math.PI / 2;
    const px = R * 0.58 * Math.cos(ba), py = R * 0.58 * Math.sin(ba);
    const pr = R * 0.42;
    paths.push(pts2d(t => [
      px + pr * (0.55 + 0.45 * Math.cos(t * TAU)) * Math.cos(t * TAU + ba),
      py + pr * (0.55 + 0.45 * Math.cos(t * TAU)) * Math.sin(t * TAU + ba),
    ], 96));
  }
  return paths;
}

/** Butterfly 蝴蝶 — mathematical butterfly curve */
function butterflyPath(R = 1): string {
  return pts2d(t => {
    const θ = t * TAU;
    const r = R * 0.38 * (
      Math.exp(Math.sin(θ)) - 2 * Math.cos(4 * θ) +
      Math.pow(Math.sin((2 * θ - Math.PI) / 24), 5)
    );
    return [r * Math.cos(θ), r * Math.sin(θ)];
  }, 400);
}

/** Lotus 莲花 — two rings of petals */
function lotusPaths(R = 1): string[] {
  const paths: string[] = [];
  // center circle
  paths.push(pts2d(t => [R * 0.12 * Math.cos(t * TAU), R * 0.12 * Math.sin(t * TAU)], 48));
  // inner 8 petals
  for (let p = 0; p < 8; p++) {
    const ba = (p / 8) * TAU;
    const dist = R * 0.34;
    paths.push(pts2d(t => {
      const θ = t * TAU;
      const a = R * 0.30 * (0.35 + 0.65 * Math.abs(Math.cos(θ)));
      const b = R * 0.14 * (0.35 + 0.65 * Math.abs(Math.sin(θ)));
      return [
        dist * Math.cos(ba) + a * Math.cos(θ) * Math.cos(ba) - b * Math.sin(θ) * Math.sin(ba),
        dist * Math.sin(ba) + a * Math.cos(θ) * Math.sin(ba) + b * Math.sin(θ) * Math.cos(ba),
      ];
    }, 80));
  }
  // outer 8 petals
  for (let p = 0; p < 8; p++) {
    const ba = (p / 8) * TAU + Math.PI / 8;
    const dist = R * 0.64;
    paths.push(pts2d(t => {
      const θ = t * TAU;
      const a = R * 0.40 * (0.30 + 0.70 * Math.abs(Math.cos(θ)));
      const b = R * 0.18 * (0.30 + 0.70 * Math.abs(Math.sin(θ)));
      return [
        dist * Math.cos(ba) + a * Math.cos(θ) * Math.cos(ba) - b * Math.sin(θ) * Math.sin(ba),
        dist * Math.sin(ba) + a * Math.cos(θ) * Math.sin(ba) + b * Math.sin(θ) * Math.cos(ba),
      ];
    }, 80));
  }
  return paths;
}

/** Phoenix 凤凰 — three feather-spiral arms */
function phoenixPaths(R = 1): string[] {
  const paths: string[] = [];
  for (let arm = 0; arm < 3; arm++) {
    const ba = (arm / 3) * TAU - Math.PI / 2;
    paths.push(pts2d(t => {
      const angle = ba + t * 2.5 * Math.PI;
      const r = R * 0.07 + R * 0.70 * t;
      const wave = R * 0.03 * Math.sin(t * TAU * 3.5);
      return [(r + wave) * Math.cos(angle), (r + wave) * Math.sin(angle)];
    }, 180));
    // feather barb lines
    for (let f = 0; f < 5; f++) {
      const ft = (f + 1) / 7;
      paths.push(pts2d(t => {
        const mainAngle = ba + ft * 2.5 * Math.PI;
        const mr = R * 0.07 + R * 0.70 * ft;
        const wave = R * 0.03 * Math.sin(ft * TAU * 3.5);
        const sx = (mr + wave) * Math.cos(mainAngle);
        const sy = (mr + wave) * Math.sin(mainAngle);
        const barbLen = R * 0.12 * (1 - ft * 0.5);
        const perpAngle = mainAngle + Math.PI / 2;
        const dir = arm % 2 === 0 ? 1 : -1;
        return [
          sx + t * barbLen * dir * Math.cos(perpAngle - 0.4),
          sy + t * barbLen * dir * Math.sin(perpAngle - 0.4),
        ];
      }, 30));
    }
  }
  return paths;
}

// ── Pattern registry ──────────────────────────────────────────────────────────
interface Pattern {
  name: string;
  nameCN: string;
  paths: string[];
  drawTime: number;  // seconds for full trace
  holdTime: number;  // seconds to hold after drawn
}

const PATTERNS: Pattern[] = [
  { name: 'Plum',     nameCN: '梅花', paths: plumPaths(1),     drawTime: 9,  holdTime: 3 },
  { name: 'Butterfly',nameCN: '蝴蝶', paths: [butterflyPath(1)], drawTime: 11, holdTime: 3 },
  { name: 'Lotus',    nameCN: '莲花', paths: lotusPaths(1),    drawTime: 13, holdTime: 3 },
  { name: 'Phoenix',  nameCN: '凤凰', paths: phoenixPaths(1),  drawTime: 11, holdTime: 3 },
];

// ── Animated path that draws itself ──────────────────────────────────────────
interface TracedPathProps {
  d: string;
  index: number;
  totalPaths: number;
  patternDrawTime: number;
  strokeWidth?: number;
  opacity?: number;
}

function TracedPath({ d, index, totalPaths, patternDrawTime, strokeWidth = 1.2, opacity = 0.85 }: TracedPathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [d]);

  if (len === 0) return <path ref={pathRef} d={d} fill="none" stroke="transparent" strokeWidth={strokeWidth} />;

  // Stagger each sub-path within the total pattern draw time
  const staggerDelay = (index / totalPaths) * patternDrawTime * 0.6;
  const dur = (patternDrawTime * 0.4) + (patternDrawTime * 0.6 / totalPaths);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke="rgba(220,195,120,0.9)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      style={{
        strokeDasharray: len,
        strokeDashoffset: len,
        animation: `traceIn ${dur.toFixed(2)}s cubic-bezier(0.4,0,0.6,1) ${staggerDelay.toFixed(2)}s forwards`,
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NeedleTrace() {
  const [current, setCurrent] = useState(0);
  const [key, setKey]         = useState(0);

  const pat = PATTERNS[current];

  useEffect(() => {
    const total = pat.drawTime + pat.holdTime + 1.5; // +1.5 for fade-out
    const id = setTimeout(() => {
      setCurrent(c => (c + 1) % PATTERNS.length);
      setKey(k => k + 1);
    }, total * 1000);
    return () => clearTimeout(id);
  }, [current, pat.drawTime, pat.holdTime]);

  // viewBox: -1.1 to 1.1 (pattern fits ±1)
  const VB = '-1.1 -1.1 2.2 2.2';
  // The SVG is square; center it in the hero section
  const fadeOutDelay = pat.drawTime + pat.holdTime;

  return (
    <>
      {/* CSS keyframes injected once */}
      <style>{`@keyframes traceIn { to { stroke-dashoffset: 0; } }`}</style>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ width: 'min(72vw, 72vh)', height: 'min(72vw, 72vh)', maxWidth: '640px', maxHeight: '640px' }}
          >
            {/* Fade entire pattern out after hold time */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ duration: 1.5, delay: fadeOutDelay, ease: 'easeInOut', times: [0, 0.6, 1] }}
              className="w-full h-full"
            >
              <svg viewBox={VB} className="w-full h-full overflow-visible">
                <defs>
                  {/* Glow filter: makes the stroke look like a glowing thread */}
                  <filter id="nt-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.025" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.010" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur1" />
                      <feMergeNode in="blur2" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Outer soft halo — drawn separately at larger stroke, very low opacity */}
                  <filter id="nt-halo" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.06" />
                  </filter>
                </defs>

                {/* Halo layer (blurred copy at wider stroke, gold tint) */}
                <g filter="url(#nt-halo)" opacity="0.45">
                  {pat.paths.map((d, i) => (
                    <TracedPath
                      key={i} d={d} index={i}
                      totalPaths={pat.paths.length}
                      patternDrawTime={pat.drawTime}
                      strokeWidth={0.025}
                      opacity={0.7}
                    />
                  ))}
                </g>

                {/* Main stroke layer */}
                <g filter="url(#nt-glow)">
                  {pat.paths.map((d, i) => (
                    <TracedPath
                      key={i} d={d} index={i}
                      totalPaths={pat.paths.length}
                      patternDrawTime={pat.drawTime}
                      strokeWidth={0.012}
                      opacity={0.92}
                    />
                  ))}
                </g>

                {/* Fine detail overlay (slightly thinner, brighter center) */}
                <g opacity="0.6">
                  {pat.paths.map((d, i) => (
                    <TracedPath
                      key={i} d={d} index={i}
                      totalPaths={pat.paths.length}
                      patternDrawTime={pat.drawTime}
                      strokeWidth={0.005}
                      opacity={0.95}
                    />
                  ))}
                </g>
              </svg>
            </motion.div>

            {/* Pattern name watermark */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.35, 0.35, 0] }}
              transition={{
                duration: pat.drawTime + pat.holdTime,
                delay: pat.drawTime * 0.7,
                times: [0, 0.1, 0.8, 1],
                ease: 'easeInOut',
              }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 font-serif text-[#C9A84C] tracking-[0.4em] text-sm"
            >
              {pat.nameCN}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
