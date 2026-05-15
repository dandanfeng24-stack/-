import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

// ── Visual layers ─────────────────────────────────────────────────────────────
// Each has different size, speed, inertia — like real droplets of different mass
const LAYERS = [
  { n: 60,   rMin: 16, rMax: 22, maxSpd: 0.55, damp: 0.96, jitter: 0.025 },  // hero drops
  { n: 200,  rMin:  8, rMax: 13, maxSpd: 0.90, damp: 0.94, jitter: 0.040 },  // medium
  { n: 900,  rMin:  3, rMax:  5, maxSpd: 1.30, damp: 0.92, jitter: 0.060 },  // small
  { n: 8840, rMin:  1, rMax:  1, maxSpd: 1.60, damp: 0.90, jitter: 0.080 },  // dust
] as const;
const N = LAYERS.reduce((s, l) => s + l.n, 0); // 10000

// ── Phase constants ───────────────────────────────────────────────────────────
const PH_FLOW = 0, PH_FORMING = 1, PH_HOLD = 2, PH_DISPERSE = 3;
const DUR = [500, 500, 300, 450];   // frames per phase (~8s, 8s, 5s, 7.5s at 60fps)

// ── Build a 3D water-droplet sprite using Phong-style shading ─────────────────
function makeDropletSprite(diameter: number): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = cv.height = diameter;
  const g = cv.getContext('2d') as CanvasRenderingContext2D;
  const r = diameter / 2, cx = r, cy = r;

  // clip to circle
  g.save();
  g.beginPath(); g.arc(cx, cy, r - 0.5, 0, TAU); g.clip();

  // 1. Base body – dark water-blue tint
  g.fillStyle = 'rgba(18,35,75,0.18)';
  g.fillRect(0, 0, diameter, diameter);

  // 2. Diffuse light from upper-left (main illumination)
  const diff = g.createRadialGradient(cx - r * 0.4, cy - r * 0.42, 0, cx + r * 0.1, cy + r * 0.1, r * 1.1);
  diff.addColorStop(0.00, 'rgba(215,228,255,0.72)');
  diff.addColorStop(0.42, 'rgba(165,188,235,0.42)');
  diff.addColorStop(0.80, 'rgba(90,120,195,0.12)');
  diff.addColorStop(1.00, 'rgba(50,80,160,0.00)');
  g.fillStyle = diff; g.fillRect(0, 0, diameter, diameter);

  // 3. Shadow – lower-right darkening
  const shad = g.createRadialGradient(cx + r * 0.35, cy + r * 0.40, r * 0.15, cx, cy, r);
  shad.addColorStop(0.00, 'rgba(0,8,30,0.00)');
  shad.addColorStop(0.55, 'rgba(0,8,30,0.00)');
  shad.addColorStop(0.88, 'rgba(0,8,30,0.50)');
  shad.addColorStop(1.00, 'rgba(0,8,30,0.30)');
  g.fillStyle = shad; g.fillRect(0, 0, diameter, diameter);

  // 4. Primary specular highlight (large soft lobe, top-left)
  const sx = cx - r * 0.30, sy = cy - r * 0.32;
  const spec1 = g.createRadialGradient(sx, sy, 0, sx, sy, r * 0.50);
  spec1.addColorStop(0.00, 'rgba(255,255,255,1.00)');
  spec1.addColorStop(0.30, 'rgba(255,255,255,0.80)');
  spec1.addColorStop(0.65, 'rgba(255,255,255,0.28)');
  spec1.addColorStop(1.00, 'rgba(255,255,255,0.00)');
  g.fillStyle = spec1; g.fillRect(0, 0, diameter, diameter);

  // 5. Pinpoint specular (hot-spot, sharp)
  const sx2 = cx - r * 0.20, sy2 = cy - r * 0.24;
  const spec2 = g.createRadialGradient(sx2, sy2, 0, sx2, sy2, r * 0.13);
  spec2.addColorStop(0.00, 'rgba(255,255,255,1.00)');
  spec2.addColorStop(0.60, 'rgba(255,255,255,0.85)');
  spec2.addColorStop(1.00, 'rgba(255,255,255,0.00)');
  g.fillStyle = spec2; g.fillRect(0, 0, diameter, diameter);

  // 6. Secondary specular (small, offset right)
  const sx3 = cx + r * 0.18, sy3 = cy - r * 0.15;
  const spec3 = g.createRadialGradient(sx3, sy3, 0, sx3, sy3, r * 0.09);
  spec3.addColorStop(0, 'rgba(255,255,255,0.80)');
  spec3.addColorStop(1, 'rgba(255,255,255,0.00)');
  g.fillStyle = spec3; g.fillRect(0, 0, diameter, diameter);

  // 7. Rim light (cool blue-white on lower-left edge, like ambient occlusion bounce)
  const rim = g.createRadialGradient(cx - r * 0.5, cy + r * 0.55, r * 0.55, cx, cy, r);
  rim.addColorStop(0.00, 'rgba(140,200,255,0.00)');
  rim.addColorStop(0.72, 'rgba(140,200,255,0.00)');
  rim.addColorStop(0.88, 'rgba(175,220,255,0.32)');
  rim.addColorStop(1.00, 'rgba(140,200,255,0.00)');
  g.fillStyle = rim; g.fillRect(0, 0, diameter, diameter);

  g.restore();
  return cv;
}

