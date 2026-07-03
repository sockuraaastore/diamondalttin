'use client';

import { motion } from 'framer-motion';

export default function DiamondSvg({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${className}`}
    >
      <div className="absolute inset-0 blur-3xl bg-gold-primary/20 rounded-full" />
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full drop-shadow-[0_0_60px_rgba(212,175,55,0.4)]"
      >
        <defs>
          <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4E4BC" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="diamondShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Main diamond shape */}
        <path
          d="M100 15 L185 100 L100 185 L15 100 Z"
          stroke="url(#diamondGrad)"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Inner diamond facets */}
        <path
          d="M100 45 L155 100 L100 155 L45 100 Z"
          stroke="url(#diamondGrad)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        
        {/* Cross lines */}
        <path d="M100 15 L100 185" stroke="url(#diamondGrad)" strokeWidth="1" opacity="0.3" />
        <path d="M15 100 L185 100" stroke="url(#diamondGrad)" strokeWidth="1" opacity="0.3" />
        
        {/* Corner accents */}
        <circle cx="100" cy="15" r="3" fill="url(#diamondGrad)" />
        <circle cx="185" cy="100" r="3" fill="url(#diamondGrad)" />
        <circle cx="100" cy="185" r="3" fill="url(#diamondGrad)" />
        <circle cx="15" cy="100" r="3" fill="url(#diamondGrad)" />
        
        {/* Shine effect */}
        <path
          d="M100 15 L185 100 L140 100 L100 45 Z"
          fill="url(#diamondShine)"
          opacity="0.3"
        />
        
        {/* Small decorative diamonds */}
        <path d="M50 50 L55 45 L60 50 L55 55 Z" fill="url(#diamondGrad)" opacity="0.5" />
        <path d="M140 50 L145 45 L150 50 L145 55 Z" fill="url(#diamondGrad)" opacity="0.5" />
        <path d="M50 140 L55 135 L60 140 L55 145 Z" fill="url(#diamondGrad)" opacity="0.5" />
        <path d="M140 140 L145 135 L150 140 L145 145 Z" fill="url(#diamondGrad)" opacity="0.5" />
      </svg>
      
      <motion.div
        animate={{
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0"
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="100" cy="100" r="90" stroke="url(#diamondGrad)" strokeWidth="0.5" opacity="0.3" />
          <circle cx="100" cy="100" r="70" stroke="url(#diamondGrad)" strokeWidth="0.5" opacity="0.2" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
