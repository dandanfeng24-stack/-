import { useEffect, useRef } from 'react';

// ── Pattern generators ────────────────────────────────────────────────────────
function rosePattern(cx: number, cy: number, scale: number, n: number): [number, number][] {
  // Rose curve r = cos(4θ) → 8 petals
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const r = scale * Math.abs(Math.cos(4 * t));
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  }
  return pts;
}

function butterflyPattern(cx: number, cy: number, scale: number, n: number): [number, number][] {
  // Butterfly curve: r = e^sin(θ) - 2cos(4θ) + sin⁵((2θ-π)/24)
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const r = scale * 0.35 * (
      Math.exp(Math.sin(t)) -
      2 * Math.cos(4 * t) +
      Math.pow(Math.sin((2 * t - Math.PI) / 24), 5)
    );
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  }
  return pts;
}

function phoenixPattern(cx: number, cy: number, scale: number, n: number): [number, number][] {
  // Three-arm spiral (phoenix tail feathers)
  const pts: [number, number][] = [];
  const arms = 3;
  for (let i = 0; i < n; i++) {
    const arm = i % arms;
    const frac = Math.floor(i / arms) / Math.floor(n / arms);
    const baseAngle = (arm * 2 * Math.PI) / arms - Math.PI / 2;
    const angle = baseAngle + frac * 2.8 * Math.PI;
    const r = scale * 0.12 + scale * 0.62 * frac;
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return pts;
}

function peonyPattern(cx: number, cy: number, scale: number, n: number): [number, number][] {
  // Layered concentric petals (牡丹)
  const pts: [number, number][] = [];
  const layers = 5;
  const perLayer = Math.floor(n / layers);
  for (let l = 0; l < layers; l++) {
    const r = scale * ((l + 1) / layers) * 0.85;
    const petals = 6 + l * 2;
    const count = l === layers - 1 ? n - pts.length : perLayer;
    for (let i = 0; i < count; i++) {
      const t = (i / perLayer) * 2 * Math.PI;
      const petal = Math.cos(petals * t * 0.5);
      const rr = r * (0.75 + 0.25 * petal);
      pts.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]);
    }
  }
  return pts;
}

// ── Main component ────────────────────────────────────────────────────────────
const PATTERNS = [rosePattern, butterflyPattern, phoenixPattern, peonyPattern];
const PATTERN_NAMES = ['玫瑰', '蝴蝶', '凤凰', '牡丹'];
const COLORS = [
  '#C9A84C', '#C9A84C', '#C9A84C',
  '#F4D03F', '#E8C060',
  '#C0392B', '#E74C3C',
  '#F0E6C8', '#E8DCC8',
];

interface Particle {
  x: number; y: number;
  tx: number; ty: number;
  vx: number; vy: number;
  color: string;
  size: number;
  alpha: number;
  twinkleOffset: number;
  twinkleSpeed: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let animId: number;
    let W = 0, H = 0;
    const N = 500;

    function resize() {
      W = canvas!.offsetWidth;
      H = canvas!.offsetHeight;
      canvas!.width = W * devicePixelRatio;
      canvas!.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();

    // Init particles scattered across screen
    const particles: Particle[] = Array.from({ length: N }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tx: W / 2, ty: H / 2,
      vx: 0, vy: 0,
      color: COLORS[i % COLORS.length],
      size: 1.2 + (i % 5) * 0.5,
      alpha: 0.6 + (i % 4) * 0.1,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.03 + Math.random() * 0.04,
    }));

    // Cycle state
    const PHASES = { FORMING: 0, HOLD: 1, SCATTERING: 2 };
    let phase = PHASES.FORMING;
    let patternIdx = 0;
    let frame = 0;

    const FORM_FRAMES = 160;
    const HOLD_FRAMES = 110;
    const SCATTER_FRAMES = 70;

    function setTargets(idx: number) {
      const scale = Math.min(W, H) * 0.36;
      const pts = PATTERNS[idx](W / 2, H / 2, scale, N);
      // Nearest-neighbor assignment for smoother morph (simplified: sort by angle)
      pts.sort((a, b) => Math.atan2(a[1] - H / 2, a[0] - W / 2) - Math.atan2(b[1] - H / 2, b[0] - W / 2));
      for (let i = 0; i < N; i++) {
        particles[i].tx = pts[i][0];
        particles[i].ty = pts[i][1];
      }
    }

    function scatterTargets() {
      for (const p of particles) {
        const angle = Math.random() * Math.PI * 2;
        const r = 0.3 * Math.min(W, H) + Math.random() * Math.max(W, H) * 0.55;
        p.tx = W / 2 + r * Math.cos(angle);
        p.ty = H / 2 + r * Math.sin(angle);
      }
    }

    setTargets(0);

    let labelAlpha = 0;
    let labelFadeIn = true;

    function tick() {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Phase transitions
      if (phase === PHASES.FORMING && frame >= FORM_FRAMES) {
        phase = PHASES.HOLD;
        frame = 0;
        labelFadeIn = true;
      } else if (phase === PHASES.HOLD && frame >= HOLD_FRAMES) {
        phase = PHASES.SCATTERING;
        frame = 0;
        labelFadeIn = false;
        scatterTargets();
      } else if (phase === PHASES.SCATTERING && frame >= SCATTER_FRAMES) {
        phase = PHASES.FORMING;
        frame = 0;
        patternIdx = (patternIdx + 1) % PATTERNS.length;
        setTargets(patternIdx);
      }

      // Label fade
      if (phase === PHASES.HOLD) {
        if (labelFadeIn) labelAlpha = Math.min(1, labelAlpha + 0.03);
      } else {
        labelAlpha = Math.max(0, labelAlpha - 0.05);
      }

      // Spring coefficient per phase
      const stiffness =
        phase === PHASES.FORMING ? 0.055 :
        phase === PHASES.SCATTERING ? 0.04 : 0;
      const damping = 0.82;

      // Draw particles
      for (let i = 0; i < N; i++) {
        const p = particles[i];

        // Spring physics toward target
        if (phase !== PHASES.HOLD) {
          p.vx += (p.tx - p.x) * stiffness;
          p.vy += (p.ty - p.y) * stiffness;
        }

        // Slight organic turbulence always present
        p.vx += (Math.random() - 0.5) * 0.25;
        p.vy += (Math.random() - 0.5) * 0.25;

        // Extra flutter when held
        if (phase === PHASES.HOLD) {
          p.vx += (Math.random() - 0.5) * 0.6;
          p.vy += (Math.random() - 0.5) * 0.6;
          p.vx *= 0.7;
          p.vy *= 0.7;
        }

        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;

        // Twinkle alpha
        const twinkle = 0.75 + 0.25 * Math.sin(Date.now() * p.twinkleSpeed * 0.001 + p.twinkleOffset);
        const a = p.alpha * twinkle;

        // Glow halo
        ctx.save();
        ctx.globalAlpha = a * 0.35;
        ctx.shadowBlur = 0;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        g.addColorStop(0, p.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Core dot with shadow glow
        ctx.save();
        ctx.globalAlpha = a;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 6;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Pattern name label
      if (labelAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = labelAlpha * 0.55;
        ctx.font = `bold ${Math.min(W, H) * 0.06}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#C9A84C';
        ctx.shadowColor = '#C9A84C';
        ctx.shadowBlur = 30;
        ctx.fillText(PATTERN_NAMES[patternIdx], W / 2, H / 2);
        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    }

    tick();

    const onResize = () => { resize(); setTargets(patternIdx); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