// ── Pre-render sprites (built lazily after canvas is in DOM) ──────────────────
let SPRITE_HERO:   HTMLCanvasElement | null = null;
let SPRITE_MEDIUM: HTMLCanvasElement | null = null;

function ensureSprites() {
  if (!SPRITE_HERO) {
    SPRITE_HERO   = makeDropletSprite(44);
    SPRITE_MEDIUM = makeDropletSprite(22);
  }
}

// ── Pattern generators (Float32Array [x0,y0, x1,y1, …] length N*2) ───────────
function patternPlum(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2); let idx = 0;
  const petals = 5, pOff = sc * 0.55, pRad = sc * 0.42;
  const nc = Math.floor(N * 0.08);
  for (let i = 0; i < nc; i++) {
    const t = (i / nc) * TAU, ring = (i % 14) / 14;
    out[idx++] = cx + pRad * 0.18 * ring * Math.cos(t);
    out[idx++] = cy + pRad * 0.18 * ring * Math.sin(t);
  }
  const np = Math.floor((N - nc) / petals);
  for (let p = 0; p < petals; p++) {
    const ba = (p / petals) * TAU - Math.PI / 2;
    const pcx = cx + pOff * 0.52 * Math.cos(ba), pcy = cy + pOff * 0.52 * Math.sin(ba);
    for (let i = 0; i < np; i++) {
      const t = (i / np) * TAU, ring = (i % 18) / 18;
      const r = pRad * 0.46 * ring * (0.52 + 0.48 * Math.cos(t));
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
    const off = (pass - 2) * 0.013;
    for (let i = 0; i < pp; i++) {
      const t = (i / pp) * TAU + off;
      const r = sc * 0.35 * (Math.exp(Math.sin(t)) - 2 * Math.cos(4 * t) +
        Math.pow(Math.sin((2 * t - Math.PI) / 24), 5));
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
        const t = (i / pp) * TAU, ring = (i % 14) / 14;
        const a = rp * ring * (0.32 + 0.68 * Math.abs(Math.cos(t)));
        const b = rp * 0.38 * ring * (0.32 + 0.68 * Math.abs(Math.sin(t)));
        out[idx++] = pcx + a * Math.cos(t) * Math.cos(ba) - b * Math.sin(t) * Math.sin(ba);
        out[idx++] = pcy + a * Math.cos(t) * Math.sin(ba) + b * Math.sin(t) * Math.cos(ba);
      }
    }
  };
  const nc = Math.floor(N * 0.07);
  for (let i = 0; i < nc; i++) {
    const t = (i / nc) * TAU, r = sc * 0.09 * ((i % 10) / 10);
    out[idx++] = cx + r * Math.cos(t); out[idx++] = cy + r * Math.sin(t);
  }
  addRing(Math.floor(N * 0.36), 8, sc * 0.28, sc * 0.25, 0);
  addRing(Math.floor(N * 0.54), 8, sc * 0.54, sc * 0.37, Math.PI / 8);
  while (idx < N * 2 - 1) { out[idx++] = cx; out[idx++] = cy; }
  return out;
}

