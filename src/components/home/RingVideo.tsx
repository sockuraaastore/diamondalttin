'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import DiamondSvg from '@/components/ui/DiamondSvg';
import AsteriskSvg from '@/components/ui/AsteriskSvg';

const FRAME_COUNT = 94;
const IMAGE_SCALE = 0.85;

export default function RingVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef(0);
  const currentFrameRef = useRef(-1);
  const [loadProgress, setLoadProgress] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const videoRotation = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const containerOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, cw, ch);

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      if (currentFrameRef.current >= 0) {
        drawFrame(currentFrameRef.current);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Load first 10 frames immediately
    for (let i = 0; i < Math.min(10, FRAME_COUNT); i++) {
      const img = new Image();
      img.src = `/diamondalttin/frames/frame_${String(i + 1).padStart(4, '0')}.webp`;
      img.onload = () => {
        loadedRef.current++;
        setLoadProgress(Math.round((loadedRef.current / FRAME_COUNT) * 100));
        if (loadedRef.current === FRAME_COUNT) {
          setAllLoaded(true);
          drawFrame(0);
          currentFrameRef.current = 0;
        }
      };
      img.onerror = () => {
        console.error(`Failed to load frame ${i + 1}`);
        loadedRef.current++;
        setLoadProgress(Math.round((loadedRef.current / FRAME_COUNT) * 100));
        if (loadedRef.current === FRAME_COUNT) {
          setAllLoaded(true);
        }
      };
      framesRef.current[i] = img;
    }

    // Load remaining frames in background
    for (let i = 10; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/diamondalttin/frames/frame_${String(i + 1).padStart(4, '0')}.webp`;
      img.onload = () => {
        loadedRef.current++;
        setLoadProgress(Math.round((loadedRef.current / FRAME_COUNT) * 100));
        if (loadedRef.current === FRAME_COUNT) {
          setAllLoaded(true);
          drawFrame(0);
          currentFrameRef.current = 0;
        }
      };
      img.onerror = () => {
        console.error(`Failed to load frame ${i + 1}`);
        loadedRef.current++;
        setLoadProgress(Math.round((loadedRef.current / FRAME_COUNT) * 100));
        if (loadedRef.current === FRAME_COUNT) {
          setAllLoaded(true);
        }
      };
      framesRef.current[i] = img;
    }

    return () => window.removeEventListener('resize', resize);
  }, [drawFrame]);

  // Scroll-driven frame playback
  useEffect(() => {
    if (!allLoaded) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const index = Math.min(Math.floor(progress * FRAME_COUNT), FRAME_COUNT - 1);

      if (index !== currentFrameRef.current) {
        currentFrameRef.current = index;
        requestAnimationFrame(() => drawFrame(index));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allLoaded, drawFrame]);

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      <motion.div
        style={{ opacity: containerOpacity }}
        className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
      >
        {/* Background glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 55%)'
        }} />

        {/* Loading overlay */}
        {!allLoaded && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
            <div className="w-48 h-px bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-dark to-gold-primary transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="mt-4 text-xs text-zinc-600 tracking-wider">{loadProgress}%</p>
          </div>
        )}

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-center gap-6 md:gap-12 lg:gap-20">

          {/* Diamond - left */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex flex-col items-center gap-6 flex-shrink-0"
          >
            <DiamondSvg className="w-28 h-28 lg:w-44 lg:h-44" />
            <span className="text-[10px] tracking-[0.4em] text-gold-primary/30">DIAMOND</span>
          </motion.div>

          {/* Canvas circle - center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex-shrink-0"
          >
            <motion.div
              style={{ rotate: videoRotation }}
              className="w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden relative"
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: 'block' }}
              />
            </motion.div>

            {/* Decorative rings */}
            <div className="absolute inset-0 rounded-full border border-gold-primary/15 pointer-events-none" />
            <div className="absolute -inset-4 rounded-full border border-gold-primary/8 pointer-events-none" />
            <div className="absolute -inset-8 rounded-full border border-gold-primary/4 pointer-events-none" />
          </motion.div>

          {/* Asterisk - right */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex flex-col items-center gap-6 flex-shrink-0"
          >
            <AsteriskSvg className="w-28 h-28 lg:w-44 lg:h-44" />
            <span className="text-[10px] tracking-[0.4em] text-gold-primary/30">ALTTIN</span>
          </motion.div>
        </div>

        {/* Brand name below */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-24 left-0 right-0 text-center px-6"
        >
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em]"
            style={{
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 50%, #B8860B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DIAMOND ALTTIN
          </h1>
          <p className="mt-3 text-sm text-zinc-500 tracking-wider">
            درخشش و اصالت در هر جزئیات
          </p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-gold-primary/20" />
            <svg className="w-3.5 h-3.5 text-gold-primary/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Mobile decorative elements */}
        <div className="md:hidden absolute top-1/2 -translate-y-1/2 left-6 opacity-20">
          <DiamondSvg className="w-14 h-14" />
        </div>
        <div className="md:hidden absolute top-1/2 -translate-y-1/2 right-6 opacity-20">
          <AsteriskSvg className="w-14 h-14" />
        </div>
      </motion.div>
    </div>
  );
}
