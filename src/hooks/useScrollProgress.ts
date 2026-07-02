'use client';

import { useState, useEffect, useCallback } from 'react';

export function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;

    const element = ref.current;
    const rect = element.getBoundingClientRect();
    const elementHeight = element.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollStart = element.offsetTop;
    const scrollEnd = scrollStart + elementHeight - viewportHeight;
    const currentScroll = window.scrollY;

    const rawProgress = (currentScroll - scrollStart) / (scrollEnd - scrollStart);
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    setProgress(clampedProgress);
  }, [ref]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return progress;
}
