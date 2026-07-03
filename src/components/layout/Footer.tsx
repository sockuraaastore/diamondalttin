'use client';

import { useLanguage } from '@/lib/language';
import { Globe, Send, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 mt-auto w-full">
      <div className="section-divider" />

      <div className="bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="text-3xl font-bold tracking-wider"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  DIAMOND
                </span>
                <div className="w-2 h-2 rounded-full bg-gold-primary" />
                <span
                  className="text-3xl font-bold tracking-wider"
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
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
                مجموعه جواهرات لوکس با طرح‌های مدرن و کیفیت بالا. ما معتقدیم که هر اکسسوری، داستانی از سلیقه و درخشش شما را روایت می‌کند.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-gold-primary hover:border-gold-primary/50 transition-all duration-300">
                  <Globe size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-gold-primary hover:border-gold-primary/50 transition-all duration-300">
                  <Send size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-gold-primary hover:border-gold-primary/50 transition-all duration-300">
                  <Phone size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-6 tracking-wider uppercase">دسترسی سریع</h4>
              <ul className="space-y-4">
                <li>
                  <a href="/diamondalttin/" className="text-sm text-zinc-400 hover:text-gold-primary transition-colors duration-300">
                    {t.nav.home}
                  </a>
                </li>
                <li>
                  <a href="/diamondalttin/products" className="text-sm text-zinc-400 hover:text-gold-primary transition-colors duration-300">
                    {t.nav.products}
                  </a>
                </li>
                <li>
                  <a href="/diamondalttin/blogs" className="text-sm text-zinc-400 hover:text-gold-primary transition-colors duration-300">
                    {t.nav.blogs}
                  </a>
                </li>
                <li>
                  <a href="/diamondalttin/about" className="text-sm text-zinc-400 hover:text-gold-primary transition-colors duration-300">
                    {t.nav.about}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-6 tracking-wider uppercase">ارتباط با ما</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-gold-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-400">تهران، خیابان ولیعصر</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-gold-primary shrink-0" />
                  <span className="text-sm text-zinc-400" dir="ltr">021-12345678</span>
                </li>
                <li>
                  <a href="/diamondalttin/support" className="text-sm text-zinc-400 hover:text-gold-primary transition-colors duration-300">
                    {t.nav.support}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="section-divider mt-12 mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">
              © 2026 Diamond Alttin. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">حریم خصوصی</a>
              <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">شرایط استفاده</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
