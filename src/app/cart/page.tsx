'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/lib/language';
import { createOrder, uploadImage } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Minus, Plus, Trash2, CreditCard } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, updateQuantity, removeItem, loading: cartLoading } = useCart();
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Please login to view your cart</p>
          <Button onClick={() => router.push('/login')}>{t.nav.login}</Button>
        </div>
      </div>
    );
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError(t.cart.phoneRequired);
      return;
    }
    if (!address.trim()) {
      setError(t.cart.addressRequired);
      return;
    }
    if (!zipCode.trim()) {
      setError(t.cart.zipRequired);
      return;
    }
    if (!receiptFile) {
      setError(t.cart.receiptRequired);
      return;
    }

    setSubmitting(true);

    try {
      let receiptUrl = '';
      if (receiptFile) {
        const uploaded = await uploadImage(receiptFile, 'receipts');
        if (uploaded) {
          receiptUrl = uploaded;
        } else {
          receiptUrl = 'placeholder-receipt-url';
        }
      }

      const orderItems = items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      const orderId = await createOrder(user!.id, phone, address, zipCode, receiptUrl, orderItems);

      if (orderId) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/orders');
        }, 2000);
      } else {
        setError(t.cart.orderError);
      }
    } catch (err) {
      setError(t.cart.orderError);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t.cart.orderSuccess}</h2>
          <p className="text-zinc-400">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gold-light mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          {t.cart.title}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg mb-4">{t.cart.empty}</p>
            <Button onClick={() => router.push('/products')}>{t.nav.products}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-bg-secondary rounded-xl border border-zinc-800 p-4 flex gap-4">
                  {item.product && (
                    <>
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.product.name}</h3>
                        <p className="text-gold-primary font-bold">${item.product.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.product?.stock || 0)}
                            className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-2 text-zinc-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-bg-secondary rounded-xl border border-zinc-800 p-6 sticky top-24">
                <h3 className="text-xl font-semibold text-gold-light mb-4">{t.cart.sellerCard}</h3>

                <div className="bg-zinc-900 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <CreditCard className="text-gold-primary" size={24} />
                    <span className="text-gold-light font-medium">{t.cart.bank}</span>
                  </div>
                  <p className="text-white font-mono text-lg mb-1">{t.cart.cardNumber}</p>
                  <p className="text-zinc-400 text-sm">{t.cart.cardName}</p>
                </div>

                <div className="border-t border-zinc-700 pt-4 mb-6">
                  <div className="flex justify-between text-zinc-400 mb-2">
                    <span>{t.cart.subtotal}</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gold-light font-bold text-xl">
                    <span>{t.cart.total}</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <Input
                    label={t.cart.phone}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />

                  <Input
                    label={t.cart.address}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />

                  <Input
                    label={t.cart.zipCode}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gold-light mb-1">
                      {t.cart.receipt}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 bg-bg-secondary border border-zinc-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold-primary file:text-black file:font-medium hover:file:bg-gold-dark"
                    />
                  </div>

                  <Button type="submit" loading={submitting} className="w-full" size="lg">
                    {t.cart.registerOrder}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
