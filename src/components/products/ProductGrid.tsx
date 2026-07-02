'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/lib/language';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  function handleView(product: Product) {
    setSelectedProduct(product);
    setShowModal(true);
  }

  async function handleQuickAdd(product: Product) {
    if (!user) return;
    await addItem(product, 1);
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500 text-lg">{t.products.noProducts}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={handleView}
            onAddToCart={handleQuickAdd}
          />
        ))}
      </div>

      <ProductDetailModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedProduct(null); }}
        product={selectedProduct}
      />
    </>
  );
}
