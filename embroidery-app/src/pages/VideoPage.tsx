import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { videos } from '../data/embroidery';
import type { Video } from '../data/embroidery';

type Tab = 'tutorial' | 'showcase' | 'user';

const tabs: { key: Tab; label: string }[] = [
  { key: 'tutorial', label: '教程视频' },
  { key: 'showcase', label: '精品展示' },
  { key: 'user', label: '用户投稿' },
];

function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toString();
}

function VideoCard({ video, index }: { video: Video; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="card-hover bg-white rounded shadow-md overflow-hidden flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="img-zoom relative h-48 bg-gray-900">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${video.id}/600/340`;
          }}
        />
        {/* Play button overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/90 flex items-center justify-center shadow-xl">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration */}
        <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded font-mono">
          {video.duration}
        </span>
        {/* Category badge */}
        <span
          className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-sm font-serif ${
            video.category === 'tutorial'
              ? 'bg-blue-600/90 text-white'
              : video.category === 'showcase'
              ? 'bg-[var(--color-gold)]/90 text-black'
              : 'bg-[var(--color-primary)]/90 text-white'
          }`}
        >
          {video.category === 'tutorial' ? '教程' : video.category === 'showcase' ? '展示' : '投稿'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-[var(--color-ink)] mb-2 leading-snug line-clamp-2">
          {video.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">{video.description}</p>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatNumber(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {formatNumber(video.likes)}
            </span>
          </div>
          <div className="text-xs text-gray-400 font-serif">{video.uploader}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VideoPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tutorial');
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const filtered = videos.filter((v) => v.category === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#FDF6E3] bg-silk-texture"
    >
      {/* Hero */}
      <div className="bg-ink-gradient relative overflow-hidden" style={{ minHeight: '280px' }}>
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 w-60 h-60 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20" ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[var(--color-gold)] tracking-[6px] text-xs mb-3 font-serif">VIDEO CENTER</p>
            <h1 className="text-white text-4xl md:text-6xl font-serif font-bold tracking-widest mb-4">
              视频中心
            </h1>
            <div className="divider-pattern w-40 mx-auto my-4" />
            <p className="text-white/60 font-serif tracking-wide">
              观赏非遗刺绣的精湛工艺，与大师同行
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-4 font-serif text-sm tracking-wider transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'text-[var(--color-primary)]'
                    : 'text-gray-500 hover:text-[var(--color-ink)]'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-gold)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* User upload CTA */}
        {activeTab === 'user' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between p-4 bg-white rounded shadow-sm border border-[var(--color-gold)]/20"
          >
            <div className="font-serif">
              <p className="text-[var(--color-ink)] font-bold">分享您的刺绣作品</p>
              <p className="text-sm text-gray-500 mt-0.5">上传视频，让更多人欣赏您的技艺</p>
            </div>
            <button className="btn-primary text-sm whitespace-nowrap">
              ＋ 上传我的作品
            </button>
          </motion.div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400 font-serif">
            <p className="text-4xl mb-4">🎬</p>
            <p>该分类暂无视频</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
