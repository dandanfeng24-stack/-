import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { embroideryTypes, masters } from '../data/embroidery';

// Inline ScrollReveal component
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

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const item = embroideryTypes.find((e) => e.id === id);
  const relatedMasters = masters.filter((m) => item && m.embroideryType === item.name);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3]">
        <div className="text-center font-serif">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-2xl text-gray-500 mb-6">未找到该绣种</h2>
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
      className="min-h-screen"
    >
      {/* Hero */}
      <div
        className="relative h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{ background: item.bgPattern }}
      >
        {/* Decorative overlay */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--color-gold)] tracking-[6px] text-sm mb-4 font-serif"
          >
            {item.region} · {item.province}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-white font-serif font-bold tracking-widest mb-4"
            style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}
          >
            {item.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg md:text-2xl font-serif italic mb-8"
          >
            {item.tagline}
          </motion.p>
          {/* Color Palette */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 justify-center"
          >
            {item.colors.map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white/50 shadow-lg"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left / Main */}
            <div className="flex-1 min-w-0">
              {/* Description */}
              <ScrollReveal className="mb-12">
                <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-[var(--color-primary)] pl-5 font-serif">
                  {item.description}
                </p>
              </ScrollReveal>

              {/* Section 1: History */}
              <ScrollReveal delay={0.05} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[var(--color-gold)] text-2xl">◈</span>
                  <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)]">历史起源</h2>
                </div>
                <div className="divider-pattern mb-6" />
                <p className="text-gray-700 leading-8 font-serif">{item.history}</p>
              </ScrollReveal>

              {/* Section 2: Characteristics */}
              <ScrollReveal delay={0.1} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[var(--color-gold)] text-2xl">◈</span>
                  <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)]">工艺特点</h2>
                </div>
                <div className="divider-pattern mb-6" />
                <ul className="space-y-3">
                  {item.characteristics.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 font-serif">
                      <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">✦</span>
                      <span className="leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              {/* Section 3: Techniques */}
              <ScrollReveal delay={0.15} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[var(--color-gold)] text-2xl">◈</span>
                  <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)]">代表技法</h2>
                </div>
                <div className="divider-pattern mb-6" />
                <div className="flex flex-wrap gap-3">
                  {item.techniques.map((t, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 border border-[var(--color-gold)] text-[var(--color-ink)] font-serif text-sm rounded-sm bg-[var(--color-cream)] hover:bg-[var(--color-gold)]/20 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </ScrollReveal>

              {/* Section 4: Representative Works */}
              <ScrollReveal delay={0.2} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[var(--color-gold)] text-2xl">◈</span>
                  <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)]">代表作品</h2>
                </div>
                <div className="divider-pattern mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.representativeWorks.map((w, i) => (
                    <div
                      key={i}
                      className="glass-card p-4 rounded-sm flex items-center gap-3"
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: item.accentColor }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-serif text-gray-700">{w}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Back Button */}
              <ScrollReveal delay={0.25}>
                <Link to="/encyclopedia" className="btn-primary">
                  ← 返回刺绣图鉴
                </Link>
              </ScrollReveal>
            </div>

            {/* Right Sidebar: Related Masters */}
            {relatedMasters.length > 0 && (
              <div className="lg:w-80 flex-shrink-0">
                <ScrollReveal>
                  <div className="sticky top-20">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[var(--color-gold)]">◈</span>
                      <h3 className="text-lg font-serif font-bold text-[var(--color-ink)]">相关传承人</h3>
                    </div>
                    <div className="space-y-4">
                      {relatedMasters.map((master) => (
                        <div key={master.id} className="glass-card rounded-sm overflow-hidden card-hover">
                          <div className="img-zoom h-40">
                            <img
                              src={master.image}
                              alt={master.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${master.id}/400/300`;
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-serif font-bold text-[var(--color-ink)] mb-1">{master.name}</h4>
                            <p className="text-xs text-[var(--color-primary)] font-serif mb-2">{master.title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{master.description}</p>
                            <p className="text-xs text-gray-400 mt-2 font-serif">{master.region}</p>
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
