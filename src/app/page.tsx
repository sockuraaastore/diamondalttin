'use client';

import RingVideo from '@/components/home/RingVideo';
import BannerSection from '@/components/home/BannerSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function Home() {
  return (
    <div className="bg-[#050505]">
      <RingVideo />
      <BannerSection />
      <FeaturedProducts />
    </div>
  );
}
