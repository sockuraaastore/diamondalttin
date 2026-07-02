'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { getAllOrders, updateOrderStatus } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Package, Check, X, Truck, Eye } from 'lucide-react';

export default function OrderList() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [adminNote, setAdminNote] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    const data = await getAllOrders();
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

  function handleAction(order: Order, type: 'approve' | 'reject') {
    setSelectedOrder(order);
    setActionType(type);
    setAdminNote('');
    setDeliveryDate('');
    setShowActionModal(true);
  }

  async function handleConfirmAction() {
    if (!selectedOrder) return;

    setProcessing(true);
    const status = actionType === 'approve' ? 'approved' : 'rejected';
    const success = await updateOrderStatus(
      selectedOrder.id,
      status,
      adminNote,
      actionType === 'approve' ? deliveryDate : undefined
    );

    if (success) {
      setShowActionModal(false);
      loadOrders();
    }
    setProcessing(false);
  }

  async function handleMarkDelivered(orderId: string) {
    setProcessing(true);
    await updateOrderStatus(orderId, 'delivered');
    loadOrders();
    setProcessing(false);
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gold-light">{t.admin.orders}</h3>

      {loading ? (
        <div className="text-center py-8 text-zinc-500">{t.common.loading}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">{t.orders.empty}</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Package className="text-gold-primary" size={20} />
                  <div>
                    <p className="text-white font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-zinc-500 text-sm">
                      {order.user?.full_name} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-zinc-500">{t.admin.phone}:</span>
                  <span className="text-white ml-1">{order.phone}</span>
                </div>
                <div>
                  <span className="text-zinc-500">{t.admin.zipCode}:</span>
                  <span className="text-white ml-1">{order.zip_code}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500">{t.admin.address}:</span>
                  <span className="text-white ml-1">{order.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gold-primary font-bold text-lg">${order.total_amount.toLocaleString()}</span>

                <div className="flex items-center space-x-2">
                  {order.receipt_image_url && (
                    <a
                      href={order.receipt_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-zinc-400 hover:text-gold-primary"
                    >
                      <Eye size={16} />
                    </a>
                  )}

                  {order.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAction(order, 'approve')}
                      >
                        <Check size={14} className="mr-1" />
                        {t.admin.approve}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(order, 'reject')}
                      >
                        <X size={14} className="mr-1" />
                        {t.admin.reject}
                      </Button>
                    </>
                  )}

                  {order.status === 'approved' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkDelivered(order.id)}
                      loading={processing}
                    >
                      <Truck size={14} className="mr-1" />
                      {t.admin.deliver}
                    </Button>
                  )}
                </div>
              </div>

              {order.admin_note && (
                <div className="mt-3 p-2 bg-zinc-800 rounded text-sm">
                  <span className="text-gold-primary">{t.admin.adminNote}:</span>
                  <span className="text-zinc-300 ml-1">{order.admin_note}</span>
                </div>
              )}

              {order.delivery_date && (
                <div className="mt-2 p-2 bg-zinc-800 rounded text-sm">
                  <span className="text-gold-primary">{t.admin.deliveryDate}:</span>
                  <span className="text-zinc-300 ml-1">{order.delivery_date}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={actionType === 'approve' ? t.admin.approve : t.admin.reject}
      >
        <div className="space-y-4">
          {actionType === 'approve' && (
            <Input
              label={t.admin.deliveryDate}
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gold-light mb-1">
              {actionType === 'approve' ? t.admin.adminNote : t.admin.rejectReason}
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-colors h-24"
              placeholder={actionType === 'approve' ? 'Optional note...' : 'Reason for rejection...'}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setShowActionModal(false)}>
              {t.admin.cancel}
            </Button>
            <Button
              onClick={handleConfirmAction}
              loading={processing}
              variant={actionType === 'approve' ? 'primary' : 'secondary'}
            >
              {actionType === 'approve' ? t.admin.approve : t.admin.reject}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
