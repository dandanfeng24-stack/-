import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { embroideryTypes, masters } from '../data/embroidery';
import ParticleCanvas from '../components/ParticleCanvas';

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div className="min-h-screen bg-[#080c14]">

      {/* ── 英雄区 ── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-end overflow-hidden bg-[#040609]"
      >
        {/* 粒子成型动画 */}
        <ParticleCanvas />

        {/* 径向光晕 */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-1/4 top-1/3 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(192,57,43,0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <div
            className="absolute right-1/4 bottom-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        </div>

        {/* 右侧超大装饰字 */}
        <div
          className="deco-bg-char absolute right-[-2vw] top-1/2 -translate-y-1/2 select-none"
          style={{ fontSize: 'clamp(16rem, 42vw, 38rem)' }}
        >
          绣
        </div>

        {/* 左侧竖排装饰 */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 items-center select-none pointer-events-none"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="font-serif text-[#C9A84C]/20 text-sm tracking-[0.3em]">非遗传承</span>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent" />
          <span className="font-serif text-[#C9A84C]/20 text-sm tracking-[0.3em]">千年技艺</span>
        </div>

        {/* 主内容：左对齐，贴底 */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 px-8 md:px-16 lg:px-24 pb-20 md:pb-28 max-w-7xl w-full"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="section-number text-xs tracking-[8px] mb-6"
          >
            中国非物质文化遗产
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-black text-white mb-6"
            style={{
              fontSize: 'var(--text-hero)',
              letterSpacing: 'var(--tracking-tight)',
              lineHeight: 'var(--leading-display)',
            }}
          >
            <span className="block text-glow">华绣</span>
            <span className="block text-[#C9A84C]">千年</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="gold-thin-line w-48 origin-left mb-7"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-serif text-[#E8DCC8] mb-3"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', letterSpacing: '0.05em' }}
          >
            针针皆故事，线线有温度
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-[rgba(232,220,200,0.45)] text-base mb-10 max-w-md"
          >
            汇聚苗绣、苏绣、蜀绣等六大非遗刺绣，让传统技艺在指尖绽放
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <Link to="/encyclopedia" className="btn-primary flex items-center gap-2 text-sm">
              探索刺绣图鉴
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/videos"
              className="flex items-center gap-2 text-[rgba(232,220,200,0.7)] hover:text-[#C9A84C] border border-[rgba(201,168,76,0.3)] hover:border-[#C9A84C] px-6 py-2.5 transition-all duration-400 text-sm tracking-wider"
            >
              <Play size={15} className="text-[#C9A84C]" />
              观看视频教程
            </Link>
          </motion.div>
        </motion.div>

        {/* 向下滚动提示 */}
        <motion.div
          className="absolute bottom-8 left-8 md:left-16 lg:left-24 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-px h-14 bg-gradient-to-b from-transparent via-[#C9A84C]/50 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* ── 统计数据 ── */}
      <section className="bg-[#040609] py-16 border-y border-[rgba(201,168,76,0.1)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(201,168,76,0.08)]">
            {[
              { number: '6', unit: '种', label: '非遗绣种' },
              { number: '120', unit: '+', label: '传承人档案' },
              { number: '500', unit: '+', label: '精品视频' },
              { number: '10万', unit: '+', label: '绣艺爱好者' },
            ].map(({ number, unit, label }, i) => (
              <ScrollReveal key={label} delay={i * 0.1}>
                <div className="text-center px-4 py-6 md:px-8">
                  <div
                    className="font-serif font-black leading-none mb-2"
                    style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', letterSpacing: '-0.04em' }}
                  >
                    <span className="text-[#C9A84C]">{number}</span>
                    <span className="text-[rgba(201,168,76,0.4)] text-2xl ml-1">{unit}</span>
                  </div>
                  <div className="text-[rgba(232,220,200,0.4)] text-xs tracking-[4px] mt-1">{label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 六大绣种（横向一排）── */}
      <section className="py-24 bg-[#080c14]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <ScrollReveal>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="section-number text-xs tracking-[6px]">壹 · 六大绣种</span>
                <h2
                  className="font-serif font-black text-white"
                  style={{ fontSize: 'var(--text-section)', letterSpacing: 'var(--tracking-tight)' }}
                >
                  非遗刺绣图鉴
                </h2>
              </div>
              <Link
                to="/encyclopedia"
                className="hidden md:flex items-center gap-2 text-[rgba(232,220,200,0.5)] hover:text-[#C9A84C] text-sm tracking-wider transition-colors"
              >
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          {/* 六大绣种 - 桌面6列，平板3列，手机2列 */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {embroideryTypes.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/encyclopedia/${item.id}`}>
                  <div className="card-art rounded-2xl overflow-hidden group cursor-pointer h-full">
                    {/* 图片区 */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                      <img
                        src={item.coverImage}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/400/533`;
                        }}
                      />
                      {/* 渐变遮罩 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      {/* hover 红色光效 */}
                      <div className="absolute inset-0 bg-[#C0392B]/0 group-hover:bg-[#C0392B]/10 transition-all duration-500" />
                      {/* 难度徽章 */}
                      <span className="absolute top-3 right-3 text-xs bg-black/50 border border-[rgba(201,168,76,0.5)] text-[#C9A84C] px-2 py-0.5 tracking-wider">
                        {item.difficulty}
                      </span>
                      {/* 底部信息 */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3
                          className="font-serif font-bold text-white mb-1"
                          style={{ fontSize: 'clamp(1.3rem, 2vw, 1.6rem)', letterSpacing: '-0.02em' }}
                        >
                          {item.name}
                        </h3>
                        <p className="text-[#C9A84C] text-xs tracking-[3px]">{item.province}</p>
                      </div>
                    </div>
                    {/* 文字区 */}
                    <div className="p-4 border-t border-[rgba(201,168,76,0.15)]">
                      <p className="text-[rgba(232,220,200,0.5)] text-xs leading-relaxed line-clamp-2">
                        {item.tagline}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10 md:hidden">
              <Link to="/encyclopedia" className="btn-primary inline-flex items-center gap-2">
                查看全部图鉴
                <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 传承人推荐 ── */}
      <section className="py-24 bg-[#040609]">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="mb-14 text-center relative">
              <div
                className="deco-bg-char select-none"
                style={{
                  fontSize: 'clamp(10rem, 28vw, 22rem)',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                匠
              </div>
              <span className="section-number text-xs tracking-[6px] relative z-10">贰 · 大国工匠</span>
              <h2
                className="font-serif font-black text-white relative z-10"
                style={{ fontSize: 'var(--text-section)', letterSpacing: 'var(--tracking-tight)' }}
              >
                非遗传承人
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {masters.map((master, i) => (
              <ScrollReveal key={master.id} delay={i * 0.1}>
                <div className="flip-card cursor-pointer">
                  <div className="flip-card-inner">
                    {/* 正面 */}
                    <div className="flip-card-front">
                      <img
                        src={master.image}
                        alt={master.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${master.id}/400/500`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-xl font-serif text-white font-bold">{master.name}</h3>
                        <p className="text-[#C9A84C] text-xs tracking-wider mt-1">{master.embroideryType} · {master.region}</p>
                        <p className="text-white/50 text-xs mt-1">{master.title}</p>
                      </div>
                    </div>
                    {/* 背面 */}
                    <div className="flip-card-back text-center">
                      <div className="text-[#C9A84C] text-2xl font-serif font-bold mb-3">{master.name}</div>
                      <div className="gold-thin-line mb-4" />
                      <div className="text-[rgba(232,220,200,0.75)] text-sm leading-relaxed mb-4">{master.description}</div>
                      <div className="mt-auto text-xs text-[rgba(201,168,76,0.7)] border-t border-white/10 pt-3">
                        {master.achievement}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="text-center mt-12">
              <Link
                to="/masters"
                className="inline-flex items-center gap-2 text-[rgba(232,220,200,0.6)] hover:text-[#C9A84C] border border-[rgba(201,168,76,0.25)] hover:border-[rgba(201,168,76,0.6)] px-7 py-3 text-sm tracking-wider transition-all duration-400"
              >
                认识更多传承人
                <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 精选视频 ── */}
      <section className="py-24 bg-[#080c14]">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="section-number text-xs tracking-[6px]">叁 · 学习社区</span>
              <h2
                className="font-serif font-black text-white"
                style={{ fontSize: 'var(--text-section)', letterSpacing: 'var(--tracking-tight)' }}
              >
                精选视频
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: '苗绣入门：蝴蝶纹基础针法',
                type: '教程视频',
                typeColor: '#C0392B',
                img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop',
                time: '28:45',
              },
              {
                title: '苏绣双面绣大师示范',
                type: '精品展示',
                typeColor: '#C9A84C',
                img: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&h=340&fit=crop',
                time: '15:32',
              },
              {
                title: '我的第一幅苗绣作品完成了！',
                type: '用户投稿',
                typeColor: '#1A6B4A',
                img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=340&fit=crop',
                time: '12:18',
              },
            ].map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <Link to="/videos">
                  <div className="card-art overflow-hidden group cursor-pointer">
                    <div className="img-zoom relative" style={{ aspectRatio: '16/9' }}>
                      <img src={v.img} alt={v.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-[#C0392B]/90 flex items-center justify-center border border-[#C9A84C]/60">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      <span
                        className="absolute top-3 left-3 text-white text-xs px-2 py-0.5"
                        style={{ backgroundColor: v.typeColor }}
                      >
                        {v.type}
                      </span>
                      <span className="absolute bottom-3 right-3 text-white text-xs bg-black/70 px-2 py-0.5 font-mono">
                        {v.time}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[#E8DCC8] font-serif font-medium text-sm leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
                        {v.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/videos" className="btn-primary inline-flex items-center gap-2">
                进入视频中心
                <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 页脚 ── */}
      <footer className="bg-[#040609] border-t border-[rgba(201,168,76,0.1)] py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* 大标题装饰 */}
          <div className="text-center mb-12 relative overflow-hidden">
            <div
              className="deco-bg-char select-none absolute inset-0 flex items-center justify-center"
              style={{ fontSize: 'clamp(6rem, 18vw, 14rem)' }}
            >
              华绣志
            </div>
            <div className="relative z-10">
              <div className="gold-thin-line max-w-sm mx-auto mb-6" />
              <h3 className="text-[#C9A84C] font-serif text-2xl tracking-[0.2em] mb-2">华绣志</h3>
              <p className="text-[rgba(232,220,200,0.3)] text-sm tracking-[4px]">中国非遗刺绣文化平台</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {[
              { title: '内容导航', links: ['刺绣图鉴', '视频中心', '作品广场', '传承人'] },
              { title: '关于平台', links: ['平台介绍', '内容来源', '版权声明', '联系我们'] },
              { title: '加入我们', links: ['上传作品', '成为传承人', '内容合作', '志愿者'] },
            ].map(({ title, links }) => (
              <div key={title} className="text-center md:text-left">
                <h4 className="text-[rgba(232,220,200,0.6)] text-xs tracking-[4px] mb-4 font-serif">{title}</h4>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-[rgba(232,220,200,0.3)] text-sm hover:text-[#C9A84C] transition-colors tracking-wider">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="gold-thin-line mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[rgba(232,220,200,0.2)] text-xs tracking-wider">© 2024 华绣志 · 中国非遗刺绣文化平台</p>
            <p className="text-[rgba(232,220,200,0.15)] text-xs">内容来源：Wikimedia Commons · Met Museum Open Access</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
