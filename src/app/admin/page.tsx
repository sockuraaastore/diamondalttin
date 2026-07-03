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
    { href: '/admin/orders', label: t.admin.orders, icon: ShoppingCart, delay: '0ms' },
    { href: '/admin/products', label: t.admin.products, icon: Package, delay: '100ms' },
    { href: '/admin/categories', label: t.admin.categories, icon: Tag, delay: '200ms' },
    { href: '/admin/banners', label: t.admin.banners, icon: Image, delay: '300ms' },
    { href: '/admin/tickets', label: t.admin.tickets, icon: MessageSquare, delay: '400ms' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold gold-gradient-text mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.admin.dashboard}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-gold-primary to-gold-dark mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="glass card-hover rounded-2xl p-6 group"
              style={{ animationDelay: section.delay }}
            >
              <div className="w-14 h-14 rounded-xl bg-gold-primary/10 flex items-center justify-center mb-4 group-hover:bg-gold-primary/20 transition-colors duration-300">
                <section.icon className="w-7 h-7 text-gold-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-gold-primary transition-colors duration-300">
                {section.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
