import { useEffect, useRef } from 'react';

// ── Ribbon data ───────────────────────────────────────────────────────────────
// Anchors define the spine; each oscillates with sin waves → organic flow.
interface Anchor {
  bx: number; by: number;   // base position (0-1 of W/H)
  ax: number; ay: number;   // oscillation amplitude (0-1 of W/H)
  fx: number; fy: number;   // frequency multiplier
  px: number; py: number;   // phase offset
}

interface Ribbon {
  anchors: Anchor[];
  width:  number;           // base stroke width (px)
  r: number; g: number; b: number;
  alpha:  number;           // master opacity
  speed:  number;           // time scale
}

const RIBBONS: Ribbon[] = [
  // wide gold sweep across middle
  { width: 32, r:201, g:168, b:76,  alpha:0.55, speed:0.80,
    anchors:[
      {bx:-0.05,by:0.42,ax:0.00,ay:0.08,fx:0.6,fy:0.5,px:0.0,py:0.0},
      {bx: 0.25,by:0.38,ax:0.04,ay:0.12,fx:0.4,fy:0.7,px:1.0,py:2.1},
      {bx: 0.50,by:0.52,ax:0.05,ay:0.14,fx:0.5,fy:0.4,px:2.0,py:1.0},
      {bx: 0.75,by:0.44,ax:0.04,ay:0.10,fx:0.7,fy:0.6,px:0.5,py:3.2},
      {bx: 1.05,by:0.48,ax:0.00,ay:0.08,fx:0.6,fy:0.5,px:1.5,py:1.8},
    ]},
  // thin ivory ribbon, high
  { width:10, r:245, g:235, b:205, alpha:0.40, speed:1.10,
    anchors:[
      {bx:-0.05,by:0.20,ax:0.00,ay:0.07,fx:0.7,fy:0.8,px:3.1,py:0.5},
      {bx: 0.35,by:0.18,ax:0.05,ay:0.11,fx:0.8,fy:0.5,px:0.8,py:2.0},
      {bx: 0.65,by:0.28,ax:0.06,ay:0.13,fx:0.5,fy:0.9,px:1.6,py:0.9},
      {bx: 1.05,by:0.22,ax:0.00,ay:0.07,fx:0.6,fy:0.6,px:2.2,py:1.4},
    ]},
  // medium gold, lower third
  { width:20, r:220, g:172, b:55,  alpha:0.45, speed:0.68,
    anchors:[
      {bx:-0.05,by:0.65,ax:0.00,ay:0.10,fx:0.5,fy:0.7,px:1.2,py:2.5},
      {bx: 0.30,by:0.70,ax:0.05,ay:0.13,fx:0.7,fy:0.4,px:2.4,py:0.3},
      {bx: 0.58,by:0.60,ax:0.06,ay:0.16,fx:0.4,fy:0.8,px:0.6,py:1.7},
      {bx: 0.82,by:0.68,ax:0.04,ay:0.11,fx:0.8,fy:0.5,px:1.8,py:3.0},
      {bx: 1.05,by:0.63,ax:0.00,ay:0.09,fx:0.6,fy:0.7,px:0.2,py:0.8},
    ]},
  // diagonal accent, top-right → bottom-left
  { width: 7, r:240, g:205, b:90,  alpha:0.35, speed:1.25,
    anchors:[
      {bx: 1.05,by:0.10,ax:0.00,ay:0.05,fx:1.0,fy:0.7,px:0.3,py:1.1},
      {bx: 0.65,by:0.30,ax:0.06,ay:0.09,fx:0.6,fy:1.0,px:1.9,py:0.6},
      {bx: 0.30,by:0.52,ax:0.07,ay:0.12,fx:0.8,fy:0.5,px:0.7,py:2.2},
      {bx:-0.05,by:0.68,ax:0.00,ay:0.06,fx:0.5,fy:0.9,px:2.5,py:0.4},
    ]},
  // amber ribbon, near bottom
  { width:16, r:195, g:145, b:45,  alpha:0.35, speed:0.58,
    anchors:[
      {bx:-0.05,by:0.78,ax:0.00,ay:0.07,fx:0.9,fy:0.6,px:2.0,py:0.7},
      {bx: 0.38,by:0.82,ax:0.05,ay:0.09,fx:0.5,fy:0.8,px:0.4,py:1.5},
      {bx: 0.68,by:0.74,ax:0.06,ay:0.11,fx:0.7,fy:0.4,px:1.3,py:2.8},
      {bx: 1.05,by:0.79,ax:0.00,ay:0.07,fx:0.6,fy:0.7,px:3.0,py:1.0},
    ]},
  // fine thread near top
  { width: 5, r:255, g:245, b:200, alpha:0.30, speed:1.45,
    anchors:[
      {bx:-0.05,by:0.09,ax:0.00,ay:0.05,fx:0.8,fy:1.1,px:1.1,py:0.0},
      {bx: 0.40,by:0.13,ax:0.04,ay:0.08,fx:1.1,fy:0.6,px:0.5,py:1.9},
      {bx: 0.75,by:0.07,ax:0.05,ay:0.09,fx:0.6,fy:1.0,px:2.1,py:0.8},
      {bx: 1.05,by:0.11,ax:0.00,ay:0.05,fx:0.9,fy:0.7,px:0.9,py:2.3},
    ]},
];

