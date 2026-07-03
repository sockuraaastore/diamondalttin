'use client';

import { motion } from 'framer-motion';
import RingVideo from '@/components/home/RingVideo';
import BannerSection from '@/components/home/BannerSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { useLanguage } from '@/lib/language';
import { Shield, Truck, RefreshCcw, Sparkles } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: 'تضمین کیفیت',
      description: 'تمام محصولات ما از بهترین مواد ساخته شده‌اند',
    },
    {
      icon: Truck,
      title: 'ارسال سریع',
      description: 'ارسال در کوتاه‌ترین زمان ممکن',
    },
    {
      icon: RefreshCcw,
      title: 'گارانتی بازگشت',
      description: 'بازگشت ۷ روزه بدون قید و شرط',
    },
    {
      icon: Sparkles,
      title: 'طرح‌های خاص',
      description: 'جدیدترین مدل‌های روز دنیا',
    },
  ];

  return (
    <div>
      <RingVideo />

      <section className="py-20 md:py-28 bg-gradient-to-b from-[#050505] via-[#0A0A0A] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 text-xs tracking-[0.2em] text-gold-primary border border-gold-primary/20 rounded-full mb-6">
              چرا ما؟
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gold-gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>
              تفاوت Diamond Alttin
            </h2>
            <div className="section-divider max-w-xs mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-luxury rounded-2xl p-8 text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold-primary/10 flex items-center justify-center group-hover:bg-gold-primary/20 transition-all duration-500">
                  <feature.icon className="w-7 h-7 text-gold-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BannerSection />

      <FeaturedProducts />

      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 text-xs tracking-[0.2em] text-gold-primary border border-gold-primary/20 rounded-full mb-6">
              داستان ما
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gold-gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>
              تلاقی درخشش و اصالت
            </h2>
            <div className="section-divider max-w-xs mx-auto mb-8" />
            <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              برند Diamond Alttin با یک هدف ساده اما بزرگ شکل گرفت: «دسترسی همه به زیباترین و باکیفیت‌ترین اکسسوری‌ها». ما تلاش می‌کنیم ارزش و زیبایی را در قالب بدلیجات با طرح‌های مدرن به شما ارائه دهیم.
            </p>
            <a
              href="/diamondalttin/about"
              className="inline-flex items-center gap-2 btn-gold px-8 py-4 rounded-full text-sm font-semibold tracking-wider"
            >
              بیشتر بدانید
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
