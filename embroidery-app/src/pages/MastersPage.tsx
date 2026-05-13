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
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="flip-card h-80 w-full"
    >
      <div className="flip-card-inner">
        {/* Front */}
        <div className="flip-card-front rounded-lg overflow-hidden shadow-xl">
          <img
            src={master.image}
            alt={master.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${master.id}/400/500`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-serif font-bold tracking-wider mb-1">{master.name}</h3>
            <p className="text-[var(--color-gold)] text-sm font-serif mb-0.5">{master.embroideryType}</p>
            <p className="text-white/70 text-xs font-serif">{master.region}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="flip-card-back rounded-lg p-5 flex flex-col justify-center shadow-xl"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a0d0d 100%)' }}
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-serif font-bold text-white tracking-wider mb-1">{master.name}</h3>
            <span className="inline-block px-3 py-0.5 border border-[var(--color-gold)]/60 text-[var(--color-gold)] text-xs font-serif rounded-sm">
              {master.title}
            </span>
          </div>
          <div className="divider-pattern mb-4" style={{ opacity: 0.4 }} />
          <p className="text-white/80 text-sm font-serif leading-relaxed text-center mb-4">
            {master.description}
          </p>
          <div className="mt-auto p-3 bg-white/5 border border-[var(--color-gold)]/20 rounded-sm">
            <p className="text-[var(--color-gold)] text-xs font-serif leading-relaxed text-center">
              🏆 {master.achievement}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScrollReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
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
      className="min-h-screen bg-[#1a1a2e]"
    >
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: '500px' }}>
        <img
          src="https://images.unsplash.com/photo-1559181567-c3190ca9d715?w=1920&h=500&fit=crop"
          alt="非遗传承人"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/masters/1920/500';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/70 via-[#1a1a2e]/50 to-[#1a1a2e]" />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          ref={headerRef}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[var(--color-gold)] tracking-[6px] text-sm mb-3 font-serif">INTANGIBLE HERITAGE MASTERS</p>
            <h1 className="text-white text-5xl md:text-7xl font-serif font-bold tracking-widest mb-4">
              非遗传承人
            </h1>
            <div className="divider-pattern w-48 mx-auto my-4" />
            <p className="text-white/70 text-lg font-serif tracking-wide mt-2">
              守护千年技艺，传承非遗之光
            </p>
          </motion.div>
        </div>
      </div>

      {/* Masters Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ScrollReveal className="mb-12 text-center">
          <p className="text-[var(--color-gold)] tracking-[4px] text-sm font-serif mb-3">MASTERS</p>
          <h2 className="text-white text-3xl font-serif font-bold tracking-widest mb-4">匠人风采</h2>
          <p className="text-white/50 font-serif text-sm">
            悬停卡片，了解传承人的故事与成就
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {masters.map((master, index) => (
            <MasterFlipCard key={master.id} master={master} index={index} />
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <ScrollReveal>
            <p className="text-[var(--color-gold)] tracking-[4px] text-sm font-serif mb-4">ABOUT THE PROGRAM</p>
            <h2 className="text-white text-3xl md:text-4xl font-serif font-bold tracking-wider mb-6">
              传承人计划
            </h2>
            <div className="divider-pattern w-32 mx-auto mb-8" />
            <p className="text-white/60 font-serif leading-8 text-base mb-4">
              华绣志·传承人计划致力于记录、保护和推广中国六大非遗绣种的传统技艺。我们与国家级、省级非物质文化遗产代表性传承人深度合作，通过影像记录、线上课程、展览等多种形式，让这份珍贵的手工技艺走进更多人的生活。
            </p>
            <p className="text-white/60 font-serif leading-8 text-base mb-10">
              如果您是非遗刺绣传承人，欢迎加入华绣志传承人计划，共同守护这份来自千年的文化遗产。我们将为您提供数字化记录、作品展示、传播推广等全方位支持。
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-primary px-8 py-3 text-base tracking-wider">
                加入传承人计划
              </button>
              <button className="px-8 py-3 text-base tracking-wider border border-[var(--color-gold)]/50 text-[var(--color-gold)] font-serif rounded-sm hover:bg-[var(--color-gold)]/10 transition-colors duration-200">
                了解更多详情
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </motion.div>
  );
}