// ── Catmull-Rom spline: smooth curve through control points ───────────────────
function crPoint(p0: number, p1: number, p2: number, p3: number, t: number) {
  return 0.5 * (
    2*p1 + (-p0+p2)*t + (2*p0-5*p1+4*p2-p3)*t*t + (-p0+3*p1-3*p2+p3)*t*t*t
  );
}

function buildSpine(anchors: Anchor[], W: number, H: number, T: number, speed: number) {
  return anchors.map(a => ({
    x: (a.bx + a.ax * Math.sin(T * speed * a.fx + a.px)) * W,
    y: (a.by + a.ay * Math.sin(T * speed * a.fy + a.py)) * H,
  }));
}

function strokeSpine(
  ctx: CanvasRenderingContext2D,
  pts: {x:number;y:number}[],
  lineWidth: number,
  style: string,
  alpha: number,
) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = style;
  ctx.lineWidth   = lineWidth;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';

  ctx.beginPath();
  const N = pts.length;
  const STEPS = 60;
  let first = true;
  for (let seg = 0; seg < N - 1; seg++) {
    const p0 = pts[Math.max(0,   seg-1)];
    const p1 = pts[seg];
    const p2 = pts[Math.min(N-1, seg+1)];
    const p3 = pts[Math.min(N-1, seg+2)];
    for (let s = 0; s <= STEPS; s++) {
      const t = s / STEPS;
      const x = crPoint(p0.x, p1.x, p2.x, p3.x, t);
      const y = crPoint(p0.y, p1.y, p2.y, p3.y, t);
      if (first) { ctx.moveTo(x, y); first = false; }
      else        ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

// ── Draw one ribbon as stacked strokes (outer body → inner body → highlight) ─
function drawRibbon(ctx: CanvasRenderingContext2D, def: Ribbon, W: number, H: number, T: number) {
  const pts = buildSpine(def.anchors, W, H, T, def.speed);
  const c   = `${def.r},${def.g},${def.b}`;
  const w   = def.width;
  const a   = def.alpha;

  // 1. Soft outer edge (wide, low opacity)
  strokeSpine(ctx, pts, w * 2.2, `rgba(${c},${(a * 0.22).toFixed(3)})`, 1);
  // 2. Main ribbon body
  strokeSpine(ctx, pts, w,       `rgba(${c},${(a * 0.75).toFixed(3)})`, 1);
  // 3. Inner bright stripe (silk sheen)
  strokeSpine(ctx, pts, w * 0.28, `rgba(255,250,220,${(a * 0.85).toFixed(3)})`, 1);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SilkRibbons() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const el = canvas;

    let W = 0, H = 0, animId = 0, T = 0;

    function resize() {
      W = el.offsetWidth  || window.innerWidth;
      H = el.offsetHeight || window.innerHeight;
      el.width  = Math.round(W * devicePixelRatio);
      el.height = Math.round(H * devicePixelRatio);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();

    function tick() {
      T += 0.004;
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
      style={{ filter: 'blur(1px) brightness(1.15)' }}
      aria-hidden="true"
    />
  );
}
