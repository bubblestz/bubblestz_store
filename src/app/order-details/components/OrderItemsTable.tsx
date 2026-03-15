'use client';

import { Order, formatCurrency } from '@/lib/mockData';
import { Weight, Layers, DollarSign } from 'lucide-react';

interface OrderItemsTableProps {
  order: Order;
}

export default function OrderItemsTable({ order }: OrderItemsTableProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(10, 16, 35, 0.6)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="px-5 py-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-slate-200">Order Summary</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Breakdown of laundry metrics and costs
        </p>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Weight size={18} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Laundry Weight</p>
            <p className="text-lg font-bold text-slate-100 tabular">{order.clothes_weight} kg</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Layers size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Blanket Count</p>
            <p className="text-lg font-bold text-slate-100 tabular">{order.blanket_count}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 transition-all hover:bg-emerald-500/10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <DollarSign size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Cost</p>
            <p className="text-lg font-bold text-emerald-400 tabular">{formatCurrency(order.total_cost)}</p>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-4 bg-white/5 border-t border-white/5">
        <p className="text-xs text-slate-500 italic">
          * Individual items are not tracked in the current database schema.
        </p>
      </div>
    </div>
  );
}
