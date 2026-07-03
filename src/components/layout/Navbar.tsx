'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, Shield, ShoppingCart, Package } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import AdminAccessModal from '@/components/admin/AdminAccessModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/blogs', label: t.nav.blogs },
    { href: '/about', label: t.nav.about },
    { href: '/support', label: t.nav.support },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-gold-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gold-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                Diamond Alttin
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 hover:text-gold-primary ${
                    pathname === link.href ? 'text-gold-primary' : 'text-zinc-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/cart"
                    className="relative p-2 text-zinc-400 hover:text-gold-primary transition-colors"
                    title={t.nav.cart}
                  >
                    <ShoppingCart size={20} />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-primary text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/orders"
                    className={`p-2 transition-colors hover:text-gold-primary ${
                      pathname === '/orders' ? 'text-gold-primary' : 'text-zinc-400'
                    }`}
                    title={t.nav.myOrders}
                  >
                    <Package size={20} />
                  </Link>

                  <button
                    onClick={() => setShowAdminModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/30 rounded-full text-gold-primary text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Shield size={15} />
                    <span>{t.nav.admin}</span>
                  </button>

                  <span className="text-sm text-zinc-300">{user.full_name}</span>
                  <button
                    onClick={logout}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    title={t.nav.logout}
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">{t.nav.login}</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">{t.nav.register}</Button>
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-zinc-800">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    pathname === link.href ? 'text-gold-primary' : 'text-zinc-300 hover:text-gold-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-zinc-800" />
              {user ? (
                <>
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-2 text-sm text-zinc-300"
                  >
                    <span>{t.nav.cart}</span>
                    {count > 0 && (
                      <span className="bg-gold-primary text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    )}
                  </Link>
                  <Link href="/orders" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-zinc-300">
                    {t.nav.myOrders}
                  </Link>
                  <Link href="/purchases" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-zinc-300">
                    {t.nav.myPurchases}
                  </Link>
                  <button
                    onClick={() => { setShowAdminModal(true); setIsOpen(false); }}
                    className="flex items-center space-x-2 py-2 text-sm text-gold-primary"
                  >
                    <Shield size={16} />
                    <span>{t.nav.admin}</span>
                  </button>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="block py-2 text-sm text-red-500"
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-zinc-300">
                    {t.nav.login}
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-gold-primary">
                    {t.nav.register}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <AdminAccessModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </>
  );
}
