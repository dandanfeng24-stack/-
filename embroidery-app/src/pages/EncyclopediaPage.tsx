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

  const diffColor: Record<string, string> = {
    入门: 'bg-green-100 text-green-700 border-green-300',
    进阶: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    高手: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#FDF6E3] bg-silk-texture"
    >
      {/* Hero Banner */}
      <div className="relative h-[420px] md:h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490750967868-88df5691cc51?w=1920&h=600&fit=crop"
          alt="刺绣图鉴"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/encyclopedia/1920/600';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <p className="text-[var(--color-gold)] tracking-[6px] text-sm mb-3 font-serif">EMBROIDERY ENCYCLOPEDIA</p>
            <h1 className="text-white text-5xl md:text-7xl font-serif font-bold mb-4 tracking-widest">
              刺绣图鉴
            </h1>
            <div className="divider-pattern w-48 mx-auto my-4" />
            <p className="text-white/80 text-lg md:text-xl font-serif tracking-wide mt-4">
              探索六大非遗绣种，感受千年技艺之美
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-20 bg-[#FDF6E3]/95 backdrop-blur border-b border-[var(--color-gold)]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Region Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500 font-serif mr-1 whitespace-nowrap">地区：</span>
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1 text-sm border rounded-sm font-serif transition-all duration-200 ${
                    regionFilter === r
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="hidden sm:block h-6 w-px bg-gray-200" />
            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500 font-serif mr-1 whitespace-nowrap">难度：</span>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-3 py-1 text-sm border rounded-sm font-serif transition-all duration-200 ${
                    diffFilter === d
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12" ref={gridRef}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: gridInView ? 1 : 0 }}
          className="text-gray-500 text-sm mb-8 font-serif"
        >
          共找到 <span className="text-[var(--color-primary)] font-bold">{filtered.length}</span> 个绣种
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={regionFilter + diffFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <Link to={`/encyclopedia/${item.id}`}>
                  <div className="card-hover bg-white rounded shadow-md overflow-hidden border border-gray-100 h-full flex flex-col">
                    {/* Image */}
                    <div className="img-zoom h-52 relative">
                      <img
                        src={item.coverImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/600/400`;
                        }}
                      />
                      {/* Difficulty badge */}
                      <span
                        className={`absolute top-3 right-3 text-xs px-2 py-0.5 border rounded-sm font-serif ${diffColor[item.difficulty]}`}
                      >
                        {item.difficulty}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-serif font-bold text-[var(--color-ink)]">{item.name}</h3>
                        <span className="text-xs text-gray-400 font-serif">{item.province}</span>
                      </div>
                      <p className="text-sm text-[var(--color-primary)] font-serif italic mb-3">{item.tagline}</p>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 flex-1">{item.description}</p>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.characteristics.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 bg-[var(--color-cream)] border border-[var(--color-gold)]/40 text-gray-600 rounded-sm font-serif"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Color swatches */}
                      <div className="mt-3 flex gap-1.5 items-center">
                        {item.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-4 h-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-serif">{item.region}</span>
                        <span className="text-xs text-[var(--color-primary)] font-serif">查看详情 →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400 font-serif">
            <p className="text-4xl mb-4">🪡</p>
            <p>暂无符合条件的绣种</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
