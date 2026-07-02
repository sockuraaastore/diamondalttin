'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Tag, Image, MessageSquare, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) return null;

  const sections = [
    { href: '/admin/orders', label: t.admin.orders, icon: ShoppingCart },
    { href: '/admin/products', label: t.admin.products, icon: Package },
    { href: '/admin/categories', label: t.admin.categories, icon: Tag },
    { href: '/admin/banners', label: t.admin.banners, icon: Image },
    { href: '/admin/tickets', label: t.admin.tickets, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.admin.dashboard}
          </h1>
          <div className="w-20 h-1 bg-gold-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="bg-bg-secondary rounded-xl border border-zinc-800 p-6 hover:border-gold-primary transition-all duration-300 hover:shadow-lg hover:shadow-gold-primary/10"
            >
              <section.icon className="w-12 h-12 text-gold-primary mb-4" />
              <h3 className="text-xl font-semibold text-white">{section.label}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
