import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { masters } from '../data/embroidery';
import type { Master } from '../data/embroidery';

function MasterFlipCard({ master, index }: { master: Master; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flip-card h-96 w-full"
    >
      <div className="flip-card-inner">
        {/* 正面 */}
        <div className="flip-card-front overflow-hidden">
          <img
            src={master.image}
            alt={master.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${master.id}/400/500`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/20 to-transparent" />
          <div className="absolute inset-0 border border-[rgba(201,168,76,0.15)]" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="text-xl font-serif font-bold tracking-wider mb-1">{master.name}</h3>
            <p className="text-[#C9A84C] text-sm font-serif mb-0.5">{master.embroideryType}</p>
            <p className="text-[rgba(232,220,200,0.5)] text-xs">{master.region}</p>
          </div>
        </div>

        {/* 背面 */}
        <div className="flip-card-back p-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-serif font-bold text-white tracking-wider mb-2">{master.name}</h3>
            <span className="inline-block px-3 py-0.5 border border-[rgba(201,168,76,0.5)] text-[#C9A84C] text-xs font-serif">
              {master.title}
            </span>
          </div>
          <div className="gold-thin-line mb-4" />
          <p className="text-[rgba(232,220,200,0.75)] text-sm font-serif leading-relaxed text-center mb-4">
            {master.description}
          </p>
          <div className="mt-auto p-3 bg-white/5 border border-[rgba(201,168,76,0.18)]">
            <p className="text-[#C9A84C] text-xs font-serif leading-relaxed text-center">
              {master.achievement}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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

export default function MastersPage() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#040609]"
    >
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(300px, 55vh, 560px)' }}>
        <img
          src="https://images.unsplash.com/photo-1559181567-c3190ca9d715?w=1920&h=500&fit=crop"
          alt="非遗传承人"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/masters/1920/500'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#040609]" />
        <div
          className="deco-bg-char absolute right-0 top-1/2 -translate-y-1/2 select-none"
          style={{ fontSize: 'clamp(10rem, 28vw, 24rem)' }}
        >
          匠
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-12"
          ref={headerRef}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[#C9A84C] tracking-[8px] text-xs mb-3">INTANGIBLE HERITAGE MASTERS</p>
            <h1
              className="text-white font-serif font-black leading-none"
              style={{ fontSize: 'var(--text-display)', letterSpacing: 'var(--tracking-tight)' }}
            >
              非遗传承人
            </h1>
            <div className="gold-thin-line w-48 mt-5" />
          </motion.div>
        </div>
      </div>

      {/* 传承人网格 */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ScrollReveal className="mb-12 text-center">
          <p className="text-[#C9A84C] tracking-[6px] text-xs mb-3">MASTERS</p>
          <h2
            className="text-white font-serif font-black"
            style={{ fontSize: 'var(--text-section)', letterSpacing: 'var(--tracking-tight)' }}
          >
            匠人风采
          </h2>
          <p className="text-[rgba(232,220,200,0.35)] text-sm mt-3 tracking-wider">
            悬停卡片，了解传承人的故事与成就
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {masters.map((master, index) => (
            <MasterFlipCard key={master.id} master={master} index={index} />
          ))}
        </div>
      </div>

      {/* 传承人计划 */}
      <div className="border-t border-[rgba(201,168,76,0.1)]">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <ScrollReveal>
            <p className="text-[#C9A84C] tracking-[6px] text-xs mb-4">ABOUT THE PROGRAM</p>
            <h2
              className="text-white font-serif font-black mb-6"
              style={{ fontSize: 'var(--text-section)', letterSpacing: 'var(--tracking-tight)' }}
            >
              传承人计划
            </h2>
            <div className="gold-thin-line max-w-32 mx-auto mb-8" />
            <p className="text-[rgba(232,220,200,0.5)] leading-8 text-base mb-4 max-w-2xl mx-auto">
              华绣志·传承人计划致力于记录、保护和推广中国六大非遗绣种的传统技艺。我们与国家级、省级非物质文化遗产代表性传承人深度合作，通过影像记录、线上课程、展览等多种形式，让这份珍贵的手工技艺走进更多人的生活。
            </p>
            <p className="text-[rgba(232,220,200,0.5)] leading-8 text-base mb-10 max-w-2xl mx-auto">
              如果您是非遗刺绣传承人，欢迎加入华绣志传承人计划，共同守护这份来自千年的文化遗产。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-primary px-8 py-3 text-sm tracking-wider">加入传承人计划</button>
              <button className="px-8 py-3 text-sm tracking-wider border border-[rgba(201,168,76,0.4)] text-[rgba(201,168,76,0.7)] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">
                了解更多详情
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </motion.div>
  );
}
