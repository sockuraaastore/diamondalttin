'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import { getUserPurchases } from '@/lib/api';
import { Order } from '@/types';
import Button from '@/components/ui/Button';
import { ShoppingBag, Package } from 'lucide-react';

export default function PurchasesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadPurchases();
  }, [user, router]);

  async function loadPurchases() {
    if (!user) return;
    setLoading(true);
    const data = await getUserPurchases(user.id);
    setPurchases(data);
    setLoading(false);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'delivered': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-zinc-500/20 text-zinc-400';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'approved': return t.orders.approved;
      case 'delivered': return t.orders.delivered;
      default: return status;
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gold-light" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.purchases.title}
          </h1>
          <Button variant="outline" onClick={() => router.push('/orders')}>
            {t.nav.myOrders}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-zinc-500">{t.common.loading}</div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg mb-4">{t.purchases.empty}</p>
            <Button onClick={() => router.push('/products')}>{t.nav.products}</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-bg-secondary rounded-xl border border-zinc-800 overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/50"
                  onClick={() => setExpandedOrder(expandedOrder === purchase.id ? null : purchase.id)}
                >
                  <div className="flex items-center space-x-4">
                    <Package className="text-green-400" size={24} />
                    <div>
                      <p className="text-white font-medium">Purchase #{purchase.id.slice(0, 8)}</p>
                      <p className="text-zinc-400 text-sm">{new Date(purchase.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gold-primary font-bold">${purchase.total_amount.toLocaleString()}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                      {getStatusText(purchase.status)}
                    </span>
                  </div>
                </div>

                {expandedOrder === purchase.id && (
                  <div className="p-4 border-t border-zinc-800">
                    {purchase.delivery_date && (
                      <div className="bg-zinc-900 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gold-primary mb-1">{t.orders.deliveryDate}:</p>
                        <p className="text-zinc-300">{purchase.delivery_date}</p>
                      </div>
                    )}

                    {purchase.admin_note && (
                      <div className="bg-zinc-900 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gold-primary mb-1">{t.orders.adminNote}:</p>
                        <p className="text-zinc-300">{purchase.admin_note}</p>
                      </div>
                    )}

                    {purchase.items && purchase.items.length > 0 && (
                      <div>
                        <p className="text-sm text-zinc-500 mb-2">{t.orders.items}:</p>
                        <div className="space-y-2">
                          {purchase.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-zinc-900 rounded-lg p-2">
                              <div className="flex items-center space-x-3">
                                {item.product && (
                                  <img
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <span className="text-white text-sm">
                                  {item.product?.name || 'Product'}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-zinc-400 text-sm">x{item.quantity}</span>
                                <span className="text-gold-primary ml-2">${(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
