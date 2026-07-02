'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, LogOut, Shield, ChevronDown, ShoppingCart, Package } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const pathname = usePathname();
  const { t, locale, toggleLocale } = useLanguage();
  const { user, logout, makeAdmin, isAdmin } = useAuth();
  const { count } = useCart();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/blogs', label: t.nav.blogs },
    { href: '/about', label: t.nav.about },
    { href: '/support', label: t.nav.support },
  ];

  const handleAdminActivate = async () => {
    const success = await makeAdmin(adminCode);
    if (success) {
      setShowAdminInput(false);
      setAdminCode('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800">
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
                className={`text-sm font-medium transition-colors hover:text-gold-primary ${
                  pathname === link.href ? 'text-gold-primary' : 'text-zinc-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleLocale}
              className="p-2 text-zinc-400 hover:text-gold-primary transition-colors"
              title={locale === 'en' ? 'فارسی' : 'English'}
            >
              <Globe size={20} />
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
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
                  className={`text-sm transition-colors hover:text-gold-primary ${
                    pathname === '/orders' ? 'text-gold-primary' : 'text-zinc-400'
                  }`}
                  title={t.nav.myOrders}
                >
                  <Package size={20} />
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 text-sm text-gold-primary hover:text-gold-dark transition-colors"
                  >
                    <Shield size={16} />
                    <span>{t.nav.admin}</span>
                  </Link>
                )}
                {!isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setShowAdminInput(!showAdminInput)}
                      className="flex items-center space-x-1 text-sm text-zinc-400 hover:text-gold-primary transition-colors"
                    >
                      <Shield size={16} />
                      <ChevronDown size={14} />
                    </button>
                    {showAdminInput && (
                      <div className="absolute right-0 mt-2 w-64 bg-bg-secondary border border-zinc-700 rounded-lg p-3 shadow-lg">
                        <input
                          type="password"
                          value={adminCode}
                          onChange={(e) => setAdminCode(e.target.value)}
                          placeholder="Admin code"
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-sm text-white mb-2"
                        />
                        <Button
                          size="sm"
                          onClick={handleAdminActivate}
                          className="w-full"
                        >
                          Activate
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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
              <div className="flex items-center space-x-3">
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
        <div className="md:hidden bg-black border-t border-zinc-800">
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
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-sm text-gold-primary"
                  >
                    {t.nav.admin}
                  </Link>
                )}
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
            <button
              onClick={toggleLocale}
              className="flex items-center space-x-2 py-2 text-sm text-zinc-400"
            >
              <Globe size={16} />
              <span>{locale === 'en' ? 'فارسی' : 'English'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
