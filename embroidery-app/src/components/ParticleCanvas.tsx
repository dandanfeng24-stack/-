import { useEffect, useRef } from 'react';

const N   = 10000;
const TAU = Math.PI * 2;

// ── Phase constants ───────────────────────────────────────────────────────────
const PH_FLOW     = 0;
const PH_FORMING  = 1;
const PH_HOLD     = 2;
const PH_DISPERSE = 3;

// All durations in frames at ~60 fps
const DUR_FLOW     = 480;   // ~8 s  — drifting cloud
const DUR_FORMING  = 480;   // ~8 s  — slow convergence
const DUR_HOLD     = 300;   // ~5 s  — pattern breathes
const DUR_DISPERSE = 420;   // ~7 s  — slow dissolution

// ── Pre-render a single droplet sprite once (white → transparent, with highlight)
function makeDropletSprite(diameter: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = diameter;
  const cx = diameter / 2;
  // main gradient: off-center highlight simulates sphere
  const g = (c.getContext('2d') as CanvasRenderingContext2D);
  const hx = cx * 0.72, hy = cx * 0.62;   // highlight position
  const grad = g.createRadialGradient(hx, hy, 0, cx, cx, cx);
  grad.addColorStop(0.00, 'rgba(255,255,255,1.00)');
  grad.addColorStop(0.20, 'rgba(245,248,255,0.90)');
  grad.addColorStop(0.55, 'rgba(195,210,235,0.50)');
  grad.addColorStop(0.85, 'rgba(140,165,200,0.15)');
  grad.addColorStop(1.00, 'rgba(100,130,180,0.00)');
  g.beginPath(); g.arc(cx, cx, cx, 0, TAU); g.fillStyle = grad; g.fill();
  // secondary specular dot
  const spec = g.createRadialGradient(hx * 0.9, hy * 0.9, 0, hx * 0.9, hy * 0.9, cx * 0.18);
  spec.addColorStop(0, 'rgba(255,255,255,0.85)');
  spec.addColorStop(1, 'rgba(255,255,255,0.00)');
  g.beginPath(); g.arc(hx * 0.9, hy * 0.9, cx * 0.18, 0, TAU); g.fillStyle = spec; g.fill();
  return c;
}

// ── Pattern generators ────────────────────────────────────────────────────────
// Each returns Float32Array length N*2: [x0,y0, x1,y1, ...]

function patternPlum(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2); let idx = 0;
  const petals = 5, pRad = sc * 0.42, pOff = sc * 0.60;
  const nc = Math.floor(N * 0.09);
  for (let i = 0; i < nc; i++) {
    const t = (i / nc) * TAU;
    const r = pRad * 0.22 * ((i % 10) / 10);
    out[idx++] = cx + r * Math.cos(t); out[idx++] = cy + r * Math.sin(t);
  }
  const np = Math.floor((N - nc) / petals);
  for (let p = 0; p < petals; p++) {
    const ba = (p / petals) * TAU - Math.PI / 2;
    const pcx = cx + pOff * 0.55 * Math.cos(ba);
    const pcy = cy + pOff * 0.55 * Math.sin(ba);
    for (let i = 0; i < np; i++) {
      const t = (i / np) * TAU;
      const ring = (i % 16) / 16;
      const r = pRad * 0.48 * ring * (0.5 + 0.5 * Math.cos(t));
      out[idx++] = pcx + r * Math.cos(t); out[idx++] = pcy + r * Math.sin(t);
    }
  }
  while (idx < N * 2 - 1) { out[idx++] = cx; out[idx++] = cy; }
  return out;
}

function patternButterfly(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2);
  const passes = 5, pp = Math.floor(N / passes);
  for (let pass = 0; pass < passes; pass++) {
    const off = (pass - 2) * 0.014;
    for (let i = 0; i < pp; i++) {
      const t = (i / pp) * TAU + off;
      const r = sc * 0.36 * (
        Math.exp(Math.sin(t)) - 2 * Math.cos(4 * t) +
        Math.pow(Math.sin((2 * t - Math.PI) / 24), 5)
      );
      const b = (pass * pp + i) * 2;
      out[b] = cx + r * Math.cos(t); out[b + 1] = cy + r * Math.sin(t);
    }
  }
  return out;
}

