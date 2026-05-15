import { useEffect, useRef } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const N = 10000;
const TAU = Math.PI * 2;

const PHASE_FLOW     = 0;
const PHASE_FORMING  = 1;
const PHASE_HOLD     = 2;
const PHASE_DISPERSE = 3;

const DUR_FLOW     = 320;
const DUR_FORMING  = 240;
const DUR_HOLD     = 180;
const DUR_DISPERSE = 200;

// Gold/red/ivory palette — [r,g,b]
const PALETTE: [number,number,number][] = [
  [240, 192,  55],   // bright gold
  [201, 168,  76],   // muted gold
  [220, 148,  28],   // amber
  [248, 220, 130],   // pale gold
  [192,  57,  43],   // crimson
  [235,  90,  40],   // orange-red
  [242, 234, 205],   // ivory
];
const COLOR_RATIOS = [0.28, 0.22, 0.18, 0.12, 0.08, 0.05, 0.07];

// pre-assign colors at module level (stable across re-renders)
const colorAssign = new Uint8Array(N);
(function () {
  const thresholds = COLOR_RATIOS.reduce((acc: number[], w, i) => {
    acc.push((acc[i - 1] ?? 0) + w);
    return acc;
  }, []);
  for (let i = 0; i < N; i++) {
    const r = Math.random();
    colorAssign[i] = thresholds.findIndex(t => r < t);
  }
})();

// ── Pattern generators (return Float32Array [x0,y0, x1,y1, ...] length N*2) ─

function patternPlum(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2);
  let idx = 0;
  const petals = 5;
  const pR   = sc * 0.40;
  const pRad = sc * 0.43;

  // stamen center
  const nc = Math.floor(N * 0.09);
  for (let i = 0; i < nc; i++) {
    const t = (i / nc) * TAU;
    const ring = (i % 10) / 10;
    const r = pR * 0.20 * ring;
    out[idx++] = cx + r * Math.cos(t);
    out[idx++] = cy + r * Math.sin(t);
  }
  // five petals
  const np = Math.floor((N - nc) / petals);
  for (let p = 0; p < petals; p++) {
    const ba  = (p / petals) * TAU - Math.PI / 2;
    const pcx = cx + pR * 0.60 * Math.cos(ba);
    const pcy = cy + pR * 0.60 * Math.sin(ba);
    for (let i = 0; i < np; i++) {
      const t    = (i / np) * TAU;
      const ring = (i % 14) / 14;
      const r    = pRad * 0.46 * ring * (0.55 + 0.45 * Math.cos(t));
      out[idx++] = pcx + r * Math.cos(t);
      out[idx++] = pcy + r * Math.sin(t);
    }
  }
  while (idx < N * 2 - 1) {
    const t = Math.random() * TAU;
    out[idx++] = cx + sc * 0.04 * Math.cos(t);
    out[idx++] = cy + sc * 0.04 * Math.sin(t);
  }
  return out;
}

function patternButterfly(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2);
  const passes = 5;
  const pp = Math.floor(N / passes);
  for (let pass = 0; pass < passes; pass++) {
    const off = (pass - 2) * 0.015;
    for (let i = 0; i < pp; i++) {
      const t = (i / pp) * TAU + off;
      const r = sc * 0.37 * (
        Math.exp(Math.sin(t)) -
        2.0 * Math.cos(4 * t) +
        Math.pow(Math.sin((2 * t - Math.PI) / 24), 5)
      );
      const base = (pass * pp + i) * 2;
      out[base]     = cx + r * Math.cos(t);
      out[base + 1] = cy + r * Math.sin(t);
    }
  }
  return out;
}

function patternLotus(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2);
  let idx = 0;

  const addPetalRing = (count: number, petals: number, dist: number, rPetal: number, rot: number) => {
    const pp = Math.floor(count / petals);
    for (let p = 0; p < petals; p++) {
      const ba  = (p / petals) * TAU + rot;
      const pcx = cx + dist * Math.cos(ba);
      const pcy = cy + dist * Math.sin(ba);
      for (let i = 0; i < pp; i++) {
        const t    = (i / pp) * TAU;
        const ring = (i % 12) / 12;
        const a    = rPetal * ring * (0.35 + 0.65 * Math.abs(Math.cos(t)));
        const b    = rPetal * 0.4 * ring * (0.35 + 0.65 * Math.abs(Math.sin(t)));
        const lx   = a * Math.cos(t);
        const ly   = b * Math.sin(t);
        out[idx++] = pcx + lx * Math.cos(ba) - ly * Math.sin(ba);
        out[idx++] = pcy + lx * Math.sin(ba) + ly * Math.cos(ba);
      }
    }
  };

  // center
  const nc = Math.floor(N * 0.07);
  for (let i = 0; i < nc; i++) {
    const t = (i / nc) * TAU;
    const r = sc * 0.10 * ((i % 9) / 9);
    out[idx++] = cx + r * Math.cos(t);
    out[idx++] = cy + r * Math.sin(t);
  }
  addPetalRing(Math.floor(N * 0.36), 8, sc * 0.29, sc * 0.27, 0);
  addPetalRing(Math.floor(N * 0.54), 8, sc * 0.56, sc * 0.38, Math.PI / 8);

  while (idx < N * 2 - 1) {
    const t = Math.random() * TAU;
    out[idx++] = cx + sc * 0.04 * Math.cos(t);
    out[idx++] = cy + sc * 0.04 * Math.sin(t);
  }
  return out;
}

