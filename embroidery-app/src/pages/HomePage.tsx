import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Star, Users, BookOpen } from 'lucide-react';
import { embroideryTypes, masters } from '../data/embroidery';

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen">

      {/* ── 英雄区 ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 背景图 + 视差 */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&q=80"
            alt="苗绣背景"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#1a1a2e]" />
          {/* 流动光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#C0392B]/10 via-transparent to-[#D4AC0D]/10 animate-pulse" style={{ animationDuration: '4s' }} />
        </motion.div>

        {/* 浮动装饰纹样 */}
        <motion.div
          className="absolute top-20 right-10 text-[#D4AC0D]/15 text-9xl font-serif pointer-events-none select-none"
          animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          绣
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-8 text-[#C0392B]/10 text-7xl font-serif pointer-events-none select-none"
          animate={{ y: [0, 10, 0], rotate: [0, -1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          华
        </motion.div>

        {/* 英雄内容 */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4"
          >
            <span className="inline-block text-[#D4AC0D] text-sm tracking-[6px] border border-[#D4AC0D]/40 px-4 py-1.5 mb-6">
              中国非物质文化遗产
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
          >
            <span className="text-glow">华绣</span>
            <span className="text-[#D4AC0D]">千年</span>
            <br />
            <span className="text-3xl md:text-5xl text-white/80 font-light">针针皆故事，线线有温度</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-white/60 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            汇聚苗绣、苏绣、蜀绣等六大非遗刺绣，让传统技艺在指尖绽放
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/encyclopedia" className="btn-primary flex items-center gap-2 text-sm">
              探索刺绣图鉴
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/videos"
              className="flex items-center gap-2 text-white/80 hover:text-white border border-white/30 hover:border-white/60 px-6 py-2.5 transition-all duration-300 text-sm tracking-wider"
            >
              <Play size={16} className="text-[#D4AC0D]" />
              观看视频教程
            </Link>
          </motion.div>
        </motion.div>

        {/* 向下滚动提示 */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#D4AC0D]/60 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* ── 统计数据 ── */}
      <section className="bg-[#1a1a2e] py-12 border-y border-[#D4AC0D]/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, number: '6+', label: '非遗绣种' },
              { icon: Users, number: '120+', label: '传承人档案' },
              { icon: Play, number: '500+', label: '精品视频' },
              { icon: Star, number: '10万+', label: '绣艺爱好者' },
            ].map(({ icon: Icon, number, label }, i) => (
              <ScrollReveal key={label} delay={i * 0.1}>
                <div className="text-center">
                  <Icon className="w-6 h-6 text-[#D4AC0D] mx-auto mb-2 opacity-70" />
                  <div className="text-3xl font-serif text-white font-bold">{number}</div>
                  <div className="text-white/50 text-sm tracking-wider mt-1">{label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 刺绣品类入口 ── */}
      <section className="py-20 bg-silk-texture bg-[#FDF6E3]">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-[#C0392B] text-sm tracking-[4px]">非遗珍藏</span>
              <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a2e] mt-3 mb-4">六大刺绣品类</h2>
              <div className="divider-pattern max-w-xs mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {embroideryTypes.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.1}>
                <Link to={`/encyclopedia/${item.id}`}>
                  <div className="card-hover rounded-sm overflow-hidden shadow-md group cursor-pointer">
                    <div className="img-zoom relative h-52">
                      <img
                        src={item.coverImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/600/400`;
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: item.bgPattern, opacity: 0 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="text-xs bg-black/40 text-[#D4AC0D] border border-[#D4AC0D]/40 px-2 py-0.5 tracking-wider">
                          {item.difficulty}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-2xl font-serif text-white">{item.name}</h3>
                        <p className="text-white/60 text-xs tracking-wider">{item.province}</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 border-t border-[#D4AC0D]/20">
                      <p className="text-[#C0392B] text-xs tracking-wider mb-1.5">{item.tagline}</p>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {item.characteristics.slice(0, 3).map((c) => (
                          <span key={c} className="text-xs bg-[#FDF6E3] text-[#922B21] border border-[#C0392B]/20 px-2 py-0.5 rounded-sm">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/encyclopedia" className="btn-primary inline-flex items-center gap-2">
                查看全部图鉴
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 传承人推荐 ── */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-[#D4AC0D] text-sm tracking-[4px]">匠心传承</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mt-3 mb-4">非遗传承人</h2>
              <div className="h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-[#D4AC0D] to-transparent" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {masters.map((master, i) => (
              <ScrollReveal key={master.id} delay={i * 0.12}>
                <div className="flip-card cursor-pointer">
                  <div className="flip-card-inner">
                    {/* 正面 */}
                    <div className="flip-card-front">
                      <img
                        src={master.image}
                        alt={master.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-xl font-serif text-white">{master.name}</h3>
                        <p className="text-[#D4AC0D] text-xs tracking-wider mt-1">{master.embroideryType} · {master.region}</p>
                        <p className="text-white/60 text-xs mt-1">{master.title}</p>
                      </div>
                    </div>
                    {/* 背面 */}
                    <div className="flip-card-back text-center">
                      <div className="text-[#D4AC0D] text-3xl font-serif mb-4">{master.name}</div>
                      <div className="text-white/80 text-sm leading-relaxed mb-4">{master.description}</div>
                      <div className="text-xs text-[#D4AC0D]/70 border-t border-white/20 pt-3 mt-auto">
                        {master.achievement}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10">
              <Link
                to="/masters"
                className="inline-flex items-center gap-2 text-white/70 hover:text-[#D4AC0D] border border-white/20 hover:border-[#D4AC0D]/50 px-6 py-2.5 text-sm tracking-wider transition-all duration-300"
              >
                认识更多传承人
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 视频推荐 ── */}
      <section className="py-20 bg-silk-texture bg-[#FDF6E3]">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-[#C0392B] text-sm tracking-[4px]">学习社区</span>
              <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a2e] mt-3 mb-4">精选视频</h2>
              <div className="divider-pattern max-w-xs mx-auto" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: '苗绣入门：蝴蝶纹基础针法',
                  type: '教程视频',
                  typeColor: 'bg-[#C0392B]',
                  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop',
                  time: '28:45',
                },
                {
                  title: '苏绣双面绣大师示范',
                  type: '精品展示',
                  typeColor: 'bg-[#D4AC0D]',
                  img: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&h=340&fit=crop',
                  time: '15:32',
                },
                {
                  title: '我的第一幅苗绣作品完成了！',
                  type: '用户投稿',
                  typeColor: 'bg-[#1A6B4A]',
                  img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=340&fit=crop',
                  time: '12:18',
                },
              ].map((v, i) => (
                <ScrollReveal key={v.title} delay={i * 0.1}>
                  <Link to="/videos">
                    <div className="card-hover bg-white rounded-sm overflow-hidden shadow-md group">
                      <div className="img-zoom relative h-44">
                        <img src={v.img} alt={v.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                            <Play className="w-5 h-5 text-white ml-1" />
                          </div>
                        </div>
                        <span className={`absolute top-2 left-2 text-white text-xs px-2 py-0.5 ${v.typeColor}`}>
                          {v.type}
                        </span>
                        <span className="absolute bottom-2 right-2 text-white text-xs bg-black/60 px-1.5 py-0.5">
                          {v.time}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#1a1a2e] font-medium text-sm leading-snug line-clamp-2">{v.title}</h3>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/videos" className="btn-primary inline-flex items-center gap-2">
                进入视频中心
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 页脚 ── */}
      <footer className="bg-[#0d1117] border-t border-[#D4AC0D]/20 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-[#D4AC0D] font-serif text-xl mb-3">华绣志</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                中国非遗刺绣文化传播平台，致力于让传统技艺走进现代生活。
              </p>
            </div>
            {[
              { title: '内容导航', links: ['刺绣图鉴', '视频中心', '作品广场', '传承人'] },
              { title: '关于平台', links: ['平台介绍', '内容来源', '版权声明', '联系我们'] },
              { title: '加入我们', links: ['上传作品', '成为传承人', '内容合作', '志愿者'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-white/80 text-sm tracking-wider mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-white/40 text-sm hover:text-[#D4AC0D] transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-xs tracking-wider">© 2024 华绣志 · 中国非遗刺绣文化平台</p>
            <p className="text-white/20 text-xs">内容来源：Wikimedia Commons · Met Museum Open Access · Wikipedia CC BY-SA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
