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
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="card-art overflow-hidden flex flex-col cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="img-zoom relative bg-black" style={{ aspectRatio: '16/9' }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${video.id}/600/340`; }}
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-[#C0392B]/90 flex items-center justify-center border border-[rgba(201,168,76,0.5)] shadow-xl">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <span className="absolute bottom-2 right-2 text-xs bg-black/80 text-[#E8DCC8] px-2 py-0.5 font-mono">
          {video.duration}
        </span>
        <span
          className={`absolute top-2 left-2 text-xs px-2 py-0.5 ${
            video.category === 'tutorial'
              ? 'bg-[#2C3E7A]/90 text-white'
              : video.category === 'showcase'
              ? 'bg-[rgba(201,168,76,0.9)] text-[#080c14]'
              : 'bg-[#C0392B]/90 text-white'
          }`}
        >
          {video.category === 'tutorial' ? '教程' : video.category === 'showcase' ? '展示' : '投稿'}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1 border-t border-[rgba(201,168,76,0.1)]">
        <h3 className="font-serif font-bold text-[#E8DCC8] mb-2 leading-snug line-clamp-2">{video.title}</h3>
        <p className="text-sm text-[rgba(232,220,200,0.38)] leading-relaxed line-clamp-2 flex-1">{video.description}</p>
        <div className="mt-4 pt-3 border-t border-[rgba(201,168,76,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[rgba(232,220,200,0.28)]">
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
          <span className="text-xs text-[rgba(232,220,200,0.22)]">{video.uploader}</span>
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
      className="min-h-screen bg-[#080c14]"
    >
      {/* Hero */}
      <div
        className="bg-[#040609] relative overflow-hidden"
        style={{ minHeight: 'clamp(260px, 45vh, 480px)' }}
      >
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[rgba(192,57,43,0.06)] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-[rgba(201,168,76,0.05)] blur-3xl pointer-events-none" />
        <div
          className="deco-bg-char absolute right-0 top-1/2 -translate-y-1/2 select-none"
          style={{ fontSize: 'clamp(10rem, 28vw, 24rem)' }}
        >
          影
        </div>
        <div
          className="relative z-10 flex flex-col justify-end h-full px-8 md:px-16 pb-12"
          style={{ minHeight: 'clamp(260px, 45vh, 480px)' }}
          ref={headerRef}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[#C9A84C] tracking-[8px] text-xs mb-3">VIDEO CENTER</p>
            <h1
              className="text-white font-serif font-black leading-none"
              style={{ fontSize: 'var(--text-display)', letterSpacing: 'var(--tracking-tight)' }}
            >
              视频中心
            </h1>
            <div className="gold-thin-line w-48 mt-5" />
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#080c14]/98 backdrop-blur border-b border-[rgba(201,168,76,0.12)] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-4 text-sm tracking-wider transition-colors duration-200 font-serif ${
                  activeTab === tab.key
                    ? 'text-[#C9A84C]'
                    : 'text-[rgba(232,220,200,0.4)] hover:text-[rgba(232,220,200,0.7)]'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C0392B]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {activeTab === 'user' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between p-5 border border-[rgba(201,168,76,0.2)] bg-[rgba(255,255,255,0.02)]"
          >
            <div>
              <p className="text-[#E8DCC8] font-serif font-bold">分享您的刺绣作品</p>
              <p className="text-sm text-[rgba(232,220,200,0.4)] mt-0.5">上传视频，让更多人欣赏您的技艺</p>
            </div>
            <button className="btn-primary text-sm whitespace-nowrap">＋ 上传作品</button>
          </motion.div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-[rgba(232,220,200,0.3)] font-serif">
            <p className="text-4xl mb-4">🎬</p>
            <p>该分类暂无视频</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