function patternPhoenix(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2);
  const arms = 3;
  const passes = 4;
  const ppArmPass = Math.floor(N / (arms * passes));
  for (let arm = 0; arm < arms; arm++) {
    const ba = (arm / arms) * TAU - Math.PI / 2;
    for (let pass = 0; pass < passes; pass++) {
      const radOff = (pass - 1.5) * sc * 0.022;
      for (let i = 0; i < ppArmPass; i++) {
        const frac = i / ppArmPass;
        const angle = ba + frac * 2.5 * Math.PI;
        const r     = sc * 0.07 + sc * 0.68 * frac + radOff;
        const wave  = sc * 0.025 * Math.sin(frac * TAU * 3.5);
        const base  = (arm * passes * ppArmPass + pass * ppArmPass + i) * 2;
        out[base]     = cx + (r + wave) * Math.cos(angle);
        out[base + 1] = cy + (r + wave) * Math.sin(angle);
      }
    }
  }
  let filled = arms * passes * ppArmPass * 2;
  while (filled < N * 2 - 1) {
    const t = Math.random() * TAU;
    const r = sc * 0.05 * Math.random();
    out[filled++] = cx + r * Math.cos(t);
    out[filled++] = cy + r * Math.sin(t);
  }
  return out;
}

const PATTERNS = [patternPlum, patternButterfly, patternLotus, patternPhoenix];

