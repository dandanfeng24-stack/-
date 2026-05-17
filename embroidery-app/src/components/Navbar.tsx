import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { path: '/encyclopedia', label: '刺绣图鉴' },
  { path: '/videos',       label: '视频中心' },
  { path: '/gallery',      label: '作品广场' },
  { path: '/masters',      label: '传承人'   },
];

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#07090d]/96 backdrop-blur-md border-b border-[rgba(201,168,76,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo：纯文字，Linus 风格 */}
          <Link to="/" className="font-serif font-black text-white tracking-[-0.03em] hover:text-[#C9A84C] transition-colors duration-300" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>
            华绣志
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-xs tracking-[3px] transition-colors duration-300 pb-0.5 ${
                    isActive
                      ? 'text-[#C9A84C]'
                      : 'text-[rgba(232,220,200,0.5)] hover:text-[rgba(232,220,200,0.9)]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#C9A84C]/60"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 右侧极简操作 */}
          <div className="hidden md:flex items-center gap-5">
            <button className="text-[rgba(232,220,200,0.35)] hover:text-[rgba(232,220,200,0.7)] text-xs tracking-[3px] transition-colors duration-300">
              登录
            </button>
            <Link
              to="/encyclopedia"
              className="text-[#C9A84C] border border-[rgba(201,168,76,0.4)] hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.06)] text-xs tracking-[3px] px-4 py-2 transition-all duration-300"
            >
              开始探索
            </Link>
          </div>

          {/* 手机菜单按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[rgba(232,220,200,0.6)] p-1"
            aria-label="菜单"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 手机菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#07090d]/98 backdrop-blur-md border-t border-[rgba(201,168,76,0.08)]"
          >
            <div className="max-w-6xl mx-auto px-8 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-3 text-sm tracking-[3px] border-b border-[rgba(201,168,76,0.06)] transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-[#C9A84C]'
                        : 'text-[rgba(232,220,200,0.5)] hover:text-[rgba(232,220,200,0.9)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 flex gap-3">
                <button className="flex-1 py-2.5 text-[rgba(232,220,200,0.4)] text-xs tracking-wider border border-[rgba(201,168,76,0.2)]">
                  登录
                </button>
                <button className="flex-1 py-2.5 bg-[#C9A84C]/10 text-[#C9A84C] text-xs tracking-wider border border-[rgba(201,168,76,0.4)]">
                  开始探索
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
