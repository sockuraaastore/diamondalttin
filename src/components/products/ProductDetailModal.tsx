'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const maxQuantity = Math.min(product.stock, 10);

  async function handleAddToCart() {
    if (!user || !product) return;

    setLoading(true);
    const success = await addItem(product, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        setQuantity(1);
        onClose();
      }, 1500);
    }
    setLoading(false);
  }

  function incrementQuantity() {
    if (quantity < maxQuantity) {
      setQuantity(q => q + 1);
    }
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <img
            src={product.image_url}
            alt={locale === 'fa' ? product.name_fa : product.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>

        <div className="md:w-1/2 flex flex-col">
          {product.category && (
            <span className="text-xs text-gold-primary uppercase tracking-wider mb-2">
              {locale === 'fa' ? product.category.name_fa : product.category.name}
            </span>
          )}

          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {locale === 'fa' ? product.name_fa : product.name}
          </h2>

          <p className="text-3xl font-bold text-gold-primary mb-4">
            ${product.price.toLocaleString()}
          </p>

          <div className="mb-4">
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {product.stock > 0
                ? `${t.products.inStock} (${product.stock} ${t.products.stock})`
                : t.products.outOfStock
              }
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gold-light mb-2">{t.products.description}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {locale === 'fa' ? product.description_fa : product.description}
            </p>
          </div>

          {user && product.stock > 0 && (
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gold-light">{t.products.quantity}</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-white font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= maxQuantity}
                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                loading={loading}
                disabled={added}
                className="w-full"
                variant={added ? 'secondary' : 'primary'}
              >
                {added ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} className="mr-2" />
                    {t.products.addToCart}
                  </>
                )}
              </Button>
            </div>
          )}

          {!user && (
            <div className="mt-auto p-4 bg-zinc-800/50 rounded-lg text-center">
              <p className="text-zinc-400 text-sm">
                Please login to add items to cart
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
