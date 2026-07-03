'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Shield, ShoppingBag, Package, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import AdminAccessModal from '@/components/admin/AdminAccessModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/diamondalttin/', label: t.nav.home },
    { href: '/diamondalttin/products', label: t.nav.products },
    { href: '/diamondalttin/blogs', label: t.nav.blogs },
    { href: '/diamondalttin/about', label: t.nav.about },
    { href: '/diamondalttin/support', label: t.nav.support },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gold-primary/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/diamondalttin/" className="flex items-center gap-2">
              <div className="flex items-center">
                <span
                  className="text-2xl font-bold tracking-wider"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  DIAMOND
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-gold-primary mx-2" />
                <span
                  className="text-2xl font-bold tracking-wider"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #8B7355 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ALTTIN
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                    pathname === link.href ? 'text-gold-primary' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-gold-primary"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setShowAdminModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold-primary/30 text-gold-primary text-sm font-medium hover:bg-gold-primary/10 hover:border-gold-primary/50 transition-all duration-300"
              >
                <Shield size={14} />
                <span>پنل مدیریت</span>
              </button>

              {user ? (
                <>
                  <Link
                    href="/diamondalttin/cart"
                    className="relative p-2.5 text-zinc-400 hover:text-gold-primary transition-colors duration-300"
                  >
                    <ShoppingBag size={20} />
                    {count > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center"
                      >
                        {count}
                      </motion.span>
                    )}
                  </Link>

                  <div className="w-px h-6 bg-zinc-800" />

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-primary to-gold-dark flex items-center justify-center text-black text-xs font-bold">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    <button
                      onClick={logout}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors duration-300"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/diamondalttin/login"
                    className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-300"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/diamondalttin/register"
                    className="btn-gold px-6 py-2.5 rounded-full text-sm font-semibold"
                  >
                    {t.nav.register}
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute right-0 top-0 bottom-0 w-80 glass-strong border-l border-gold-primary/10"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-lg font-bold text-gold-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                    منو
                  </span>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block py-3 px-4 text-lg font-medium rounded-xl transition-all duration-300 ${
                          pathname === link.href
                            ? 'text-gold-primary bg-gold-primary/10'
                            : 'text-zinc-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="section-divider my-6" />

                {user ? (
                  <div className="space-y-3">
                    <Link
                      href="/diamondalttin/cart"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-3 px-4 text-zinc-300 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                    >
                      <span>{t.nav.cart}</span>
                      {count > 0 && (
                        <span className="bg-gold-primary text-black text-xs font-bold px-2.5 py-1 rounded-full">
                          {count}
                        </span>
                      )}
                    </Link>
                    <Link href="/diamondalttin/orders" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-zinc-300 hover:text-white rounded-xl hover:bg-white/5 transition-all">
                      {t.nav.myOrders}
                    </Link>
                    <button
                      onClick={() => { setShowAdminModal(true); setIsOpen(false); }}
                      className="flex items-center gap-2 w-full py-3 px-4 text-gold-primary rounded-xl hover:bg-gold-primary/10 transition-all"
                    >
                      <Shield size={18} />
                      <span>{t.nav.admin}</span>
                    </button>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center gap-2 w-full py-3 px-4 text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={18} />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/diamondalttin/login"
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 text-center text-zinc-300 border border-zinc-700 rounded-xl hover:border-zinc-500 transition-all"
                    >
                      {t.nav.login}
                    </Link>
                    <Link
                      href="/diamondalttin/register"
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 text-center btn-gold rounded-xl"
                    >
                      {t.nav.register}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminAccessModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </>
  );
}
