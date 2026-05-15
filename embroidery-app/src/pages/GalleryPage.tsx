import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

interface GalleryWork {
  id: string;
  title: string;
  author: string;
  embroideryType: string;
  image: string;
  likes: number;
  views: number;
  tags: string[];
}

const galleryWorks: GalleryWork[] = [
  { id: 'g1', title: '蝴蝶双飞', author: '苗绣工坊', embroideryType: '苗绣', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop&seed=g1', likes: 342, views: 2840, tags: ['苗绣', '蝴蝶', '传统纹样'] },
  { id: 'g2', title: '金鱼戏水', author: '姚氏绣坊', embroideryType: '苏绣', image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&h=700&fit=crop&seed=g2', likes: 891, views: 7620, tags: ['苏绣', '双面绣', '金鱼'] },
  { id: 'g3', title: '竹林熊猫', author: '郝氏蜀绣', embroideryType: '蜀绣', image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&h=900&fit=crop&seed=g3', likes: 1204, views: 9830, tags: ['蜀绣', '熊猫', '国宝'] },
  { id: 'g4', title: '百虎雄风', author: '湘绣传承社', embroideryType: '湘绣', image: 'https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?w=600&h=750&fit=crop&seed=g4', likes: 677, views: 5410, tags: ['湘绣', '老虎', '鬅毛针'] },
  { id: 'g5', title: '清明上河局部', author: '汴京绣苑', embroideryType: '汴绣', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc51?w=600&h=680&fit=crop&seed=g5', likes: 543, views: 4200, tags: ['汴绣', '宋画', '古风'] },
  { id: 'g6', title: '百鸟朝凤屏风', author: '岭南绣艺坊', embroideryType: '粤绣', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=820&fit=crop&seed=g6', likes: 988, views: 8310, tags: ['粤绣', '百鸟朝凤', '金银线'] },
  { id: 'g7', title: '龙凤呈祥', author: '云裳刺绣', embroideryType: '苗绣', image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&h=760&fit=crop&seed=g7', likes: 432, views: 3540, tags: ['苗绣', '龙凤', '吉祥纹'] },
  { id: 'g8', title: '荷塘月色', author: '绣娘小云', embroideryType: '苏绣', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=700&fit=crop&seed=g8', likes: 256, views: 1980, tags: ['苏绣', '荷花', '写意'] },
  { id: 'g9', title: '芙蓉锦鲤', author: '蜀绣新语', embroideryType: '蜀绣', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=860&fit=crop&seed=g9', likes: 765, views: 6230, tags: ['蜀绣', '芙蓉', '锦鲤'] },
  { id: 'g10', title: '孔雀开屏', author: '粤韵绣坊', embroideryType: '粤绣', image: 'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=600&h=780&fit=crop&seed=g10', likes: 1120, views: 9120, tags: ['粤绣', '孔雀', '垫高绣'] },
];

const filterTypes = ['全部', '苗绣', '苏绣', '蜀绣', '湘绣', '汴绣', '粤绣'];

function WorkCard({ work, index }: { work: GalleryWork; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="card-art overflow-hidden mb-5 break-inside-avoid cursor-pointer group"
    >
      <div className="img-zoom relative overflow-hidden">
        <img
          src={work.image}
          alt={work.title}
          className="w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${work.id}/600/800`; }}
        />
        <span className="absolute top-3 left-3 text-xs px-2 py-0.5 bg-[rgba(192,57,43,0.85)] text-white">
          {work.embroideryType}
        </span>
        {/* hover 金色渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(201,168,76,0.15)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-4">
        <h3 className="font-serif font-bold text-[#E8DCC8] mb-2 leading-snug">{work.title}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {work.tags.map((tag, i) => (
            <span key={i} className="text-xs px-1.5 py-0.5 border border-[rgba(201,168,76,0.2)] text-[rgba(201,168,76,0.5)]">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-[rgba(232,220,200,0.25)] border-t border-[rgba(201,168,76,0.1)] pt-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {work.likes}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {work.views}
          </span>
          <span className="ml-auto text-[rgba(232,220,200,0.2)]">{work.author}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [filter, setFilter] = useState('全部');
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const filtered = galleryWorks.filter((w) => filter === '全部' || w.embroideryType === filter);

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
          src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1920&h=500&fit=crop"
          alt="作品广场"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/gallery/1920/500'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#080c14]" />
        <div
          className="deco-bg-char absolute right-0 top-1/2 -translate-y-1/2 select-none"
          style={{ fontSize: 'clamp(10rem, 28vw, 24rem)' }}
        >
          藏
        </div>
        <div className="absolute top-6 right-6 z-10">
          <button className="btn-primary text-xs">＋ 上传作品</button>
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
            <p className="text-[#C9A84C] tracking-[8px] text-xs mb-3">WORKS GALLERY</p>
            <h1
              className="text-white font-serif font-black leading-none"
              style={{ fontSize: 'var(--text-display)', letterSpacing: 'var(--tracking-tight)' }}
            >
              作品广场
            </h1>
            <div className="gold-thin-line w-48 mt-5" />
          </motion.div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="sticky top-0 z-20 bg-[#080c14]/98 backdrop-blur border-b border-[rgba(201,168,76,0.12)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-[rgba(232,220,200,0.35)] mr-1 tracking-[3px]">绣种</span>
            {filterTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 text-xs border transition-all duration-200 tracking-wider ${
                  filter === type
                    ? 'bg-[#C9A84C] text-[#080c14] border-[#C9A84C] font-bold'
                    : 'border-[rgba(201,168,76,0.25)] text-[rgba(232,220,200,0.45)] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                }`}
              >{type}</button>
            ))}
          </div>
          <span className="text-xs text-[rgba(232,220,200,0.25)] whitespace-nowrap ml-4 hidden sm:block tracking-wider">
            共 <span className="text-[#C9A84C]">{filtered.length}</span> 件
          </span>
        </div>
      </div>

      {/* 瀑布流 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 sm:columns-2 md:columns-3 gap-5"
          >
            {filtered.map((work, index) => (
              <WorkCard key={work.id} work={work} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-24 text-[rgba(232,220,200,0.3)] font-serif">
            <p className="text-4xl mb-4">🪡</p>
            <p>该绣种暂无作品</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
