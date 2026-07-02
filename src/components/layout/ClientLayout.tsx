'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/lib/language';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </LanguageProvider>
  );
}
