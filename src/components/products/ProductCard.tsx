'use client';

import { Product } from '@/types';
import { useLanguage } from '@/lib/language';
import Card, { CardImage, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Eye, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onView, onAddToCart }: ProductCardProps) {
  const { locale, t } = useLanguage();
  const isOutOfStock = product.stock <= 0;

  return (
    <Card hover>
      <div className="relative">
        <CardImage
          src={product.image_url}
          alt={locale === 'fa' ? product.name_fa : product.name}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-red-400 font-semibold text-lg">{t.products.outOfStock}</span>
          </div>
        )}
        {!isOutOfStock && product.stock <= 5 && (
          <div className="absolute top-2 right-2 bg-gold-primary/90 text-black text-xs font-bold px-2 py-1 rounded">
            {product.stock} {t.products.stock}
          </div>
        )}
      </div>
      <CardContent>
        {product.category && (
          <span className="text-xs text-gold-primary uppercase tracking-wider">
            {locale === 'fa' ? product.category.name_fa : product.category.name}
          </span>
        )}
        <h3 className="text-lg font-semibold text-white mt-1 mb-1">
          {locale === 'fa' ? product.name_fa : product.name}
        </h3>
        <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
          {locale === 'fa' ? product.description_fa : product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-gold-primary">
            ${product.price.toLocaleString()}
          </span>
          {!isOutOfStock && (
            <span className="text-xs text-green-400">
              {t.products.inStock} ({product.stock})
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(product)}
          >
            <Eye size={14} className="mr-1" />
            {t.products.viewDetails}
          </Button>
          {!isOutOfStock && onAddToCart && (
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart size={14} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
