import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { embroideryTypes } from '../data/embroidery';

const regions = ['全部', '西南地区', '江南地区', '中南地区', '中原地区', '岭南地区'];
const difficulties = ['全部', '入门', '进阶', '高手'] as const;

export default function EncyclopediaPage() {
  const [regionFilter, setRegionFilter] = useState('全部');
  const [diffFilter, setDiffFilter] = useState<string>('全部');
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-80px' });

  const filtered = embroideryTypes.filter((e) => {
    const regionOk = regionFilter === '全部' || e.region === regionFilter;
    const diffOk = diffFilter === '全部' || e.difficulty === diffFilter;
    return regionOk && diffOk;
  });

  const diffStyle: Record<string, string> = {
    入门: 'bg-[rgba(26,107,74,0.2)] text-emerald-400 border border-[rgba(26,107,74,0.4)]',
    进阶: 'bg-[rgba(201,168,76,0.15)] text-[#C9A84C] border border-[rgba(201,168,76,0.35)]',
    高手: 'bg-[rgba(192,57,43,0.15)] text-[#E74C3C] border border-[rgba(192,57,43,0.35)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#080c14]"
    >
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(300px, 55vh, 560px)' }}>
        <img
          src="https://images.unsplash.com/photo-1490750967868-88df5691cc51?w=1920&h=600&fit=crop"
          alt="刺绣图鉴"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/encyclopedia/1920/600'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#080c14]" />
        <div
          className="deco-bg-char absolute right-0 top-1/2 -translate-y-1/2 select-none"
          style={{ fontSize: 'clamp(10rem, 28vw, 24rem)' }}
        >
          鉴
        </div>
        <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[#C9A84C] tracking-[8px] text-xs mb-3">EMBROIDERY ENCYCLOPEDIA</p>
            <h1
              className="text-white font-serif font-black leading-none"
              style={{ fontSize: 'var(--text-display)', letterSpacing: 'var(--tracking-tight)' }}
            >
              刺绣图鉴
            </h1>
            <div className="gold-thin-line w-48 mt-5" />
          </motion.div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="sticky top-0 z-20 bg-[#080c14]/98 backdrop-blur border-b border-[rgba(201,168,76,0.12)]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-[rgba(232,220,200,0.35)] mr-1 whitespace-nowrap tracking-[3px]">地区</span>
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1 text-xs border transition-all duration-200 tracking-wider ${
                    regionFilter === r
                      ? 'bg-[#C9A84C] text-[#080c14] border-[#C9A84C] font-bold'
                      : 'border-[rgba(201,168,76,0.25)] text-[rgba(232,220,200,0.45)] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                  }`}
                >{r}</button>
              ))}
            </div>
            <div className="hidden sm:block h-5 w-px bg-[rgba(201,168,76,0.12)]" />
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-[rgba(232,220,200,0.35)] mr-1 whitespace-nowrap tracking-[3px]">难度</span>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-3 py-1 text-xs border transition-all duration-200 tracking-wider ${
                    diffFilter === d
                      ? 'bg-[#C0392B] text-white border-[#C0392B]'
                      : 'border-[rgba(192,57,43,0.25)] text-[rgba(232,220,200,0.45)] hover:border-[#C0392B] hover:text-[#E74C3C]'
                  }`}
                >{d}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 卡片网格 */}
      <div className="max-w-7xl mx-auto px-4 py-12" ref={gridRef}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: gridInView ? 1 : 0 }}
          className="text-[rgba(232,220,200,0.3)] text-xs mb-8 tracking-[3px]"
        >
          共找到 <span className="text-[#C9A84C] font-bold text-sm">{filtered.length}</span> 个绣种
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={regionFilter + diffFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/encyclopedia/${item.id}`}>
                  <div className="card-art overflow-hidden group h-full flex flex-col cursor-pointer">
                    <div className="img-zoom relative" style={{ aspectRatio: '16/10' }}>
                      <img
                        src={item.coverImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/600/375`; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                      <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 ${diffStyle[item.difficulty]}`}>
                        {item.difficulty}
                      </span>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-2xl font-serif font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                          {item.name}
                        </h3>
                        <p className="text-[#C9A84C] text-xs tracking-[3px] mt-1">{item.province}</p>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 border-t border-[rgba(201,168,76,0.1)]">
                      <p className="text-[rgba(232,220,200,0.4)] text-xs italic mb-3 tracking-wider">{item.tagline}</p>
                      <p className="text-sm text-[rgba(232,220,200,0.38)] leading-relaxed line-clamp-2 flex-1">{item.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.characteristics.slice(0, 3).map((c, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 border border-[rgba(201,168,76,0.2)] text-[rgba(201,168,76,0.5)]">
                            {c}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-1.5 items-center">
                        {item.colors.map((c, i) => (
                          <span key={i} className="w-5 h-5 rounded-sm border border-white/10" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[rgba(201,168,76,0.08)] flex items-center justify-between">
                        <span className="text-xs text-[rgba(232,220,200,0.22)]">{item.region}</span>
                        <span className="text-xs text-[#C9A84C]">查看详情 →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-[rgba(232,220,200,0.3)] font-serif">
            <p className="text-4xl mb-4">🪡</p>
            <p>暂无符合条件的绣种</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
