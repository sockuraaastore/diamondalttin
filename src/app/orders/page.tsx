'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import { getUserOrders } from '@/lib/api';
import { Order } from '@/types';
import Button from '@/components/ui/Button';
import { Package, Eye } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, locale } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [user, router]);

  async function loadOrders() {
    if (!user) return;
    setLoading(true);
    const data = await getUserOrders(user.id);
    setOrders(data);
    setLoading(false);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'delivered': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-zinc-500/20 text-zinc-400';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'pending': return t.orders.pending;
      case 'approved': return t.orders.approved;
      case 'rejected': return t.orders.rejected;
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
            {t.orders.title}
          </h1>
          <Button variant="outline" onClick={() => router.push('/purchases')}>
            {t.nav.myPurchases}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-zinc-500">{t.common.loading}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg mb-4">{t.orders.empty}</p>
            <Button onClick={() => router.push('/products')}>{t.nav.products}</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-bg-secondary rounded-xl border border-zinc-800 overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/50"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center space-x-4">
                    <Package className="text-gold-primary" size={24} />
                    <div>
                      <p className="text-white font-medium">{t.orders.orderNumber} #{order.id.slice(0, 8)}</p>
                      <p className="text-zinc-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gold-primary font-bold">${order.total_amount.toLocaleString()}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <Eye className="text-zinc-400" size={18} />
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="p-4 border-t border-zinc-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-zinc-500">{t.admin.phone}</p>
                        <p className="text-white">{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500">{t.admin.zipCode}</p>
                        <p className="text-white">{order.zip_code}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-zinc-500">{t.admin.address}</p>
                        <p className="text-white">{order.address}</p>
                      </div>
                    </div>

                    {order.admin_note && (
                      <div className="bg-zinc-900 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gold-primary mb-1">{t.orders.adminNote}:</p>
                        <p className="text-zinc-300">{order.admin_note}</p>
                      </div>
                    )}

                    {order.delivery_date && (
                      <div className="bg-zinc-900 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gold-primary mb-1">{t.orders.deliveryDate}:</p>
                        <p className="text-zinc-300">{order.delivery_date}</p>
                      </div>
                    )}

                    {order.receipt_image_url && (
                      <div className="mb-4">
                        <p className="text-sm text-zinc-500 mb-2">{t.orders.viewReceipt}:</p>
                        <img
                          src={order.receipt_image_url}
                          alt="Receipt"
                          className="w-48 h-auto rounded-lg border border-zinc-700"
                        />
                      </div>
                    )}

                    {order.items && order.items.length > 0 && (
                      <div>
                        <p className="text-sm text-zinc-500 mb-2">{t.orders.items}:</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
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
