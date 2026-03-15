'use client';

import { Order, formatCurrency, formatRelativeTime } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Phone,
  MapPin,
  Calendar,
  User,
  Weight,
} from 'lucide-react';

interface OrderDetailHeaderProps {
  order: Order;
}

export default function OrderDetailHeader({ order }: OrderDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(10, 16, 35, 0.65)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="flex items-center gap-2">
          <button
            className="
            flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium
            text-slate-400 hover:text-slate-200 border border-slate-700/60 hover:bg-white/5
            transition-all duration-150
          "
          >
            <Edit size={13} />
            Edit Order
          </button>
        </div>
      </div>

      {/* Main header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-indigo-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <User size={24} className="text-emerald-300" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-100">{order.customer_name}</h1>
            <StatusBadge status={order.status} size="md" />
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="font-mono font-semibold text-indigo-400">#{order.id}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Phone size={11} className="text-slate-600" />
              <span className="tabular">{order.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin size={11} className="text-slate-600" />
              <span>{order.address}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar size={11} className="text-slate-600" />
              <span>Placed {formatRelativeTime(order.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Cost summary */}
        <div
          className="shrink-0 text-right rounded-xl p-3"
          style={{
            background: 'rgba(110, 231, 183, 0.06)',
            border: '1px solid rgba(110, 231, 183, 0.15)',
          }}
        >
          <p className="text-xs text-slate-500 mb-0.5">Total Cost</p>
          <p className="text-2xl font-bold text-emerald-300 tabular">
            {formatCurrency(order.total_cost)}
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5">
        {[
          { label: 'Weight', value: `${order.clothes_weight} kg`, icon: Weight },
          { label: 'Blankets', value: order.blanket_count.toString() },
          { label: 'App Source', value: order.app_id || 'Direct' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-slate-500 mb-0.5">{stat.label}</p>
            <p className="text-sm font-semibold text-slate-200 tabular">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
