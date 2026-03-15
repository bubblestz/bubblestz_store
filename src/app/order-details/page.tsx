'use client';

import { useState, useCallback, Suspense, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import OrderDetailHeader from './components/OrderDetailHeader';
import StatusTimeline from './components/StatusTimeline';
import OrderItemsTable from './components/OrderItemsTable';
import CustomerInfoPanel from './components/CustomerInfoPanel';
import StatusActionPanel from './components/StatusActionPanel';
import ConfettiEffect from '@/app/order-dashboard/components/ConfettiEffect';
import { Order } from '@/lib/mockData';
import { OrderStatus } from '@/components/ui/StatusBadge';
import { FileText, AlertCircle, Loader2 } from 'lucide-react';
import { getOrderById, updateOrderStatus } from '@/lib/orders';
import { toast } from 'sonner';

function OrderDetailsContent() {
  const [searchParams] = useSearchParams();
  const orderIdRaw = searchParams.get('id');
  const orderId = orderIdRaw ? Number(orderIdRaw) : null;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  const refreshOrder = useCallback(async () => {
    if (orderId === null || isNaN(orderId)) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const data = await getOrderById(orderId);
    setOrder(data);
    setIsLoading(false);
  }, [orderId]);

  useEffect(() => {
    refreshOrder();
  }, [refreshOrder]);

  const handleStatusUpdate = useCallback(async (newStatus: OrderStatus) => {
    if (orderId === null || isNaN(orderId)) return;
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      if (newStatus === 'Delivered') {
        setConfettiTrigger(true);
      }
      toast.success(`Status updated to ${newStatus}`);
      refreshOrder();
    } else {
      toast.error('Failed to update status');
    }
  }, [orderId, refreshOrder]);

  if (isLoading) {
    return (
      <AppLayout pageTitle="Order Details">
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
          <p className="text-slate-400 font-medium">Loading order details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout pageTitle="Order Details" pageSubtitle="Order not found">
        <div
          className="rounded-2xl p-16 text-center"
          style={{
            background: 'rgba(10, 16, 35, 0.6)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={20} className="text-red-500" />
          </div>
          <p className="text-slate-300 font-medium mb-1">Order not found</p>
          <p className="text-xs text-slate-500">
            {orderIdRaw 
              ? `The order with ID ${orderIdRaw} could not be found.`
              : 'Please select an order from the dashboard to view details.'}
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageTitle="Order Details"
      pageSubtitle={`Viewing #${order.id} — ${order.customer_name}`}
    >
      <ConfettiEffect trigger={confettiTrigger} onComplete={() => setConfettiTrigger(false)} />

      <div className="space-y-5">
        {/* Header */}
        <OrderDetailHeader order={order} />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* Left column: items + timeline */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-5">
            <OrderItemsTable order={order} />
            <StatusTimeline order={order} />
          </div>

          {/* Right column: customer info + actions */}
          <div className="lg:col-span-1 space-y-5">
            <StatusActionPanel order={order} onStatusUpdate={handleStatusUpdate} />
            <CustomerInfoPanel order={order} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense
      fallback={
        <AppLayout pageTitle="Order Details">
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl h-40 skeleton" />
            ))}
          </div>
        </AppLayout>
      }
    >
      <OrderDetailsContent />
    </Suspense>
  );
}
