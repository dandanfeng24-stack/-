import { useEffect, useRef } from 'react';

// ── Ribbon definitions ────────────────────────────────────────────────────────
// Anchors are in normalised canvas coords (0-1).
// Each anchor oscillates independently → natural flowing motion.
interface Anchor {
  bx: number; by: number;   // base position
  ax: number; ay: number;   // oscillation amplitude
  fx: number; fy: number;   // frequency
  px: number; py: number;   // phase offset
}

interface RibbonDef {
  anchors: Anchor[];
  baseWidth: number;        // max width in pixels
  r: number; g: number; b: number;
  alpha: number;
  speed: number;            // time multiplier
}

const RIBBONS: RibbonDef[] = [
  // ── Wide sweeping gold ribbon across the middle
  {
    anchors: [
      { bx:-0.05, by:0.42,  ax:0.00, ay:0.08, fx:0.7, fy:0.5, px:0.0, py:0.0 },
      { bx: 0.25, by:0.38,  ax:0.03, ay:0.12, fx:0.5, fy:0.7, px:1.0, py:2.1 },
      { bx: 0.50, by:0.52,  ax:0.04, ay:0.14, fx:0.6, fy:0.4, px:2.0, py:1.0 },
      { bx: 0.75, by:0.44,  ax:0.03, ay:0.10, fx:0.8, fy:0.6, px:0.5, py:3.2 },
      { bx: 1.05, by:0.48,  ax:0.00, ay:0.08, fx:0.7, fy:0.5, px:1.5, py:1.8 },
    ],
    baseWidth: 38, r:201, g:168, b:76, alpha:0.38, speed:0.85,
  },
  // ── Thin bright ivory ribbon, high
  {
    anchors: [
      { bx:-0.05, by:0.20,  ax:0.00, ay:0.06, fx:0.6, fy:0.9, px:3.1, py:0.5 },
      { bx: 0.30, by:0.18,  ax:0.04, ay:0.10, fx:0.9, fy:0.5, px:0.8, py:2.0 },
      { bx: 0.60, by:0.28,  ax:0.05, ay:0.12, fx:0.5, fy:0.8, px:1.6, py:0.9 },
      { bx: 1.05, by:0.22,  ax:0.00, ay:0.07, fx:0.7, fy:0.6, px:2.2, py:1.4 },
    ],
    baseWidth: 14, r:245, g:238, b:210, alpha:0.30, speed:1.1,
  },
  // ── Medium gold ribbon, lower third
  {
    anchors: [
      { bx:-0.05, by:0.65,  ax:0.00, ay:0.10, fx:0.5, fy:0.7, px:1.2, py:2.5 },
      { bx: 0.28, by:0.70,  ax:0.05, ay:0.14, fx:0.8, fy:0.4, px:2.4, py:0.3 },
      { bx: 0.55, by:0.60,  ax:0.04, ay:0.16, fx:0.4, fy:0.9, px:0.6, py:1.7 },
      { bx: 0.80, by:0.68,  ax:0.03, ay:0.11, fx:0.9, fy:0.5, px:1.8, py:3.0 },
      { bx: 1.05, by:0.63,  ax:0.00, ay:0.09, fx:0.6, fy:0.7, px:0.2, py:0.8 },
    ],
    baseWidth: 24, r:220, g:175, b:60, alpha:0.30, speed:0.70,
  },
  // ── Very thin gold accent, crossing from top-right
  {
    anchors: [
      { bx: 1.05, by:0.08,  ax:0.00, ay:0.05, fx:1.1, fy:0.7, px:0.3, py:1.1 },
      { bx: 0.70, by:0.25,  ax:0.06, ay:0.09, fx:0.6, fy:1.0, px:1.9, py:0.6 },
      { bx: 0.35, by:0.48,  ax:0.07, ay:0.12, fx:0.8, fy:0.5, px:0.7, py:2.2 },
      { bx:-0.05, by:0.62,  ax:0.00, ay:0.06, fx:0.5, fy:0.9, px:2.5, py:0.4 },
    ],
    baseWidth: 8, r:240, g:200, b:90, alpha:0.25, speed:1.3,
  },
  // ── Wide amber ribbon, lower sweep
  {
    anchors: [
      { bx:-0.05, by:0.78,  ax:0.00, ay:0.07, fx:0.9, fy:0.6, px:2.0, py:0.7 },
      { bx: 0.35, by:0.82,  ax:0.04, ay:0.09, fx:0.5, fy:0.8, px:0.4, py:1.5 },
      { bx: 0.65, by:0.74,  ax:0.05, ay:0.11, fx:0.7, fy:0.4, px:1.3, py:2.8 },
      { bx: 1.05, by:0.79,  ax:0.00, ay:0.07, fx:0.6, fy:0.7, px:3.0, py:1.0 },
    ],
    baseWidth: 20, r:195, g:145, b:50, alpha:0.22, speed:0.60,
  },
  // ── Fine thread accent, near top
  {
    anchors: [
      { bx:-0.05, by:0.08,  ax:0.00, ay:0.04, fx:0.8, fy:1.2, px:1.1, py:0.0 },
      { bx: 0.40, by:0.12,  ax:0.03, ay:0.08, fx:1.2, fy:0.6, px:0.5, py:1.9 },
      { bx: 0.75, by:0.06,  ax:0.04, ay:0.09, fx:0.6, fy:1.0, px:2.1, py:0.8 },
      { bx: 1.05, by:0.11,  ax:0.00, ay:0.05, fx:0.9, fy:0.7, px:0.9, py:2.3 },
    ],
    baseWidth: 6, r:255, g:245, b:200, alpha:0.18, speed:1.5,
  },
];

