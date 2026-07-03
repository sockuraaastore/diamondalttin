'use client';

import { motion } from 'framer-motion';

export default function AsteriskSvg({ className = '' }: { className?: string }) {
  const points = 8;
  const innerRadius = 30;
  const outerRadius = 85;

  const generateStarPath = () => {
    const path: string[] = [];
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = 100 + radius * Math.cos(angle);
      const y = 100 + radius * Math.sin(angle);
      path.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    path.push('Z');
    return path.join(' ');
  };

  const generateLines = () => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < points; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      lines.push({
        x1: 100 + innerRadius * 0.6 * Math.cos(angle),
        y1: 100 + innerRadius * 0.6 * Math.sin(angle),
        x2: 100 + outerRadius * Math.cos(angle),
        y2: 100 + outerRadius * Math.sin(angle),
      });
    }
    return lines;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${className}`}
    >
      <div className="absolute inset-0 blur-3xl bg-gold-primary/20 rounded-full" />
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="relative w-full h-full drop-shadow-[0_0_60px_rgba(212,175,55,0.4)]"
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="asteriskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F4E4BC" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <linearGradient id="asteriskShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Main star shape */}
          <path
            d={generateStarPath()}
            stroke="url(#asteriskGrad)"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Inner star */}
          <path
            d={generateStarPath()}
            stroke="url(#asteriskGrad)"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
            transform="scale(0.6) translate(66.67, 66.67)"
          />
          
          {/* Radiating lines */}
          {generateLines().map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="url(#asteriskGrad)"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* Center circle */}
          <circle cx="100" cy="100" r="8" stroke="url(#asteriskGrad)" strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="100" r="3" fill="url(#asteriskGrad)" />
          
          {/* Decorative dots at tips */}
          {Array.from({ length: points }).map((_, i) => {
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const x = 100 + outerRadius * Math.cos(angle);
            const y = 100 + outerRadius * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="2.5" fill="url(#asteriskGrad)" />;
          })}
          
          {/* Shine effect */}
          <path
            d={generateStarPath()}
            fill="url(#asteriskShine)"
            opacity="0.15"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