function patternLotus(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2); let idx = 0;
  const addRing = (count: number, petals: number, dist: number, rp: number, rot: number) => {
    const pp = Math.floor(count / petals);
    for (let p = 0; p < petals; p++) {
      const ba = (p / petals) * TAU + rot;
      const pcx = cx + dist * Math.cos(ba), pcy = cy + dist * Math.sin(ba);
      for (let i = 0; i < pp; i++) {
        const t = (i / pp) * TAU, ring = (i % 12) / 12;
        const a = rp * ring * (0.3 + 0.7 * Math.abs(Math.cos(t)));
        const b = rp * 0.38 * ring * (0.3 + 0.7 * Math.abs(Math.sin(t)));
        out[idx++] = pcx + (a * Math.cos(t)) * Math.cos(ba) - (b * Math.sin(t)) * Math.sin(ba);
        out[idx++] = pcy + (a * Math.cos(t)) * Math.sin(ba) + (b * Math.sin(t)) * Math.cos(ba);
      }
    }
  };
  const nc = Math.floor(N * 0.07);
  for (let i = 0; i < nc; i++) {
    const t = (i / nc) * TAU, r = sc * 0.10 * ((i % 9) / 9);
    out[idx++] = cx + r * Math.cos(t); out[idx++] = cy + r * Math.sin(t);
  }
  addRing(Math.floor(N * 0.36), 8, sc * 0.28, sc * 0.26, 0);
  addRing(Math.floor(N * 0.54), 8, sc * 0.55, sc * 0.38, Math.PI / 8);
  while (idx < N * 2 - 1) { out[idx++] = cx; out[idx++] = cy; }
  return out;
}

function patternPhoenix(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2);
  const arms = 3, passes = 4, ppAP = Math.floor(N / (arms * passes));
  for (let arm = 0; arm < arms; arm++) {
    const ba = (arm / arms) * TAU - Math.PI / 2;
    for (let pass = 0; pass < passes; pass++) {
      const radOff = (pass - 1.5) * sc * 0.022;
      for (let i = 0; i < ppAP; i++) {
        const frac = i / ppAP;
        const angle = ba + frac * 2.5 * Math.PI;
        const r = sc * 0.07 + sc * 0.68 * frac + radOff;
        const wave = sc * 0.024 * Math.sin(frac * TAU * 3.5);
        const b = (arm * passes * ppAP + pass * ppAP + i) * 2;
        out[b] = cx + (r + wave) * Math.cos(angle);
        out[b + 1] = cy + (r + wave) * Math.sin(angle);
      }
    }
  }
  let f = arms * passes * ppAP * 2;
  while (f < N * 2 - 1) { out[f++] = cx; out[f++] = cy; }
  return out;
}

const PATTERNS = [patternPlum, patternButterfly, patternLotus, patternPhoenix];

