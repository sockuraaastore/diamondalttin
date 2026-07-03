'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import fa from '@/i18n/fa.json';

type Translations = typeof fa;

interface LanguageContextType {
  t: Translations;
  dir: 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
  }, []);

  const value: LanguageContextType = {
    t: fa,
    dir: 'rtl',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
