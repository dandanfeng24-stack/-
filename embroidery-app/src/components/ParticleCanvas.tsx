import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

// ── Layers: hero / medium / small / dust ──────────────────────────────────────
const LAYERS = [
  { n: 60,   rMin: 16, rMax: 22, maxSpd: 0.55, damp: 0.96, jitter: 0.025 },
  { n: 200,  rMin:  8, rMax: 13, maxSpd: 0.90, damp: 0.94, jitter: 0.040 },
  { n: 900,  rMin:  3, rMax:  5, maxSpd: 1.30, damp: 0.92, jitter: 0.060 },
  { n: 8840, rMin:  1, rMax:  1, maxSpd: 1.60, damp: 0.90, jitter: 0.080 },
] as const;
const N = LAYERS.reduce((s, l) => s + l.n, 0); // 10 000

const PH_FLOW = 0, PH_FORMING = 1, PH_HOLD = 2, PH_DISPERSE = 3;
const DUR = [500, 500, 300, 450];

// ── 3D droplet sprite (white sphere, Phong shading) ───────────────────────────
function makeDropletSprite(d: number): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = cv.height = d;
  const g = cv.getContext('2d') as CanvasRenderingContext2D;
  const r = d / 2, cx = r, cy = r;
  g.save(); g.beginPath(); g.arc(cx, cy, r - 0.5, 0, TAU); g.clip();
  // base water tint
  g.fillStyle = 'rgba(18,35,75,0.18)'; g.fillRect(0, 0, d, d);
  // diffuse light upper-left
  const diff = g.createRadialGradient(cx - r * .4, cy - r * .42, 0, cx + r * .1, cy + r * .1, r * 1.1);
  diff.addColorStop(0,   'rgba(215,228,255,0.72)');
  diff.addColorStop(.42, 'rgba(165,188,235,0.42)');
  diff.addColorStop(1,   'rgba(50,80,160,0.00)');
  g.fillStyle = diff; g.fillRect(0, 0, d, d);
  // shadow lower-right
  const shad = g.createRadialGradient(cx + r*.35, cy + r*.40, r*.15, cx, cy, r);
  shad.addColorStop(0, 'rgba(0,8,30,0.00)'); shad.addColorStop(.55, 'rgba(0,8,30,0.00)');
  shad.addColorStop(.88, 'rgba(0,8,30,0.50)'); shad.addColorStop(1, 'rgba(0,8,30,0.30)');
  g.fillStyle = shad; g.fillRect(0, 0, d, d);
  // primary specular
  const sx = cx - r*.30, sy = cy - r*.32;
  const s1 = g.createRadialGradient(sx, sy, 0, sx, sy, r*.50);
  s1.addColorStop(0, 'rgba(255,255,255,1.00)'); s1.addColorStop(.30, 'rgba(255,255,255,0.80)');
  s1.addColorStop(.65, 'rgba(255,255,255,0.28)'); s1.addColorStop(1, 'rgba(255,255,255,0.00)');
  g.fillStyle = s1; g.fillRect(0, 0, d, d);
  // pin-point hot-spot
  const sx2 = cx - r*.20, sy2 = cy - r*.24;
  const s2 = g.createRadialGradient(sx2, sy2, 0, sx2, sy2, r*.13);
  s2.addColorStop(0, 'rgba(255,255,255,1.00)'); s2.addColorStop(1, 'rgba(255,255,255,0.00)');
  g.fillStyle = s2; g.fillRect(0, 0, d, d);
  // rim light (blue edge)
  const rim = g.createRadialGradient(cx - r*.5, cy + r*.55, r*.55, cx, cy, r);
  rim.addColorStop(0, 'rgba(140,200,255,0.00)'); rim.addColorStop(.72, 'rgba(140,200,255,0.00)');
  rim.addColorStop(.88, 'rgba(175,220,255,0.32)'); rim.addColorStop(1, 'rgba(140,200,255,0.00)');
  g.fillStyle = rim; g.fillRect(0, 0, d, d);
  g.restore();
  return cv;
}

let SP_HERO:   HTMLCanvasElement | null = null;
let SP_MEDIUM: HTMLCanvasElement | null = null;
function ensureSprites() {
  if (!SP_HERO) { SP_HERO = makeDropletSprite(44); SP_MEDIUM = makeDropletSprite(22); }
}