// ── Curl-like noise fields ────────────────────────────────────────────────────
function noiseVx(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.0028 + t * 0.43) * Math.cos(y * 0.0021 + t * 0.19) * 1.7 +
    Math.sin(x * 0.007  - y * 0.005 + t * 0.31) * 0.95 +
    Math.cos(x * 0.0013 + y * 0.0018 + t * 0.56) * 1.1
  );
}
function noiseVy(x: number, y: number, t: number): number {
  return (
    Math.cos(x * 0.0026 + t * 0.39) * Math.sin(y * 0.0030 - t * 0.23) * 1.7 +
    Math.cos(x * 0.006  + y * 0.0044 + t * 0.27) * 0.95 +
    Math.sin(x * 0.0015 - y * 0.0023 + t * 0.49) * 1.1
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef   = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const glow   = glowRef.current!;
    const ctx    = canvas.getContext('2d') as CanvasRenderingContext2D;
    const gCtx   = glow.getContext('2d')   as CanvasRenderingContext2D;

    let W = 0, H = 0, animId = 0;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      glow.width  = Math.round(W * devicePixelRatio * 0.4);
      glow.height = Math.round(H * devicePixelRatio * 0.4);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      gCtx.scale(devicePixelRatio * 0.4, devicePixelRatio * 0.4);
    }
    resize();

    // ── Particle state ──────────────────────────────────────────────────────
    const px  = new Float32Array(N);
    const py  = new Float32Array(N);
    const pvx = new Float32Array(N);
    const pvy = new Float32Array(N);
    const ptx = new Float32Array(N);
    const pty = new Float32Array(N);
    const psz = new Float32Array(N);

    // start clustered near center
    for (let i = 0; i < N; i++) {
      const a = Math.random() * TAU;
      const r = 20 + Math.random() * Math.min(W, H) * 0.18;
      px[i]  = W / 2 + r * Math.cos(a);
      py[i]  = H / 2 + r * Math.sin(a);
      pvx[i] = (Math.random() - 0.5) * 1.5;
      pvy[i] = (Math.random() - 0.5) * 1.5;
      psz[i] = 0.8 + (i % 6) * 0.25;
    }

    // ── Phase state ─────────────────────────────────────────────────────────
    let phase      = PHASE_FLOW;
    let pFrame     = 0;
    let patIdx     = 0;
    let T          = 0;           // noise time

    function assignPattern(idx: number) {
      const pts = PATTERNS[idx](W / 2, H / 2, Math.min(W, H) * 0.34);
      // shuffle assignment
      const order = Array.from({ length: N }, (_,i) => i);
      for (let i = N - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
      }
      for (let i = 0; i < N; i++) {
        ptx[order[i]] = pts[i * 2];
        pty[order[i]] = pts[i * 2 + 1];
      }
    }

    function assignScatter() {
      for (let i = 0; i < N; i++) {
        const a = Math.random() * TAU;
        const r = Math.min(W, H) * (0.06 + Math.random() * 0.30);
        ptx[i] = W / 2 + r * Math.cos(a);
        pty[i] = H / 2 + r * Math.sin(a);
      }
    }

    assignScatter();

    // ── Draw one frame of particles (into context c, at coordinate scale sc) ─
    function drawParticles(c: CanvasRenderingContext2D, sc: number) {
      for (let ci = 0; ci < PALETTE.length; ci++) {
        const [r, g, b] = PALETTE[ci];
        c.fillStyle = `rgb(${r},${g},${b})`;
        c.beginPath();
        for (let i = 0; i < N; i++) {
          if (colorAssign[i] !== ci) continue;
          const x = px[i] / sc;
          const y = py[i] / sc;
          const s = psz[i] / sc;
          c.moveTo(x + s, y);
          c.arc(x, y, s, 0, TAU);
        }
        c.fill();
      }
    }

    // ── Main loop ────────────────────────────────────────────────────────────
    function tick() {
      pFrame++;
      T += 0.007;

      // phase transitions
      if (phase === PHASE_FLOW && pFrame >= DUR_FLOW) {
        phase = PHASE_FORMING; pFrame = 0;
        assignPattern(patIdx);
      } else if (phase === PHASE_FORMING && pFrame >= DUR_FORMING) {
        phase = PHASE_HOLD; pFrame = 0;
      } else if (phase === PHASE_HOLD && pFrame >= DUR_HOLD) {
        phase = PHASE_DISPERSE; pFrame = 0;
        assignScatter();
      } else if (phase === PHASE_DISPERSE && pFrame >= DUR_DISPERSE) {
        phase = PHASE_FLOW; pFrame = 0;
        patIdx = (patIdx + 1) % PATTERNS.length;
      }

      // ── physics update ──
      const damp    = 0.87;
      const maxSpd  = 4.2;
      const cx      = W / 2;
      const cy      = H / 2;
      const jitter  = 0.20;

      for (let i = 0; i < N; i++) {
        const x = px[i], y = py[i];

        if (phase === PHASE_FLOW) {
          pvx[i] += noiseVx(x, y, T) * 0.25;
          pvy[i] += noiseVy(x, y, T) * 0.25;
          pvx[i] += (cx - x) * 0.00065;   // soft center pull
          pvy[i] += (cy - y) * 0.00065;
          pvx[i] += (Math.random() - 0.5) * jitter;
          pvy[i] += (Math.random() - 0.5) * jitter;

        } else if (phase === PHASE_FORMING) {
          const prog  = Math.min(1, pFrame / DUR_FORMING);
          const stiff = 0.018 + prog * 0.065;
          pvx[i] += (ptx[i] - x) * stiff;
          pvy[i] += (pty[i] - y) * stiff;
          pvx[i] += (Math.random() - 0.5) * jitter * 0.4;
          pvy[i] += (Math.random() - 0.5) * jitter * 0.4;

        } else if (phase === PHASE_HOLD) {
          pvx[i] += (ptx[i] - x) * 0.22;
          pvy[i] += (pty[i] - y) * 0.22;
          // breathing pulse
          const breath = 0.010 * Math.sin(T * 4 + i * 0.008);
          pvx[i] += (x - cx) * breath;
          pvy[i] += (y - cy) * breath;
          pvx[i] += (Math.random() - 0.5) * 0.30;
          pvy[i] += (Math.random() - 0.5) * 0.30;

        } else {
          // DISPERSE
          pvx[i] += (ptx[i] - x) * 0.028;
          pvy[i] += (pty[i] - y) * 0.028;
          pvx[i] += (Math.random() - 0.5) * jitter * 0.6;
          pvy[i] += (Math.random() - 0.5) * jitter * 0.6;
        }

        pvx[i] *= damp;
        pvy[i] *= damp;
        const spd = Math.sqrt(pvx[i] * pvx[i] + pvy[i] * pvy[i]);
        if (spd > maxSpd) {
          const inv = maxSpd / spd;
          pvx[i] *= inv; pvy[i] *= inv;
        }
        px[i] += pvx[i];
        py[i] += pvy[i];
      }

      // ── render ──────────────────────────────────────────────────────────

      // trail: alpha-clear for smoke / gas tail effect
      const trailA = phase === PHASE_HOLD ? 0.50
                   : phase === PHASE_FORMING ? 0.22
                   : 0.10;
      ctx.fillStyle = `rgba(8,12,20,${trailA})`;
      ctx.fillRect(0, 0, W, H);

      // bloom layer (draw to small glow canvas then composite with screen+blur)
      gCtx.clearRect(0, 0, W, H);
      gCtx.globalAlpha = 0.52;
      drawParticles(gCtx, 1 / 0.4);      // coordinate scale = 1/glow_scale
      gCtx.globalAlpha = 1;

      ctx.save();
      ctx.filter = 'blur(6px) brightness(1.5)';
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.75;
      ctx.drawImage(glow, 0, 0, W, H);
      ctx.restore();

      // sharp core
      ctx.save();
      ctx.globalAlpha = 0.93;
      drawParticles(ctx, 1);
      ctx.restore();

      animId = requestAnimationFrame(tick);
    }

    tick();

    const onResize = () => { resize(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <canvas ref={glowRef} className="hidden" />
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
