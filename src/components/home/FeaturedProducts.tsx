'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { getFeaturedProducts } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Card, { CardImage, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useLanguage();

  useEffect(() => {
    async function loadProducts() {
      const data = await getFeaturedProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse text-zinc-500">{t.common.loading}</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gold-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.products.title}
          </h2>
          <div className="w-20 h-1 bg-gold-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} hover>
              <CardImage
                src={product.image_url}
                alt={locale === 'fa' ? product.name_fa : product.name}
              />
              <CardContent>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {locale === 'fa' ? product.name_fa : product.name}
                </h3>
                <p className="text-gold-primary font-bold mb-3">
                  ${product.price.toLocaleString()}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  {t.products.viewDetails}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/products">
            <Button variant="primary" size="lg">
              {t.products.all} →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