// ── Pattern generators ────────────────────────────────────────────────────────
function patternPlum(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2); let idx = 0;
  const nc = Math.floor(N * .08);
  for (let i = 0; i < nc; i++) {
    const t = (i/nc)*TAU, ring = (i%14)/14;
    out[idx++] = cx + sc*.18*ring*Math.cos(t); out[idx++] = cy + sc*.18*ring*Math.sin(t);
  }
  const np = Math.floor((N-nc)/5);
  for (let p = 0; p < 5; p++) {
    const ba = (p/5)*TAU - Math.PI/2;
    const pcx = cx + sc*.52*.55*Math.cos(ba), pcy = cy + sc*.52*.55*Math.sin(ba);
    for (let i = 0; i < np; i++) {
      const t = (i/np)*TAU, ring = (i%18)/18;
      const r = sc*.46*ring*(0.52+.48*Math.cos(t));
      out[idx++] = pcx + r*Math.cos(t); out[idx++] = pcy + r*Math.sin(t);
    }
  }
  while (idx < N*2-1) { out[idx++]=cx; out[idx++]=cy; }
  return out;
}

function patternButterfly(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2);
  const pp = Math.floor(N / 5);
  for (let p = 0; p < 5; p++) {
    const off = (p-2)*0.013;
    for (let i = 0; i < pp; i++) {
      const t = (i/pp)*TAU+off;
      const r = sc*.35*(Math.exp(Math.sin(t))-2*Math.cos(4*t)+Math.pow(Math.sin((2*t-Math.PI)/24),5));
      const b = (p*pp+i)*2; out[b]=cx+r*Math.cos(t); out[b+1]=cy+r*Math.sin(t);
    }
  }
  return out;
}

function patternLotus(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2); let idx = 0;
  const ring8 = (count: number, petals: number, dist: number, rp: number, rot: number) => {
    const pp = Math.floor(count/petals);
    for (let p = 0; p < petals; p++) {
      const ba = (p/petals)*TAU+rot, pcx = cx+dist*Math.cos(ba), pcy = cy+dist*Math.sin(ba);
      for (let i = 0; i < pp; i++) {
        const t=(i/pp)*TAU, ring=(i%14)/14;
        const a=rp*ring*(0.32+.68*Math.abs(Math.cos(t))), b=rp*.38*ring*(0.32+.68*Math.abs(Math.sin(t)));
        out[idx++]=pcx+a*Math.cos(t)*Math.cos(ba)-b*Math.sin(t)*Math.sin(ba);
        out[idx++]=pcy+a*Math.cos(t)*Math.sin(ba)+b*Math.sin(t)*Math.cos(ba);
      }
    }
  };
  const nc = Math.floor(N*.07);
  for (let i=0;i<nc;i++){const t=(i/nc)*TAU,r=sc*.09*((i%10)/10);out[idx++]=cx+r*Math.cos(t);out[idx++]=cy+r*Math.sin(t);}
  ring8(Math.floor(N*.36),8,sc*.28,sc*.25,0);
  ring8(Math.floor(N*.54),8,sc*.54,sc*.37,Math.PI/8);
  while (idx<N*2-1){out[idx++]=cx;out[idx++]=cy;}
  return out;
}

function patternPhoenix(cx: number, cy: number, sc: number): Float32Array {
  const out = new Float32Array(N * 2);
  const ppAP = Math.floor(N/(3*4));
  for (let arm=0;arm<3;arm++){
    const ba=(arm/3)*TAU-Math.PI/2;
    for (let pass=0;pass<4;pass++){
      const ro=(pass-1.5)*sc*.020;
      for (let i=0;i<ppAP;i++){
        const frac=i/ppAP, angle=ba+frac*2.5*Math.PI;
        const r=sc*.07+sc*.66*frac+ro, wave=sc*.022*Math.sin(frac*TAU*3.5);
        const b=(arm*4*ppAP+pass*ppAP+i)*2;
        out[b]=cx+(r+wave)*Math.cos(angle); out[b+1]=cy+(r+wave)*Math.sin(angle);
      }
    }
  }
  let f=3*4*ppAP*2; while(f<N*2-1){out[f++]=cx;out[f++]=cy;} return out;
}

const PATTERNS=[patternPlum,patternButterfly,patternLotus,patternPhoenix];

