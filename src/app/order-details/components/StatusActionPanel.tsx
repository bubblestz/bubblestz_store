'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { STATUS_META, STATUS_SEQUENCE } from '@/components/ui/StatusBadge';
import { getNextStatus } from '@/lib/mockData';
import { ArrowRight, Loader2, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';

interface StatusActionPanelProps {
  order: Order;
  onStatusUpdate: (newStatus: OrderStatus) => void;
}

export default function StatusActionPanel({ order, onStatusUpdate }: StatusActionPanelProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeliveryConfirm, setShowDeliveryConfirm] = useState(false);

  const nextStatus = getNextStatus(order.status);
  const currentMeta = STATUS_META[order.status];
  const nextMeta = nextStatus ? STATUS_META[nextStatus] : null;

  const handleAdvance = async () => {
    if (!nextStatus) return;
    if (nextStatus === 'Delivered') {
      setShowDeliveryConfirm(true);
      return;
    }
    await performUpdate(nextStatus);
  };

  const performUpdate = async (status: OrderStatus) => {
    setIsUpdating(true);
    setShowDeliveryConfirm(false);

    // Simulated delay - real update happens in parent component via onStatusUpdate
    await new Promise((r) => setTimeout(r, 700));

    onStatusUpdate(status);
    toast.success(`Status updated to "${status}"`, {
      description: `Order #${order.id} has been advanced`,
      icon: status === 'Delivered' ? '🎉' : undefined,
    });
    setIsUpdating(false);
  };

  return (
    <>
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(10, 16, 35, 0.6)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Order Actions</h3>

        {/* Current status display */}
        <div
          className="rounded-xl p-3 mb-4"
          style={{ background: currentMeta.bgColor, border: `1px solid ${currentMeta.color}30` }}
        >
          <p className="text-xs text-slate-400 mb-1">Current Status</p>
          <div className="flex items-center gap-2">
            <currentMeta.icon size={16} style={{ color: currentMeta.color }} />
            <span className="font-semibold text-sm" style={{ color: currentMeta.color }}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Status sequence pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {STATUS_SEQUENCE.map((s, i) => {
            const currentIdx = STATUS_SEQUENCE.indexOf(order.status);
            const isDone = i < currentIdx;
            const isCurrent = i === currentIdx;
            const meta = STATUS_META[s as OrderStatus];
            return (
              <span
                key={s}
                className="text-xs px-2 py-0.5 rounded-full font-medium transition-all"
                style={
                  isCurrent
                    ? {
                        background: meta.bgColor,
                        color: meta.color,
                        border: `1px solid ${meta.color}50`,
                      }
                    : isDone
                      ? {
                          background: 'rgba(34,197,94,0.08)',
                          color: 'rgb(74,222,128)',
                          border: '1px solid rgba(34,197,94,0.2)',
                        }
                      : {
                          background: 'rgba(30,41,59,0.6)',
                          color: '#475569',
                          border: '1px solid rgba(51,65,85,0.4)',
                        }
                }
              >
                {i + 1}. {s}
              </span>
            );
          })}
        </div>

        {/* Next step button */}
        {nextStatus && nextMeta ? (
          <button
            onClick={handleAdvance}
            disabled={isUpdating}
            className="
              w-full flex items-center justify-center gap-2
              py-3 px-4 rounded-xl font-semibold text-sm
              transition-all duration-150 active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
            "
            style={{
              background: nextMeta.bgColor,
              border: `1px solid ${nextMeta.color}50`,
              color: nextMeta.color,
            }}
          >
            {isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <ArrowRight size={16} />
                Mark as "{nextStatus}"
              </>
            )}
          </button>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-sm">
            <CheckCircle2 size={16} />
            Order Fully Delivered
          </div>
        )}
      </div>

      {/* Delivery Confirmation Modal */}
      {showDeliveryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeliveryConfirm(false)}
          />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 slide-up"
            style={{
              background: 'rgba(10, 18, 38, 0.97)',
              border: '1px solid rgba(110, 231, 183, 0.25)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            <button
              onClick={() => setShowDeliveryConfirm(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={22} className="text-emerald-400" />
            </div>

            <h3 className="text-base font-bold text-slate-100 text-center mb-2">
              Confirm Delivery
            </h3>
            <p className="text-xs text-slate-400 text-center mb-1">
              Mark order <span className="font-mono text-indigo-400 font-semibold">#{order.id}</span>{' '}
              as delivered?
            </p>
            <p className="text-xs text-slate-500 text-center mb-6">
              This is the final step — the order will be marked complete for{' '}
              <span className="text-slate-300">{order.customer_name}</span>.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeliveryConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-white/5 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => performUpdate('Delivered')}
                disabled={isUpdating}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all duration-150 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                {isUpdating ? 'Delivering...' : 'Confirm Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
