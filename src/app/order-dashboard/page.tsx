'use client';

import { useState, useCallback, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import KpiCards from './components/KpiCards';
import OrdersGrid from './components/OrdersGrid';
import StatusPieChart from './components/StatusPieChart';
import HourlyVolumeChart from './components/HourlyVolumeChart';
import RuntimeBanner from './components/RuntimeBanner';
import { Order } from '@/lib/mockData';
import { OrderStatus } from '@/components/ui/StatusBadge';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getOrders, updateOrderStatus } from '@/lib/orders';

export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [lastRealtimeEvent, setLastRealtimeEvent] = useState<Date | undefined>();

  const refreshOrders = useCallback(async () => {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data);
    
    // Check if we are in local mode by checking if Turso is unreachable
    try {
      const { turso } = await import('@/lib/turso');
      await turso.execute('SELECT 1');
      setIsLocalMode(false);
    } catch (e) {
      setIsLocalMode(true);
    }

    setIsLoading(false);
    setLastRealtimeEvent(new Date());
  }, []);

  useEffect(() => {
    refreshOrders();
    
    // Optional: Set up a polling interval for "real-time" updates
    const interval = setInterval(refreshOrders, 30000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  const handleStatusUpdate = useCallback(async (orderId: number, newStatus: OrderStatus, appId?: string, userId?: string) => {
    const success = await updateOrderStatus(orderId, newStatus, appId, userId);
    if (success) {
      toast.success(`Status updated to ${newStatus}`);
      refreshOrders();
    } else {
      toast.error('Failed to update status');
    }
  }, [refreshOrders]);

  const handleOrdersChange = useCallback((updated: Order[]) => {
    setOrders(updated);
  }, []);

  return (
    <AppLayout
      pageTitle="Orders Dashboard"
      pageSubtitle="Real-time order management"
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshOrders()}
            disabled={isLoading}
            className="
            flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium
            text-slate-400 hover:text-slate-200 hover:bg-white/5
            border border-transparent hover:border-slate-700
            transition-all duration-150 disabled:opacity-50
          "
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            className="
            flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold
            bg-emerald-500/15 text-emerald-300 border border-emerald-500/25
            hover:bg-emerald-500/25 transition-all duration-150 active:scale-95
          "
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Order</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Status banners */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <RuntimeBanner lastEventAt={lastRealtimeEvent} isLocalMode={isLocalMode} />
          </div>
        </div>

        {/* KPI Cards */}
        <KpiCards orders={orders} />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="lg:col-span-2 xl:col-span-3">
            <HourlyVolumeChart orders={orders} />
          </div>
          <div className="lg:col-span-1">
            <StatusPieChart orders={orders} />
          </div>
        </div>

        {/* Orders Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Active Orders</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {orders.filter((o) => o.status !== 'Delivered').length} orders need attention
              </p>
            </div>
          </div>
          <OrdersGrid 
            orders={orders}
            onStatusUpdate={handleStatusUpdate} 
            onOrdersChange={handleOrdersChange} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </AppLayout>
  );
}
