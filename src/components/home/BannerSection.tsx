'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/types';
import { getBanners } from '@/lib/api';

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

  if (banners.length === 0) {
    return (
      <section className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-zinc-500 text-sm">Banner area - Admin can add banners</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.image_url}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentBanner ? 'bg-gold-primary' : 'bg-white/50'
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
