'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, formatCurrency, formatRelativeTime, getNextStatus } from '@/lib/mockData';
import { STATUS_META, OrderStatus } from '@/components/ui/StatusBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  User,
  Phone,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Eye,
  ShoppingCart,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: number, newStatus: OrderStatus, appId?: string, userId?: string) => void;
}

export default function OrderCard({ order, onStatusUpdate }: OrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const nextStatus = getNextStatus(order.status);
  const meta = STATUS_META[order.status];

  const handleNextStep = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!nextStatus || isUpdating) return;
    setIsUpdating(true);

    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 600));

    onStatusUpdate(order.id, nextStatus, order.app_id, order.user_id);
    toast.success(`Order ${order.id} → ${nextStatus}`, {
      description: `${order.customer_name}'s order has been updated`,
      icon: nextStatus === 'Delivered' ? '🎉' : undefined,
    });
    setIsUpdating(false);
  };

  return (
    <div
      className="
        relative rounded-2xl p-4 cursor-pointer
        transition-all duration-200
        hover:scale-[1.01] hover:shadow-lg
        group fade-in
      "
      style={{
        background: 'rgba(10, 16, 35, 0.65)',
        border: `1px solid ${meta?.bgColor?.replace('0.15', '0.25') || 'rgba(255,255,255,0.1)'}`,
        backdropFilter: 'blur(16px)',
        boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
      }}
      onClick={() => navigate(`/order-details?id=${order.id}`)}
    >
      {/* Status accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: meta?.color || '#94a3b8' }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tabular text-slate-400">#{order.id}</span>
        </div>
        <StatusBadge status={order.status} size="sm" />
      </div>

      {/* Customer info */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-1">
          <User size={12} className="text-slate-500 shrink-0" />
          <p className="text-sm font-semibold text-slate-100 truncate">{order.customer_name}</p>
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <Phone size={12} className="text-slate-500 shrink-0" />
          <p className="text-xs text-slate-400 tabular">{order.phone}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-slate-500 shrink-0" />
          <p className="text-xs text-slate-400 truncate">
            {order.address}
          </p>
        </div>
      </div>

      {/* Order metrics */}
      <div className="grid grid-cols-1 gap-2 mb-3">
        <div
          className="rounded-xl p-2 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={10} className="text-slate-500" />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Source</p>
          </div>
          <p className="text-xs font-bold text-slate-200 tabular">{order.app_id || 'Direct'}</p>
        </div>
      </div>

      {/* Cost + payment */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-lg font-bold text-emerald-300 tabular">
            {formatCurrency(order.total_cost)}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={10} />
            <span>{formatRelativeTime(order.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {nextStatus && order.status !== 'Delivered' ? (
          <button
            onClick={handleNextStep}
            disabled={isUpdating}
            className={`
              flex-1 flex items-center justify-center gap-2
              py-2 px-3 rounded-xl text-xs font-semibold
              transition-all duration-150 active:scale-95
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
            style={{
              background: meta?.bgColor || 'rgba(255,255,255,0.05)',
              border: `1px solid ${meta?.color || '#ffffff'}40`,
              color: meta?.color || '#ffffff',
            }}
          >
            {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
            {isUpdating ? 'Updating...' : `→ ${nextStatus}`}
          </button>
        ) : order.status === 'Delivered' ? (
          <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle2 size={12} />
            Delivered
          </div>
        ) : order.status === 'Cancelled' ? (
          <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <X size={12} />
            Cancelled
          </div>
        ) : null}

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/order-details?id=${order.id}`);
          }}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all duration-150"
          title="View details"
        >
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}
