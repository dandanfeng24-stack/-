import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { embroideryTypes, masters } from '../data/embroidery';

function ScrollReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const item = embroideryTypes.find((e) => e.id === id);
  const relatedMasters = masters.filter((m) => item && m.embroideryType === item.name);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080c14]">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-2xl text-[rgba(232,220,200,0.5)] font-serif mb-6">未找到该绣种</h2>
          <Link to="/encyclopedia" className="btn-primary">返回图鉴</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#080c14]"
    >
      {/* Hero */}
      <div
        className="relative flex flex-col justify-end px-8 md:px-16 pb-14 overflow-hidden"
        style={{ background: item.bgPattern, minHeight: 'clamp(320px, 55vh, 560px)' }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="deco-bg-char absolute right-0 top-1/2 -translate-y-1/2 select-none"
          style={{ fontSize: 'clamp(10rem, 25vw, 22rem)' }}
        >
          {item.name[0]}
        </div>

        {/* 面包屑 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 mb-6"
        >
          <Link to="/encyclopedia" className="text-[rgba(201,168,76,0.6)] text-xs tracking-wider hover:text-[#C9A84C] transition-colors">
            ← 刺绣图鉴
          </Link>
        </motion.div>

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-[#C9A84C] tracking-[6px] text-xs mb-3"
          >
            {item.region} · {item.province}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-white font-serif font-black leading-none mb-4"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)', letterSpacing: 'var(--tracking-tight)' }}
          >
            {item.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[rgba(232,220,200,0.7)] font-serif italic mb-6"
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)' }}
          >
            {item.tagline}
          </motion.p>
          {/* 色板 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2.5"
          >
            {item.colors.map((c, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-sm border border-white/30 shadow-lg"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="bg-[#080c14]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* 左侧主内容 */}
            <div className="flex-1 min-w-0 max-w-3xl">
              <ScrollReveal className="mb-12">
                <p className="text-[rgba(232,220,200,0.65)] text-lg leading-relaxed border-l-4 border-[#C0392B] pl-5 font-serif">
                  {item.description}
                </p>
              </ScrollReveal>

              {[
                { title: '历史起源', content: item.history },
              ].map(({ title, content }) => (
                <ScrollReveal key={title} delay={0.05} className="mb-12">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[#C9A84C] text-xl">◈</span>
                    <h2 className="text-2xl font-serif font-bold text-[#E8DCC8]">{title}</h2>
                  </div>
                  <div className="gold-thin-line mb-6" />
                  <p className="text-[rgba(232,220,200,0.6)] leading-8 font-serif">{content}</p>
                </ScrollReveal>
              ))}

              <ScrollReveal delay={0.1} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[#C9A84C] text-xl">◈</span>
                  <h2 className="text-2xl font-serif font-bold text-[#E8DCC8]">工艺特点</h2>
                </div>
                <div className="gold-thin-line mb-6" />
                <ul className="space-y-3">
                  {item.characteristics.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-[rgba(232,220,200,0.6)] font-serif">
                      <span className="text-[#C9A84C] mt-0.5 flex-shrink-0">✦</span>
                      <span className="leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={0.15} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[#C9A84C] text-xl">◈</span>
                  <h2 className="text-2xl font-serif font-bold text-[#E8DCC8]">代表技法</h2>
                </div>
                <div className="gold-thin-line mb-6" />
                <div className="flex flex-wrap gap-3">
                  {item.techniques.map((t, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 border border-[rgba(201,168,76,0.3)] text-[rgba(201,168,76,0.7)] font-serif text-sm hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-default"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[#C9A84C] text-xl">◈</span>
                  <h2 className="text-2xl font-serif font-bold text-[#E8DCC8]">代表作品</h2>
                </div>
                <div className="gold-thin-line mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.representativeWorks.map((w, i) => (
                    <div
                      key={i}
                      className="p-4 border border-[rgba(201,168,76,0.15)] bg-[rgba(255,255,255,0.02)] flex items-center gap-3"
                    >
                      <span
                        className="w-8 h-8 flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: item.accentColor }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-serif text-[rgba(232,220,200,0.65)]">{w}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.25}>
                <Link to="/encyclopedia" className="btn-primary">← 返回刺绣图鉴</Link>
              </ScrollReveal>
            </div>

            {/* 右侧边栏 */}
            {relatedMasters.length > 0 && (
              <div className="lg:w-72 flex-shrink-0">
                <ScrollReveal>
                  <div className="sticky top-20">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[#C9A84C]">◈</span>
                      <h3 className="text-lg font-serif font-bold text-[#E8DCC8]">相关传承人</h3>
                    </div>
                    <div className="space-y-4">
                      {relatedMasters.map((master) => (
                        <div key={master.id} className="card-art overflow-hidden card-hover">
                          <div className="img-zoom" style={{ aspectRatio: '16/9' }}>
                            <img
                              src={master.image}
                              alt={master.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${master.id}/400/225`; }}
                            />
                          </div>
                          <div className="p-4 border-t border-[rgba(201,168,76,0.1)]">
                            <h4 className="font-serif font-bold text-[#E8DCC8] mb-1">{master.name}</h4>
                            <p className="text-xs text-[#C9A84C] mb-2">{master.title}</p>
                            <p className="text-xs text-[rgba(232,220,200,0.45)] leading-relaxed line-clamp-3">{master.description}</p>
                            <p className="text-xs text-[rgba(232,220,200,0.25)] mt-2">{master.region}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