// ── Catmull-Rom spline helpers ────────────────────────────────────────────────
function catmullPoint(p0: number, p1: number, p2: number, p3: number, t: number): number {
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2*p0 - 5*p1 + 4*p2 - p3) * t*t +
    (-p0 + 3*p1 - 3*p2 + p3) * t*t*t
  );
}

function sampleSpline(pts: { x: number; y: number }[], samples: number) {
  const out: { x: number; y: number }[] = [];
  const n = pts.length;
  for (let s = 0; s <= samples; s++) {
    const u = (s / samples) * (n - 1);
    const i = Math.min(Math.floor(u), n - 2);
    const t = u - i;
    const i0 = Math.max(0, i - 1);
    const i2 = Math.min(n - 1, i + 1);
    const i3 = Math.min(n - 1, i + 2);
    out.push({
      x: catmullPoint(pts[i0].x, pts[i].x, pts[i2].x, pts[i3].x, t),
      y: catmullPoint(pts[i0].y, pts[i].y, pts[i2].y, pts[i3].y, t),
    });
  }
  return out;
}

// ── Draw a single ribbon ──────────────────────────────────────────────────────
function drawRibbon(
  ctx: CanvasRenderingContext2D,
  def: RibbonDef,
  W: number, H: number,
  T: number,
) {
  const SAMPLES = 80;

  // Animated spine points
  const spine = def.anchors.map(a => ({
    x: (a.bx + a.ax * Math.sin(T * def.speed * a.fx + a.px)) * W,
    y: (a.by + a.ay * Math.sin(T * def.speed * a.fy + a.py)) * H,
  }));

  const pts = sampleSpline(spine, SAMPLES);

  // Build ribbon edges using normals
  const left: { x: number; y: number }[]  = [];
  const right: { x: number; y: number }[] = [];

  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const tx = next.x - prev.x, ty = next.y - prev.y;
    const len = Math.sqrt(tx*tx + ty*ty) || 1;
    const nx = -ty / len, ny = tx / len;   // normal (perpendicular)

    // Width tapers at ends, slightly wider in middle
    const t = i / (pts.length - 1);
    const taper = Math.sin(t * Math.PI);   // 0 → 1 → 0
    const halfW = def.baseWidth * 0.5 * (0.3 + 0.7 * taper);

    left.push({ x: pts[i].x + nx * halfW, y: pts[i].y + ny * halfW });
    right.push({ x: pts[i].x - nx * halfW, y: pts[i].y - ny * halfW });
  }

  // ── Outer glow pass ───────────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = def.alpha * 0.30;
  ctx.filter = `blur(${def.baseWidth * 0.45}px)`;
  ctx.fillStyle = `rgb(${def.r},${def.g},${def.b})`;
  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for (let i = 1; i < left.length; i++) ctx.lineTo(left[i].x, left[i].y);
  for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // ── Main ribbon body ──────────────────────────────────────────────────────
  // Gradient from edge (darker) → center highlight → edge (darker)
  const midX = (pts[Math.floor(SAMPLES/2)].x),
        midY = (pts[Math.floor(SAMPLES/2)].y);
  const n2x  = left[Math.floor(SAMPLES/2)].x - right[Math.floor(SAMPLES/2)].x;
  const n2y  = left[Math.floor(SAMPLES/2)].y - right[Math.floor(SAMPLES/2)].y;
  const grad = ctx.createLinearGradient(
    right[Math.floor(SAMPLES/2)].x, right[Math.floor(SAMPLES/2)].y,
    left[Math.floor(SAMPLES/2)].x,  left[Math.floor(SAMPLES/2)].y,
  );
  void midX; void midY; void n2x; void n2y;
  grad.addColorStop(0.00, `rgba(${def.r*0.5|0},${def.g*0.5|0},${def.b*0.4|0},0)`);
  grad.addColorStop(0.20, `rgba(${def.r},${def.g},${def.b},${def.alpha * 0.7})`);
  grad.addColorStop(0.48, `rgba(${Math.min(255,def.r+40)},${Math.min(255,def.g+30)},${Math.min(255,def.b+20)},${def.alpha})`);
  grad.addColorStop(0.58, `rgba(255,248,220,${def.alpha * 0.85})`);  // silk highlight
  grad.addColorStop(0.78, `rgba(${def.r},${def.g},${def.b},${def.alpha * 0.65})`);
  grad.addColorStop(1.00, `rgba(${def.r*0.5|0},${def.g*0.5|0},${def.b*0.4|0},0)`);

  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for (let i = 1; i < left.length; i++) ctx.lineTo(left[i].x, left[i].y);
  for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // ── Fine bright centerline (sheen highlight) ──────────────────────────────
  ctx.save();
  ctx.globalAlpha = def.alpha * 0.55;
  ctx.strokeStyle = `rgba(255,250,225,0.9)`;
  ctx.lineWidth   = Math.max(0.5, def.baseWidth * 0.06);
  ctx.lineCap = 'round';
  ctx.beginPath();
  // offset slightly toward the light source side
  const sheen = pts.map((p, i) => {
    const lx = left[i].x, ly = left[i].y;
    return { x: p.x * 0.35 + lx * 0.65, y: p.y * 0.35 + ly * 0.65 };
  });
  ctx.moveTo(sheen[0].x, sheen[0].y);
  for (let i = 1; i < sheen.length; i++) ctx.lineTo(sheen[i].x, sheen[i].y);
  ctx.stroke();
  ctx.restore();
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SilkRibbons() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let W = 0, H = 0, animId = 0, T = 0;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();

    function tick() {
      T += 0.004;   // very slow — full revolution takes ~26 minutes
      ctx.clearRect(0, 0, W, H);
      for (const def of RIBBONS) drawRibbon(ctx, def, W, H, T);
      animId = requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