function patternPhoenix(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2);
  const arms = 3, passes = 4, ppAP = Math.floor(N / (arms * passes));
  for (let arm = 0; arm < arms; arm++) {
    const ba = (arm / arms) * TAU - Math.PI / 2;
    for (let pass = 0; pass < passes; pass++) {
      const radOff = (pass - 1.5) * sc * 0.020;
      for (let i = 0; i < ppAP; i++) {
        const frac = i / ppAP, angle = ba + frac * 2.5 * Math.PI;
        const r = sc * 0.07 + sc * 0.66 * frac + radOff;
        const wave = sc * 0.022 * Math.sin(frac * TAU * 3.5);
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
function nvx(x: number, y: number, t: number) {
  return Math.sin(x * 0.0020 + t * 0.29) * Math.cos(y * 0.0016 + t * 0.13) * 1.2
       + Math.sin(x * 0.0050 - y * 0.0038 + t * 0.20) * 0.65
       + Math.cos(x * 0.0009 + y * 0.0012 + t * 0.38) * 0.75;
}
function nvy(x: number, y: number, t: number) {
  return Math.cos(x * 0.0018 + t * 0.26) * Math.sin(y * 0.0022 - t * 0.15) * 1.2
       + Math.cos(x * 0.0045 + y * 0.0032 + t * 0.17) * 0.65
       + Math.sin(x * 0.0010 - y * 0.0016 + t * 0.33) * 0.75;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ParticleCanvas() {
  const mainRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    ensureSprites();
    const main = mainRef.current!, glow = glowRef.current!;
    const mCtx = main.getContext('2d') as CanvasRenderingContext2D;
    const gCtx = glow.getContext('2d') as CanvasRenderingContext2D;

    let W = 0, H = 0, animId = 0;

    function resize() {
      W = main.offsetWidth; H = main.offsetHeight;
      main.width  = W * devicePixelRatio; main.height  = H * devicePixelRatio;
      glow.width  = Math.round(W * devicePixelRatio * 0.35);
      glow.height = Math.round(H * devicePixelRatio * 0.35);
      mCtx.scale(devicePixelRatio, devicePixelRatio);
      gCtx.scale(devicePixelRatio * 0.35, devicePixelRatio * 0.35);
    }
    resize();

    // ── Per-particle state ───────────────────────────────────────────────────
    const px  = new Float32Array(N); const py  = new Float32Array(N);
    const pvx = new Float32Array(N); const pvy = new Float32Array(N);
    const ptx = new Float32Array(N); const pty = new Float32Array(N);
    const prad = new Float32Array(N);   // render radius
    const pcat = new Uint8Array(N);     // layer category 0-3
    const palpha = new Float32Array(N); // base alpha 0-1

    // build category + radius arrays
    let offset = 0;
    for (let li = 0; li < LAYERS.length; li++) {
      const L = LAYERS[li];
      for (let k = 0; k < L.n; k++, offset++) {
        pcat[offset]   = li;
        const t = k / Math.max(1, L.n - 1);
        prad[offset]   = L.rMin + t * (L.rMax - L.rMin);
        palpha[offset] = 0.55 + Math.random() * 0.45;
      }
    }

    // initial positions — cloud near center
    for (let i = 0; i < N; i++) {
      const a = Math.random() * TAU;
      const r = 10 + Math.random() * Math.min(W, H) * 0.22;
      px[i] = W / 2 + r * Math.cos(a);
      py[i] = H / 2 + r * Math.sin(a);
      const spd = LAYERS[pcat[i]].maxSpd * 0.3;
      pvx[i] = (Math.random() - 0.5) * spd;
      pvy[i] = (Math.random() - 0.5) * spd;
    }

    let phase = PH_FLOW, pFrame = 0, patIdx = 0, T = 0;

    function assignPattern(idx: number) {
      const pts  = PATTERNS[idx](W / 2, H / 2, Math.min(W, H) * 0.32);
      const ord  = Array.from({ length: N }, (_, i) => i);
      for (let i = N - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        const tmp = ord[i]; ord[i] = ord[j]; ord[j] = tmp;
      }
      for (let i = 0; i < N; i++) {
        ptx[ord[i]] = pts[i * 2]; pty[ord[i]] = pts[i * 2 + 1];
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

    // ── Render ───────────────────────────────────────────────────────────────
    function renderAll(c: CanvasRenderingContext2D, scale: number) {
      // dust: single batched arc path
      c.fillStyle = 'rgba(215,228,255,0.72)';
      c.beginPath();
      for (let i = 0; i < N; i++) {
        if (pcat[i] !== 3) continue;
        const x = px[i] / scale, y = py[i] / scale;
        c.moveTo(x + 1, y); c.arc(x, y, 1, 0, TAU);
      }
      c.fill();

      // small (cat 2): batched arc, slightly larger
      c.fillStyle = 'rgba(230,238,255,0.80)';
      c.beginPath();
      for (let i = 0; i < N; i++) {
        if (pcat[i] !== 2) continue;
        const x = px[i] / scale, y = py[i] / scale;
        const r = prad[i] / scale;
        c.moveTo(x + r, y); c.arc(x, y, r, 0, TAU);
      }
      c.fill();

      // medium (cat 1): sprite with per-particle alpha
      for (let i = 0; i < N; i++) {
        if (pcat[i] !== 1) continue;
        const d  = prad[i] * 2 / scale;
        const x  = px[i] / scale - d / 2;
        const y  = py[i] / scale - d / 2;
        c.globalAlpha = palpha[i] * 0.82;
        c.drawImage(SPRITE_MEDIUM!, x, y, d, d);
      }

      // hero (cat 0): large 3D spheres, drawn last (on top)
      for (let i = 0; i < N; i++) {
        if (pcat[i] !== 0) continue;
        const d  = prad[i] * 2 / scale;
        const x  = px[i] / scale - d / 2;
        const y  = py[i] / scale - d / 2;
        c.globalAlpha = palpha[i] * 0.90;
        c.drawImage(SPRITE_HERO!, x, y, d, d);
      }

      c.globalAlpha = 1;
    }

    // ── Physics ───────────────────────────────────────────────────────────────
    function tick() {
      pFrame++; T += 0.0038;

      if      (phase === PH_FLOW     && pFrame >= DUR[0]) { phase = PH_FORMING;  pFrame = 0; assignPattern(patIdx); }
      else if (phase === PH_FORMING  && pFrame >= DUR[1]) { phase = PH_HOLD;     pFrame = 0; }
      else if (phase === PH_HOLD     && pFrame >= DUR[2]) { phase = PH_DISPERSE; pFrame = 0; assignScatter(); }
      else if (phase === PH_DISPERSE && pFrame >= DUR[3]) { phase = PH_FLOW;     pFrame = 0; patIdx = (patIdx + 1) % PATTERNS.length; }

      const cX = W / 2, cY = H / 2;

      for (let i = 0; i < N; i++) {
        const L    = LAYERS[pcat[i]];
        const x    = px[i], y = py[i];

        if (phase === PH_FLOW) {
          // heavier particles respond less to noise (more inertia feel)
          const noiseMul = 0.06 + (3 - pcat[i]) * 0.025;
          pvx[i] += nvx(x, y, T) * noiseMul;
          pvy[i] += nvy(x, y, T) * noiseMul;
          pvx[i] += (cX - x) * 0.00045;
          pvy[i] += (cY - y) * 0.00045;
          pvx[i] += (Math.random() - 0.5) * L.jitter;
          pvy[i] += (Math.random() - 0.5) * L.jitter;

        } else if (phase === PH_FORMING) {
          const prog  = Math.min(1, pFrame / DUR[1]);
          const ease  = prog * prog * (3 - 2 * prog);        // smoothstep
          // lighter particles attract faster; heavier ones lag behind
          const stiff = (0.003 + ease * 0.016) * (0.5 + 0.5 * (3 - pcat[i]) / 3);
          pvx[i] += (ptx[i] - x) * stiff;
          pvy[i] += (pty[i] - y) * stiff;
          pvx[i] += (Math.random() - 0.5) * L.jitter * 0.3;
          pvy[i] += (Math.random() - 0.5) * L.jitter * 0.3;

        } else if (phase === PH_HOLD) {
          pvx[i] += (ptx[i] - x) * 0.12;
          pvy[i] += (pty[i] - y) * 0.12;
          const breath = 0.005 * Math.sin(T * 2.5 + i * 0.008);
          pvx[i] += (x - cX) * breath;
          pvy[i] += (y - cY) * breath;
          pvx[i] += (Math.random() - 0.5) * L.jitter * 0.35;
          pvy[i] += (Math.random() - 0.5) * L.jitter * 0.35;

        } else { // PH_DISPERSE
          const prog  = Math.min(1, pFrame / DUR[3]);
          const ease  = prog * (2 - prog);
          const stiff = (0.003 + ease * 0.012) * (0.5 + 0.5 * (3 - pcat[i]) / 3);
          pvx[i] += (ptx[i] - x) * stiff;
          pvy[i] += (pty[i] - y) * stiff;
          pvx[i] += (Math.random() - 0.5) * L.jitter * 0.45;
          pvy[i] += (Math.random() - 0.5) * L.jitter * 0.45;
        }

        pvx[i] *= L.damp; pvy[i] *= L.damp;
        const spd = Math.sqrt(pvx[i] * pvx[i] + pvy[i] * pvy[i]);
        if (spd > L.maxSpd) { const inv = L.maxSpd / spd; pvx[i] *= inv; pvy[i] *= inv; }
        px[i] += pvx[i]; py[i] += pvy[i];
      }

      // ── Render ────────────────────────────────────────────────────────────

      // trail fade — very low alpha keeps motion history, creates liquid ghost trails
      const trailA = phase === PH_HOLD ? 0.48 : phase === PH_FORMING ? 0.15 : 0.055;
      mCtx.fillStyle = `rgba(6,9,16,${trailA})`;
      mCtx.fillRect(0, 0, W, H);

      // bloom pass: render to low-res glow canvas, blur, screen-composite
      gCtx.clearRect(0, 0, W, H);
      gCtx.globalAlpha = 0.58;
      renderAll(gCtx, 1 / 0.35);
      gCtx.globalAlpha = 1;

      mCtx.save();
      mCtx.filter = 'blur(8px) brightness(1.9)';
      mCtx.globalCompositeOperation = 'screen';
      mCtx.globalAlpha = 0.68;
      mCtx.drawImage(glow, 0, 0, W, H);
      mCtx.restore();

      // sharp pass
      mCtx.save();
      renderAll(mCtx, 1);
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
