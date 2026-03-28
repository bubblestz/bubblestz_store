'use client';

import { useState, useEffect, useCallback } from 'react';
import { MOCK_ORDERS } from '@/lib/mockData';
import { Order, OrderStatus } from '@/types';
import { STATUS_SEQUENCE } from '@/components/ui/StatusBadge';
import OrderCard from './OrderCard';
import { RefreshCw, Filter } from 'lucide-react';

interface OrdersGridProps {
  orders?: Order[];
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus, appId?: string, userId?: string) => void;
  onOrdersChange?: (orders: Order[]) => void;
  isLoading?: boolean;
}

type FilterTab = 'All' | OrderStatus;

export default function OrdersGrid({ 
  orders: propOrders, 
  onStatusUpdate, 
  onOrdersChange, 
  isLoading 
}: OrdersGridProps) {
  const [localOrders, setLocalOrders] = useState<Order[]>(MOCK_ORDERS);
  const orders = propOrders || localOrders;
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const filterTabs: FilterTab[] = ['All', ...(STATUS_SEQUENCE as OrderStatus[])];

  const filteredOrders =
    activeFilter === 'All' ? orders : orders.filter((o) => o.status === activeFilter);

  const handleStatusUpdate = useCallback(
    (orderId: string, newStatus: OrderStatus, appId?: string, userId?: string) => {
      if (!propOrders) {
        setLocalOrders((prev) => {
          const updated = prev.map((o) => {
            if (o.id !== orderId) return o;
            return { ...o, status: newStatus };
          });
          onOrdersChange?.(updated);
          return updated;
        });
      }
      setLastUpdated(new Date());
      onStatusUpdate?.(orderId, newStatus, appId, userId);
    },
    [onStatusUpdate, onOrdersChange, propOrders]
  );

  // Notify parent of initial orders
  useEffect(() => {
    onOrdersChange?.(orders);
  }, []);

  const tabCounts = filterTabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab] = tab === 'All' ? orders.length : orders.filter((o) => o.status === tab).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        <Filter size={14} className="text-slate-500 shrink-0" />
        <div className="flex items-center gap-1.5 flex-nowrap">
          {filterTabs.map((tab) => {
            const count = tabCounts[tab] || 0;
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                  transition-all duration-150 whitespace-nowrap shrink-0
                  ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                {tab}
                {count > 0 && (
                  <span
                    className={`tabular text-xs ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
          <RefreshCw size={11} />
          <span className="hidden sm:inline">
            Updated{' '}
            {lastUpdated.toLocaleTimeString('en-PH', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Grid */}
      {filteredOrders.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: 'rgba(10, 16, 35, 0.4)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3">
            <Filter size={20} className="text-slate-600" />
          </div>
          <p className="text-slate-300 font-medium mb-1">
            No {activeFilter !== 'All' ? activeFilter : ''} orders
          </p>
          <p className="text-xs text-slate-500">
            {activeFilter === 'All'
              ? 'No orders in the system yet. New orders will appear here in real-time.'
              : `No orders currently in "${activeFilter}" status.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusUpdate={handleStatusUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
