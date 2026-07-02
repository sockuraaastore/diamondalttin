'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function RingVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded) return;

    const handleScroll = () => {
      if (!containerRef.current || !video.duration) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrollStart = containerTop;
      const scrollEnd = containerTop + containerHeight - viewportHeight;
      const currentScroll = window.scrollY;

      if (currentScroll < scrollStart) {
        video.currentTime = 0;
        return;
      }

      if (currentScroll > scrollEnd) {
        video.currentTime = video.duration;
        return;
      }

      const progress = (currentScroll - scrollStart) / (scrollEnd - scrollStart);
      video.currentTime = progress * video.duration * 2;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoaded]);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoaded(true)}
      >
        <source src="/videos/ring-animation.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-between px-8 md:px-20">
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-6xl md:text-9xl font-bold text-gold-light tracking-wider"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          DIAMOND
        </motion.h1>

        <motion.h1
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-6xl md:text-9xl font-bold text-gold-light tracking-wider"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          ALTTIN
        </motion.h1>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gold-primary rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-gold-primary rounded-full mt-2"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