function nvx(x:number,y:number,t:number){return Math.sin(x*.002+t*.29)*Math.cos(y*.0016+t*.13)*1.2+Math.sin(x*.005-y*.0038+t*.20)*.65+Math.cos(x*.0009+y*.0012+t*.38)*.75;}
function nvy(x:number,y:number,t:number){return Math.cos(x*.0018+t*.26)*Math.sin(y*.0022-t*.15)*1.2+Math.cos(x*.0045+y*.0032+t*.17)*.65+Math.sin(x*.001-y*.0016+t*.33)*.75;}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ParticleCanvas() {
  const mainRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);   // bloom source — CSS-blurred

  useEffect(() => {
    ensureSprites();
    const main = mainRef.current!, glow = glowRef.current!;
    const mCtx = main.getContext('2d') as CanvasRenderingContext2D;
    // glow canvas: no anti-alias needed, just big blobs
    const gCtx = glow.getContext('2d', { alpha: true }) as CanvasRenderingContext2D;

    let W=0, H=0, animId=0, frame=0;

    function resize() {
      W=main.offsetWidth; H=main.offsetHeight;
      main.width=W*devicePixelRatio; main.height=H*devicePixelRatio;
      // glow at 30% resolution — CSS will scale + blur it
      glow.width=Math.round(W*devicePixelRatio*.30);
      glow.height=Math.round(H*devicePixelRatio*.30);
      mCtx.scale(devicePixelRatio,devicePixelRatio);
      gCtx.scale(devicePixelRatio*.30,devicePixelRatio*.30);
    }
    resize();

    const px=new Float32Array(N), py=new Float32Array(N);
    const pvx=new Float32Array(N), pvy=new Float32Array(N);
    const ptx=new Float32Array(N), pty=new Float32Array(N);
    const prad=new Float32Array(N), pcat=new Uint8Array(N), palpha=new Float32Array(N);

    let offset=0;
    for (let li=0;li<LAYERS.length;li++){
      const L=LAYERS[li];
      for (let k=0;k<L.n;k++,offset++){
        pcat[offset]=li;
        prad[offset]=L.rMin+(k/Math.max(1,L.n-1))*(L.rMax-L.rMin);
        palpha[offset]=0.55+Math.random()*.45;
      }
    }
    for (let i=0;i<N;i++){
      const a=Math.random()*TAU, r=10+Math.random()*Math.min(W,H)*.22;
      px[i]=W/2+r*Math.cos(a); py[i]=H/2+r*Math.sin(a);
      pvx[i]=(Math.random()-.5)*.5; pvy[i]=(Math.random()-.5)*.5;
    }

    let phase=PH_FLOW, pFrame=0, patIdx=0, T=0;

    function assignPattern(idx:number){
      const pts=PATTERNS[idx](W/2,H/2,Math.min(W,H)*.32);
      const ord=Array.from({length:N},(_,i)=>i);
      for(let i=N-1;i>0;i--){const j=(Math.random()*(i+1))|0;const tmp=ord[i];ord[i]=ord[j];ord[j]=tmp;}
      for(let i=0;i<N;i++){ptx[ord[i]]=pts[i*2];pty[ord[i]]=pts[i*2+1];}
    }
    function assignScatter(){
      for(let i=0;i<N;i++){const a=Math.random()*TAU,r=Math.min(W,H)*(.04+Math.random()*.28);ptx[i]=W/2+r*Math.cos(a);pty[i]=H/2+r*Math.sin(a);}
    }
    assignScatter();

    // ── Render to a context ──────────────────────────────────────────────────
    function renderSharp(c: CanvasRenderingContext2D, sc: number) {
      // dust — single arc batch
      c.fillStyle='rgba(215,228,255,0.70)'; c.beginPath();
      for(let i=0;i<N;i++){if(pcat[i]!==3)continue;const x=px[i]/sc,y=py[i]/sc;c.moveTo(x+1,y);c.arc(x,y,1,0,TAU);}
      c.fill();
      // small — arc batch
      c.fillStyle='rgba(228,236,255,0.78)'; c.beginPath();
      for(let i=0;i<N;i++){if(pcat[i]!==2)continue;const x=px[i]/sc,y=py[i]/sc,r=prad[i]/sc;c.moveTo(x+r,y);c.arc(x,y,r,0,TAU);}
      c.fill();
      // medium sprites
      for(let i=0;i<N;i++){if(pcat[i]!==1)continue;const d=prad[i]*2/sc,x=px[i]/sc-d/2,y=py[i]/sc-d/2;c.globalAlpha=palpha[i]*.82;c.drawImage(SP_MEDIUM!,x,y,d,d);}
      // hero sprites
      for(let i=0;i<N;i++){if(pcat[i]!==0)continue;const d=prad[i]*2/sc,x=px[i]/sc-d/2,y=py[i]/sc-d/2;c.globalAlpha=palpha[i]*.90;c.drawImage(SP_HERO!,x,y,d,d);}
      c.globalAlpha=1;
    }

    // Glow source: only hero+medium (260 particles) — CSS will blur them
    function renderGlow(c: CanvasRenderingContext2D, sc: number) {
      for(let i=0;i<N;i++){
        if(pcat[i]>1)continue;   // skip small + dust
        const d=prad[i]*2.2/sc;  // slightly oversized for bloom spread
        const x=px[i]/sc-d/2, y=py[i]/sc-d/2;
        c.globalAlpha=palpha[i]*.75;
        c.drawImage(pcat[i]===0?SP_HERO!:SP_MEDIUM!,x,y,d,d);
      }
      c.globalAlpha=1;
    }

    // ── Main loop ────────────────────────────────────────────────────────────
    function tick() {
      frame++; pFrame++; T+=0.0038;

      if     (phase===PH_FLOW     && pFrame>=DUR[0]){phase=PH_FORMING; pFrame=0;assignPattern(patIdx);}
      else if(phase===PH_FORMING  && pFrame>=DUR[1]){phase=PH_HOLD;    pFrame=0;}
      else if(phase===PH_HOLD     && pFrame>=DUR[2]){phase=PH_DISPERSE;pFrame=0;assignScatter();}
      else if(phase===PH_DISPERSE && pFrame>=DUR[3]){phase=PH_FLOW;    pFrame=0;patIdx=(patIdx+1)%PATTERNS.length;}

      const cX=W/2, cY=H/2;
      const dustSkip = frame%2===0; // update dust every other frame

      for(let i=0;i<N;i++){
        const L=LAYERS[pcat[i]];
        if(pcat[i]===3 && dustSkip) continue; // skip dust on alternate frames
        const x=px[i], y=py[i];

        if(phase===PH_FLOW){
          const nm=0.06+(3-pcat[i])*.025;
          pvx[i]+=nvx(x,y,T)*nm; pvy[i]+=nvy(x,y,T)*nm;
          pvx[i]+=(cX-x)*.00045; pvy[i]+=(cY-y)*.00045;
          pvx[i]+=(Math.random()-.5)*L.jitter; pvy[i]+=(Math.random()-.5)*L.jitter;
        } else if(phase===PH_FORMING){
          const prog=Math.min(1,pFrame/DUR[1]), ease=prog*prog*(3-2*prog);
          const stiff=(0.003+ease*.016)*(0.5+0.5*(3-pcat[i])/3);
          pvx[i]+=(ptx[i]-x)*stiff; pvy[i]+=(pty[i]-y)*stiff;
          pvx[i]+=(Math.random()-.5)*L.jitter*.3; pvy[i]+=(Math.random()-.5)*L.jitter*.3;
        } else if(phase===PH_HOLD){
          pvx[i]+=(ptx[i]-x)*.12; pvy[i]+=(pty[i]-y)*.12;
          const br=0.005*Math.sin(T*2.5+i*.008);
          pvx[i]+=(x-cX)*br; pvy[i]+=(y-cY)*br;
          pvx[i]+=(Math.random()-.5)*L.jitter*.35; pvy[i]+=(Math.random()-.5)*L.jitter*.35;
        } else {
          const prog=Math.min(1,pFrame/DUR[3]), ease=prog*(2-prog);
          const stiff=(0.003+ease*.012)*(0.5+0.5*(3-pcat[i])/3);
          pvx[i]+=(ptx[i]-x)*stiff; pvy[i]+=(pty[i]-y)*stiff;
          pvx[i]+=(Math.random()-.5)*L.jitter*.45; pvy[i]+=(Math.random()-.5)*L.jitter*.45;
        }

        pvx[i]*=L.damp; pvy[i]*=L.damp;
        const spd=Math.sqrt(pvx[i]*pvx[i]+pvy[i]*pvy[i]);
        if(spd>L.maxSpd){const inv=L.maxSpd/spd;pvx[i]*=inv;pvy[i]*=inv;}
        px[i]+=pvx[i]; py[i]+=pvy[i];
      }

      // ── Render ─────────────────────────────────────────────────────────────
      const trailA=phase===PH_HOLD?.48:phase===PH_FORMING?.15:.055;
      mCtx.fillStyle=`rgba(6,9,16,${trailA})`;
      mCtx.fillRect(0,0,W,H);
      renderSharp(mCtx,1);

      // Glow: clear transparent, draw hero+medium only — CSS handles blur+blend
      gCtx.clearRect(0,0,W,H);
      renderGlow(gCtx,1/0.30);

      animId=requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener('resize',resize);
    return()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',resize);};
  },[]);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* main canvas — sharp particles + trail effect */}
      <canvas ref={mainRef} className="absolute inset-0 w-full h-full" />
      {/* glow canvas — CSS blur + screen blend, GPU composited */}
      <canvas
        ref={glowRef}
        className="absolute inset-0 w-full h-full"
        style={{
          filter: 'blur(10px) brightness(2.0)',
          mixBlendMode: 'screen',
          opacity: 0.72,
        }}
      />
    </div>
  );
}
