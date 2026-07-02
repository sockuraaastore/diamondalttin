'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale } from '@/types';
import en from '@/i18n/en.json';
import fa from '@/i18n/fa.json';

type Translations = typeof en;

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  dir: 'ltr' | 'rtl';
  toggleLocale: () => void;
}

const translations: Record<Locale, Translations> = { en, fa };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('diamond_altin_locale') as Locale | null;
    if (stored && (stored === 'en' || stored === 'fa')) {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
    localStorage.setItem('diamond_altin_locale', locale);
  }, [locale]);

  const toggleLocale = () => {
    setLocale(prev => prev === 'en' ? 'fa' : 'en');
  };

  const value: LanguageContextType = {
    locale,
    t: translations[locale],
    dir: locale === 'fa' ? 'rtl' : 'ltr',
    toggleLocale,
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
