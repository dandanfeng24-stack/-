import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { embroideryTypes, masters } from '../data/embroidery';

// ── 通用入场动画 ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── 绣种列表行（hover 弹出预览图）────────────────────────────────────────────
function EmbroideryRow({ item, index }: { item: typeof embroideryTypes[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/encyclopedia/${item.id}`}
        className="group relative flex items-center gap-6 md:gap-10 py-5 md:py-6 border-b border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.3)] transition-colors duration-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        {/* 序号 */}
        <span className="font-mono text-[rgba(201,168,76,0.35)] text-xs w-6 shrink-0 tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* 名称 */}
        <span
          className="font-serif font-bold text-[#E8DCC8] group-hover:text-[#C9A84C] transition-colors duration-300 shrink-0"
          style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', letterSpacing: '-0.01em' }}
        >
          {item.name}
        </span>

        {/* 产地 */}
        <span className="text-[rgba(232,220,200,0.3)] text-xs tracking-[3px] shrink-0 hidden sm:block">
          {item.province}
        </span>

        {/* 间隔线 */}
        <div className="hidden md:block flex-1 h-px bg-[rgba(201,168,76,0.08)] group-hover:bg-[rgba(201,168,76,0.2)] transition-colors duration-300" />

        {/* 难度 */}
        <span className="hidden md:block text-[rgba(232,220,200,0.25)] text-xs tracking-widest shrink-0">
          {item.difficulty}
        </span>

        {/* 简介（桌面） */}
        <span className="hidden lg:block text-[rgba(232,220,200,0.3)] text-sm max-w-xs truncate shrink-0">
          {item.tagline}
        </span>

        {/* 箭头 */}
        <ArrowRight
          size={16}
          className="ml-auto shrink-0 text-[rgba(201,168,76,0.25)] group-hover:text-[#C9A84C] group-hover:translate-x-1 transition-all duration-300"
        />

        {/* Hover 预览图（跟随鼠标，仅桌面） */}
        {hovered && (
          <div
            className="pointer-events-none absolute hidden lg:block z-50"
            style={{
              left: mousePos.x + 24,
              top: mousePos.y - 80,
              width: 200,
              height: 150,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full border border-[rgba(201,168,76,0.3)] overflow-hidden shadow-2xl"
            >
              <img
                src={item.coverImage}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/400/300`;
                }}
              />
            </motion.div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

// ── 主组件 ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 1],   ['0%', '15%']);

  return (
    <div className="min-h-screen bg-[#0a0c0f]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#07090d]">

        {/* 极细粒子噪点背景 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '256px' }}
        />

        {/* 右侧透明大字装饰 */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center select-none pointer-events-none"
          aria-hidden="true"
        >
          <span
            className="font-serif font-black leading-none"
            style={{
              fontSize: 'clamp(18rem, 48vw, 44rem)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(201,168,76,0.04)',
              letterSpacing: '-0.05em',
              lineHeight: 0.85,
            }}
          >
            绣
          </span>
        </div>

        {/* 光晕 */}
        <div
          className="absolute top-1/3 left-1/4 w-[70vw] h-[70vw] max-w-3xl max-h-3xl rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(192,57,43,0.05) 0%, transparent 65%)' }}
        />

        {/* 主内容 */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 px-8 md:px-16 lg:px-24 pb-24 md:pb-32"
        >
          {/* 顶部标签行 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-8 h-px bg-[#C9A84C]/50" />
            <span className="text-[#C9A84C]/70 text-[10px] tracking-[8px] uppercase">China Intangible Cultural Heritage</span>
          </motion.div>

          {/* 超大标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-black text-white leading-[0.88] mb-12"
            style={{ fontSize: 'clamp(5rem, 16vw, 13rem)', letterSpacing: '-0.04em' }}
          >
            华绣志
          </motion.h1>

          {/* 副标题行 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12"
          >
            <div>
              <p className="text-[#E8DCC8]/60 font-serif text-lg md:text-xl leading-relaxed">
                六大非遗刺绣 · 千年技艺传承
              </p>
              <p className="text-[#E8DCC8]/30 text-sm mt-1 tracking-wider">
                针针皆故事，线线有温度
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            >
              <Link
                to="/encyclopedia"
                className="inline-flex items-center gap-3 text-[#C9A84C] hover:gap-5 transition-all duration-400 text-sm tracking-[4px] group"
              >
                探索图鉴
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 滚动指示 */}
        <motion.div
          className="absolute bottom-8 right-10 md:right-16 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-[rgba(232,220,200,0.2)] text-[9px] tracking-[4px]" style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
          <motion.div
            className="w-px h-14 bg-gradient-to-b from-[#C9A84C]/40 to-transparent"
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ── 数据栏（极简行式）────────────────────────────────────────────────── */}
      <section className="border-y border-[rgba(201,168,76,0.08)] bg-[#07090d]">
        <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24 py-0">
          <div className="flex flex-wrap">
            {[
              { n: '6',    u: '种',  l: '非遗绣种' },
              { n: '120',  u: '+',   l: '传承人档案' },
              { n: '500',  u: '+',   l: '精品视频' },
              { n: '10万', u: '+',   l: '绣艺爱好者' },
            ].map(({ n, u, l }, i) => (
              <Reveal key={l} delay={i * 0.08} className="flex-1 min-w-[140px] border-r border-[rgba(201,168,76,0.08)] last:border-r-0 py-10 px-6 first:pl-0">
                <div
                  className="font-serif font-black text-[#C9A84C] leading-none mb-1"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', letterSpacing: '-0.04em' }}
                >
                  {n}<span className="text-[rgba(201,168,76,0.4)] text-xl ml-0.5">{u}</span>
                </div>
                <div className="text-[rgba(232,220,200,0.3)] text-[10px] tracking-[4px]">{l}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 六大绣种索引列表 ─────────────────────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-[#0a0c0f]">
        <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24">

          {/* 区块标题 */}
          <Reveal className="mb-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[#C9A84C]/50 text-[10px] tracking-[8px] mb-4">SELECTED WORKS</p>
                <h2
                  className="font-serif font-black text-white leading-none"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}
                >
                  六大绣种
                </h2>
              </div>
              <Link
                to="/encyclopedia"
                className="hidden md:flex items-center gap-2 text-[rgba(232,220,200,0.3)] hover:text-[#C9A84C] text-xs tracking-[4px] transition-colors duration-300 group"
              >
                全部图鉴
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          {/* 索引分隔线（顶部） */}
          <div className="border-t border-[rgba(201,168,76,0.15)]" />

          {/* 绣种列表 */}
          {embroideryTypes.map((item, i) => (
            <EmbroideryRow key={item.id} item={item} index={i} />
          ))}

          {/* 移动端查看全部 */}
          <div className="mt-10 md:hidden">
            <Link to="/encyclopedia" className="text-[#C9A84C] text-sm tracking-[4px] flex items-center gap-2">
              查看全部图鉴 <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 传承人（左右分列，文字重）────────────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-[#07090d] border-t border-[rgba(201,168,76,0.06)]">
        <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24">

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* 左：标题 */}
            <Reveal className="lg:w-56 shrink-0">
              <p className="text-[#C9A84C]/50 text-[10px] tracking-[8px] mb-4">MASTERS</p>
              <h2
                className="font-serif font-black text-white leading-none mb-6"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
              >
                非遗传承人
              </h2>
              <p className="text-[rgba(232,220,200,0.3)] text-sm leading-relaxed mb-8">
                他们用一生守护传统技艺，让千年刺绣在现代重焕光彩。
              </p>
              <Link
                to="/masters"
                className="inline-flex items-center gap-2 text-[#C9A84C] text-xs tracking-[4px] hover:gap-4 transition-all duration-300 group"
              >
                认识全部传承人
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>

            {/* 右：传承人卡片 2×2 */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {masters.slice(0, 4).map((master, i) => (
                <Reveal key={master.id} delay={i * 0.1}>
                  <div className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
                    <img
                      src={master.image}
                      alt={master.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${master.id}/400/533`;
                      }}
                    />
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    {/* hover 时金色遮罩 */}
                    <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/08 transition-colors duration-500" />
                    {/* 信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-[#C9A84C] text-[9px] tracking-[3px] mb-1">{master.embroideryType}</div>
                      <div className="font-serif font-bold text-white text-lg leading-tight">{master.name}</div>
                      <div className="text-[rgba(232,220,200,0.45)] text-xs mt-1">{master.region}</div>
                    </div>
                    {/* hover 背面简介 */}
                    <motion.div
                      className="absolute inset-0 bg-[#07090d]/95 p-5 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    >
                      <div className="text-[#C9A84C] font-serif text-lg font-bold mb-2">{master.name}</div>
                      <div className="w-8 h-px bg-[#C9A84C]/40 mb-3" />
                      <div className="text-[rgba(232,220,200,0.6)] text-xs leading-relaxed line-clamp-5">{master.description}</div>
                    </motion.div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 精选视频（横向列表）─────────────────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-[#0a0c0f] border-t border-[rgba(201,168,76,0.06)]">
        <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24">
          <Reveal className="mb-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[#C9A84C]/50 text-[10px] tracking-[8px] mb-4">VIDEOS</p>
                <h2
                  className="font-serif font-black text-white leading-none"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}
                >
                  精选视频
                </h2>
              </div>
              <Link
                to="/videos"
                className="hidden md:flex items-center gap-2 text-[rgba(232,220,200,0.3)] hover:text-[#C9A84C] text-xs tracking-[4px] transition-colors group"
              >
                视频中心
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '苗绣入门：蝴蝶纹基础针法', tag: '教程', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', time: '28:45' },
              { title: '苏绣双面绣大师示范', tag: '展示', img: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&h=400&fit=crop', time: '15:32' },
              { title: '我的第一幅苗绣作品完成了', tag: '投稿', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop', time: '12:18' },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <Link to="/videos" className="group block">
                  <div className="relative overflow-hidden mb-3" style={{ aspectRatio: '16/10' }}>
                    <img src={v.img} alt={v.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    <span className="absolute top-3 left-3 text-[9px] tracking-[3px] text-[#C9A84C] bg-black/60 px-2 py-1 border border-[rgba(201,168,76,0.3)]">
                      {v.tag}
                    </span>
                    <span className="absolute bottom-3 right-3 font-mono text-xs text-[rgba(232,220,200,0.8)] bg-black/60 px-2 py-0.5">
                      {v.time}
                    </span>
                  </div>
                  <h3 className="font-serif text-[#E8DCC8]/80 group-hover:text-[#C9A84C] transition-colors duration-300 text-sm leading-snug">
                    {v.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 页脚 ─────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(201,168,76,0.08)] bg-[#07090d] py-20">
        <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
            {/* 品牌名 */}
            <div>
              <h3
                className="font-serif font-black text-white leading-none mb-3"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em' }}
              >
                华绣志
              </h3>
              <p className="text-[rgba(232,220,200,0.3)] text-xs tracking-[4px]">中国非遗刺绣文化平台</p>
            </div>
            {/* 链接列 */}
            <div className="flex gap-12 md:gap-16">
              {[
                { title: '导航', links: [{ label: '刺绣图鉴', to: '/encyclopedia' }, { label: '视频中心', to: '/videos' }, { label: '传承人', to: '/masters' }, { label: '作品广场', to: '/gallery' }] },
                { title: '平台', links: [{ label: '关于我们', to: '/' }, { label: '内容来源', to: '/' }, { label: '联系我们', to: '/' }] },
              ].map(({ title, links }) => (
                <div key={title}>
                  <p className="text-[rgba(232,220,200,0.25)] text-[9px] tracking-[4px] mb-4">{title}</p>
                  <ul className="space-y-2.5">
                    {links.map((l) => (
                      <li key={l.label}>
                        <Link to={l.to} className="text-[rgba(232,220,200,0.45)] hover:text-[#C9A84C] text-sm transition-colors duration-300">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[rgba(201,168,76,0.06)] pt-6 flex flex-col sm:flex-row justify-between gap-2">
            <p className="text-[rgba(232,220,200,0.18)] text-xs tracking-wider">© 2024 华绣志</p>
            <p className="text-[rgba(232,220,200,0.12)] text-xs">内容来源：Wikimedia Commons · Met Museum Open Access</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
