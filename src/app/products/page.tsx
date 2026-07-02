'use client';

import { useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import { getProducts, getCategories } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import CategoryFilter from '@/components/products/CategoryFilter';
import ProductGrid from '@/components/products/ProductGrid';

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function loadProducts() {
    setLoading(true);
    const data = await getProducts(selectedCategory || undefined);
    setProducts(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.products.title}
          </h1>
          <div className="w-20 h-1 bg-gold-primary mx-auto" />
        </div>

        <CategoryFilter
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-pulse text-zinc-500">{t.common.loading}</div>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
