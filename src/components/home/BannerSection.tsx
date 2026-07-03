'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banner } from '@/types';
import { getBanners } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    async function loadBanners() {
      const data = await getBanners();
      setBanners(data);
    }
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goNext = () => {
    if (banners.length === 0) return;
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const goPrev = () => {
    if (banners.length === 0) return;
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (banners.length === 0) {
    return (
      <section className="py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-gold-primary/10">
            <div className="py-24 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-primary/10 mb-4">
                <svg className="w-8 h-8 text-gold-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-zinc-500 text-sm">بنر تبلیغاتی</p>
              <p className="text-zinc-600 text-xs mt-1">از پنل مدیریت بنرهای جدید اضافه کنید</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Navigation arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-10 h-10 rounded-full bg-[#141414] border border-gold-primary/20 flex items-center justify-center text-gold-primary/60 hover:text-gold-primary hover:border-gold-primary/50 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-10 h-10 rounded-full bg-[#141414] border border-gold-primary/20 flex items-center justify-center text-gold-primary/60 hover:text-gold-primary hover:border-gold-primary/50 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}

        <div className="relative overflow-hidden rounded-2xl aspect-[21/9] bg-[#0a0a0a] border border-gold-primary/10">
          <AnimatePresence mode="wait">
            {banners.map((banner, index) => (
              index === currentBanner && (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={banner.image_url}
                    alt="بنر"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`transition-all duration-400 rounded-full ${
                    index === currentBanner
                      ? 'w-6 h-2 bg-gold-primary'
                      : 'w-2 h-2 bg-zinc-600 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
