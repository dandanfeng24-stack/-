import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/encyclopedia', label: '刺绣图鉴' },
  { path: '/videos', label: '视频中心' },
  { path: '/gallery', label: '作品广场' },
  { path: '/masters', label: '传承人' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#040609]/97 backdrop-blur-md border-b border-[rgba(201,168,76,0.12)]'
          : 'bg-[#040609]/80 backdrop-blur-sm border-b border-[rgba(201,168,76,0.06)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-[#C0392B] rotate-45 group-hover:rotate-[60deg] transition-transform duration-500" />
              <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-[#C9A84C] z-10" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-serif text-xl tracking-[0.15em]">华绣志</span>
              <span className="text-[#C9A84C] text-[9px] tracking-[5px] opacity-70">非遗刺绣文化平台</span>
            </div>
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 text-sm tracking-[3px] group overflow-hidden"
                >
                  <span className={`transition-colors duration-300 ${
                    isActive ? 'text-[#C9A84C]' : 'text-[rgba(232,220,200,0.6)] hover:text-[rgba(232,220,200,0.9)]'
                  }`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"
                    />
                  )}
                  {/* hover 从左展开的金线 */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-[#C9A84C]/0 origin-left scale-x-0 group-hover:scale-x-100 group-hover:bg-[#C9A84C]/40 transition-all duration-400" />
                </Link>
              );
            })}
          </div>

          {/* 右侧按钮 */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-[rgba(232,220,200,0.5)] hover:text-[rgba(232,220,200,0.8)] text-xs tracking-[3px] transition-colors px-3 py-1.5">
              登录
            </button>
            <button className="btn-primary text-xs py-2 px-5">
              注册
            </button>
          </div>

          {/* 手机菜单按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[rgba(232,220,200,0.7)] p-2"
            aria-label="菜单"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 手机端菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#040609]/99 backdrop-blur-md border-t border-[rgba(201,168,76,0.1)]"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      className={`block px-4 py-3 text-sm tracking-[3px] border-l-2 transition-all duration-200 ${
                        isActive
                          ? 'text-[#C9A84C] border-[#C9A84C] bg-[rgba(201,168,76,0.05)]'
                          : 'text-[rgba(232,220,200,0.55)] border-transparent hover:text-[rgba(232,220,200,0.8)] hover:border-[rgba(201,168,76,0.3)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-3 flex gap-3 border-t border-[rgba(201,168,76,0.1)]">
                <button className="flex-1 py-2.5 text-[rgba(232,220,200,0.5)] text-sm tracking-wider border border-[rgba(201,168,76,0.2)]">
                  登录
                </button>
                <button className="flex-1 py-2.5 bg-[#C0392B] text-white text-sm tracking-wider border border-[rgba(201,168,76,0.4)]">
                  注册
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