// ── Slow curl-noise field ─────────────────────────────────────────────────────
function fvx(x: number, y: number, t: number): number {
  return Math.sin(x * 0.0022 + t * 0.31) * Math.cos(y * 0.0017 + t * 0.14) * 1.3
       + Math.sin(x * 0.0055 - y * 0.004 + t * 0.22) * 0.7
       + Math.cos(x * 0.001  + y * 0.0014 + t * 0.40) * 0.8;
}
function fvy(x: number, y: number, t: number): number {
  return Math.cos(x * 0.002  + t * 0.28) * Math.sin(y * 0.0024 - t * 0.17) * 1.3
       + Math.cos(x * 0.005  + y * 0.0035 + t * 0.19) * 0.7
       + Math.sin(x * 0.0012 - y * 0.0018 + t * 0.36) * 0.8;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ParticleCanvas() {
  const mainRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const main  = mainRef.current!;
    const glow  = glowRef.current!;
    const mCtx  = main.getContext('2d') as CanvasRenderingContext2D;
    const gCtx  = glow.getContext('2d') as CanvasRenderingContext2D;

    let W = 0, H = 0, animId = 0;

    // pre-render droplet sprites at two sizes
    const SPRITE_SM = makeDropletSprite(6);
    const SPRITE_LG = makeDropletSprite(10);

    // per-particle data
    const px  = new Float32Array(N);
    const py  = new Float32Array(N);
    const pvx = new Float32Array(N);
    const pvy = new Float32Array(N);
    const ptx = new Float32Array(N);
    const pty = new Float32Array(N);
    // size category: 0=tiny(1px arc), 1=small sprite, 2=large sprite
    const pcat = new Uint8Array(N);
    // base alpha 0-255
    const palpha = new Uint8Array(N);

    function resize() {
      W = main.offsetWidth;  H = main.offsetHeight;
      main.width  = W * devicePixelRatio;
      main.height = H * devicePixelRatio;
      glow.width  = Math.round(W * devicePixelRatio * 0.35);
      glow.height = Math.round(H * devicePixelRatio * 0.35);
      mCtx.scale(devicePixelRatio, devicePixelRatio);
      gCtx.scale(devicePixelRatio * 0.35, devicePixelRatio * 0.35);
    }
    resize();

    for (let i = 0; i < N; i++) {
      const a = Math.random() * TAU;
      const r = 15 + Math.random() * Math.min(W, H) * 0.20;
      px[i]  = W / 2 + r * Math.cos(a);
      py[i]  = H / 2 + r * Math.sin(a);
      pvx[i] = (Math.random() - 0.5) * 0.8;
      pvy[i] = (Math.random() - 0.5) * 0.8;
      // 60% tiny dots, 28% small sprites, 12% large sprites
      const rr = Math.random();
      pcat[i]   = rr < 0.60 ? 0 : rr < 0.88 ? 1 : 2;
      palpha[i] = 90 + (Math.random() * 110) | 0;
    }

    let phase  = PH_FLOW;
    let pFrame = 0;
    let patIdx = 0;
    let T      = 0;

    function assignPattern(idx: number) {
      const pts = PATTERNS[idx](W / 2, H / 2, Math.min(W, H) * 0.33);
      const order = Array.from({ length: N }, (_, i) => i);
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
        const r = Math.min(W, H) * (0.04 + Math.random() * 0.28);
        ptx[i] = W / 2 + r * Math.cos(a);
        pty[i] = H / 2 + r * Math.sin(a);
      }
    }
    assignScatter();

    // ── draw particles into a context ─────────────────────────────────────
    function renderParticles(c: CanvasRenderingContext2D, coordScale: number) {
      // tiny arc particles — batched into one path
      c.fillStyle = 'rgba(220,232,255,0.80)';
      c.beginPath();
      for (let i = 0; i < N; i++) {
        if (pcat[i] !== 0) continue;
        const x = px[i] / coordScale, y = py[i] / coordScale;
        c.moveTo(x + 1, y);
        c.arc(x, y, 1, 0, TAU);
      }
      c.fill();

      // sprite particles — small
      for (let i = 0; i < N; i++) {
        if (pcat[i] !== 1) continue;
        c.globalAlpha = palpha[i] / 255 * 0.78;
        const x = px[i] / coordScale, y = py[i] / coordScale;
        c.drawImage(SPRITE_SM, x - 3 / coordScale, y - 3 / coordScale,
                    6 / coordScale, 6 / coordScale);
      }
      // sprite particles — large
      for (let i = 0; i < N; i++) {
        if (pcat[i] !== 2) continue;
        c.globalAlpha = palpha[i] / 255 * 0.72;
        const x = px[i] / coordScale, y = py[i] / coordScale;
        c.drawImage(SPRITE_LG, x - 5 / coordScale, y - 5 / coordScale,
                    10 / coordScale, 10 / coordScale);
      }
      c.globalAlpha = 1;
    }

    // ── main loop ─────────────────────────────────────────────────────────
    function tick() {
      pFrame++; T += 0.004;   // very slow noise evolution

      // phase transitions
      if      (phase === PH_FLOW     && pFrame >= DUR_FLOW)     { phase = PH_FORMING;  pFrame = 0; assignPattern(patIdx); }
      else if (phase === PH_FORMING  && pFrame >= DUR_FORMING)  { phase = PH_HOLD;     pFrame = 0; }
      else if (phase === PH_HOLD     && pFrame >= DUR_HOLD)     { phase = PH_DISPERSE; pFrame = 0; assignScatter(); }
      else if (phase === PH_DISPERSE && pFrame >= DUR_DISPERSE) { phase = PH_FLOW;     pFrame = 0; patIdx = (patIdx + 1) % PATTERNS.length; }

      // ── physics ──────────────────────────────────────────────────────────
      const damp   = 0.93;      // high damping = fluid, heavy feel
      const maxSpd = 1.2;       // very slow max speed
      const jitter = 0.06;
      const cX = W / 2, cY = H / 2;

      for (let i = 0; i < N; i++) {
        const x = px[i], y = py[i];

        if (phase === PH_FLOW) {
          pvx[i] += fvx(x, y, T) * 0.12;
          pvy[i] += fvy(x, y, T) * 0.12;
          pvx[i] += (cX - x) * 0.00050;   // gentle center pull
          pvy[i] += (cY - y) * 0.00050;
          pvx[i] += (Math.random() - 0.5) * jitter;
          pvy[i] += (Math.random() - 0.5) * jitter;

        } else if (phase === PH_FORMING) {
          // stiffness eases in very slowly — feels like drifting toward shape
          const prog  = Math.min(1, pFrame / DUR_FORMING);
          const ease  = prog * prog * (3 - 2 * prog);   // smoothstep
          const stiff = 0.004 + ease * 0.018;
          pvx[i] += (ptx[i] - x) * stiff;
          pvy[i] += (pty[i] - y) * stiff;
          pvx[i] += (Math.random() - 0.5) * jitter * 0.35;
          pvy[i] += (Math.random() - 0.5) * jitter * 0.35;

        } else if (phase === PH_HOLD) {
          // hold with gentle breathing oscillation
          pvx[i] += (ptx[i] - x) * 0.14;
          pvy[i] += (pty[i] - y) * 0.14;
          const breathe = 0.006 * Math.sin(T * 2.8 + i * 0.009);
          pvx[i] += (x - cX) * breathe;
          pvy[i] += (y - cY) * breathe;
          pvx[i] += (Math.random() - 0.5) * 0.10;
          pvy[i] += (Math.random() - 0.5) * 0.10;

        } else {  // PH_DISPERSE
          const prog  = Math.min(1, pFrame / DUR_DISPERSE);
          const ease  = prog * (2 - prog);               // ease out
          const stiff = 0.004 + ease * 0.014;
          pvx[i] += (ptx[i] - x) * stiff;
          pvy[i] += (pty[i] - y) * stiff;
          pvx[i] += (Math.random() - 0.5) * jitter * 0.5;
          pvy[i] += (Math.random() - 0.5) * jitter * 0.5;
        }

        pvx[i] *= damp; pvy[i] *= damp;
        const spd = Math.sqrt(pvx[i] * pvx[i] + pvy[i] * pvy[i]);
        if (spd > maxSpd) { const inv = maxSpd / spd; pvx[i] *= inv; pvy[i] *= inv; }
        px[i] += pvx[i]; py[i] += pvy[i];
      }

      // ── render ────────────────────────────────────────────────────────────

      // trail fade — very slow in flow/disperse for long liquid trails
      const trailA = phase === PH_HOLD     ? 0.45
                   : phase === PH_FORMING  ? 0.14
                   : 0.055;
      mCtx.fillStyle = `rgba(6,9,16,${trailA})`;
      mCtx.fillRect(0, 0, W, H);

      // ── glow layer: render to small canvas → blur → screen composite ─────
      gCtx.clearRect(0, 0, W, H);
      gCtx.globalAlpha = 0.60;
      renderParticles(gCtx, 1 / 0.35);
      gCtx.globalAlpha = 1;

      mCtx.save();
      mCtx.filter = 'blur(7px) brightness(1.8)';
      mCtx.globalCompositeOperation = 'screen';
      mCtx.globalAlpha = 0.70;
      mCtx.drawImage(glow, 0, 0, W, H);
      mCtx.restore();

      // ── sharp layer ───────────────────────────────────────────────────────
      mCtx.save();
      mCtx.globalAlpha = 0.88;
      renderParticles(mCtx, 1);
      mCtx.restore();

      animId = requestAnimationFrame(tick);
    }

    tick();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <canvas ref={glowRef} className="hidden" />
      <canvas ref={mainRef} className="w-full h-full" />
    </div>
  );
}
