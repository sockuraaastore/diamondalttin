'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import { useRouter } from 'next/navigation';
import CategoryManager from '@/components/admin/CategoryManager';

export default function AdminCategoriesPage() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gold-light mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          {t.admin.categories}
        </h1>
        <div className="bg-bg-secondary rounded-xl border border-zinc-800 p-6">
          <CategoryManager />
        </div>
      </div>
    </div>
  );
}
