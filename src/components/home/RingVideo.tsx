'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function RingVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded) return;

    const handleScroll = () => {
      if (!containerRef.current || !video.duration) return;

      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const currentScroll = window.scrollY;

      const scrollStart = containerTop;
      const scrollEnd = containerTop + containerHeight - viewportHeight;

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

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded]);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoaded(true)}
      >
        <source src="/videos/ring-animation.mp4" type="video/video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />

      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 text-center px-6"
      >
        <AnimatePresence>
          {showContent && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6"
              >
                <span className="inline-block px-4 py-2 text-xs tracking-[0.3em] text-gold-primary border border-gold-primary/30 rounded-full backdrop-blur-sm">
                  مجموعه جواهرات لوکس
                </span>
              </motion.div>

              <div className="flex items-center justify-center gap-4 md:gap-8 mb-8">
                <motion.h1
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-[0.15em]"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 50%, #B8860B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none',
                    filter: 'drop-shadow(0 0 60px rgba(212, 175, 55, 0.3))',
                  }}
                >
                  DIAMOND
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gold-primary animate-glow"
                />

                <motion.h1
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-[0.15em]"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 50%, #B8860B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none',
                    filter: 'drop-shadow(0 0 60px rgba(212, 175, 55, 0.3))',
                  }}
                >
                  ALTTIN
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                درخشش و اصالت در هر جزئیات
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <a
                  href="/diamondalttin/products"
                  className="btn-gold px-8 py-4 rounded-full text-sm font-semibold tracking-wider"
                >
                  مشاهده مجموعه
                </a>
                <a
                  href="/diamondalttin/about"
                  className="px-8 py-4 rounded-full text-sm font-semibold tracking-wider text-gold-primary border border-gold-primary/30 hover:bg-gold-primary/10 transition-all duration-300"
                >
                  داستان ما
                </a>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gold-primary/60 tracking-widest">اسکرول کنید</span>
          <div className="w-5 h-8 border border-gold-primary/40 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-gold-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
