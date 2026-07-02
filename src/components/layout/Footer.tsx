import { useLanguage } from '@/lib/language';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gold-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Diamond Alttin
            </h3>
            <p className="text-zinc-400 text-sm">
              {t.hero.tagline}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t.nav.products}
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="/products" className="hover:text-gold-primary transition-colors">{t.products.all}</a></li>
              <li><a href="/products?featured=true" className="hover:text-gold-primary transition-colors">{t.products.featured}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t.nav.about}
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="/about" className="hover:text-gold-primary transition-colors">{t.about.title}</a></li>
              <li><a href="/support" className="hover:text-gold-primary transition-colors">{t.nav.support}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm text-zinc-500">
          <p>&copy; 2026 Diamond Alttin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
