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
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#1a1a2e]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-gradient-to-b from-black/60 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-[#C0392B] rounded-sm rotate-45 group-hover:rotate-[60deg] transition-transform duration-500" />
              <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-[#D4AC0D] z-10" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-serif text-lg tracking-widest">华绣志</span>
              <span className="text-[#D4AC0D] text-[10px] tracking-[4px] opacity-80">非遗刺绣文化平台</span>
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
                  className="relative px-4 py-2 text-sm tracking-widest group"
                >
                  <span className={`transition-colors duration-300 ${
                    isActive ? 'text-[#D4AC0D]' : 'text-white/80 hover:text-white'
                  }`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#D4AC0D] to-transparent"
                    />
                  )}
                  <div className="absolute bottom-0 left-4 right-4 h-px bg-[#D4AC0D]/0 group-hover:bg-[#D4AC0D]/50 transition-all duration-300" />
                </Link>
              );
            })}
          </div>

          {/* 右侧按钮 */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-white/70 hover:text-white text-sm tracking-wider transition-colors px-3 py-1.5">
              登录
            </button>
            <button className="btn-primary text-xs py-2 px-4">
              注册
            </button>
          </div>

          {/* 手机菜单按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded"
            aria-label="菜单"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="md:hidden bg-[#1a1a2e]/98 backdrop-blur-md border-t border-[#D4AC0D]/20"
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
                      className={`block px-4 py-3 text-sm tracking-widest border-l-2 transition-all duration-200 ${
                        isActive
                          ? 'text-[#D4AC0D] border-[#D4AC0D] bg-[#D4AC0D]/5'
                          : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-3 flex gap-3 border-t border-white/10">
                <button className="flex-1 py-2.5 text-white/70 text-sm tracking-wider border border-white/20 rounded">
                  登录
                </button>
                <button className="flex-1 py-2.5 bg-[#C0392B] text-white text-sm tracking-wider rounded border border-[#D4AC0D]/50">
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
