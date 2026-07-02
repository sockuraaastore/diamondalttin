'use client';

import RingVideo from '@/components/home/RingVideo';
import BannerSection from '@/components/home/BannerSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function Home() {
  return (
    <div>
      <RingVideo />
      <BannerSection />
      <FeaturedProducts />
    </div>
  );
}
