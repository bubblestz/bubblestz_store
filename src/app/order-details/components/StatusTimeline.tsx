'use client';

import { Order, formatDateTime } from '@/lib/mockData';
import { OrderStatus, STATUS_META, STATUS_SEQUENCE } from '@/components/ui/StatusBadge';
import { Check, Clock } from 'lucide-react';

interface StatusTimelineProps {
  order: Order;
}

export default function StatusTimeline({ order }: StatusTimelineProps) {
  const currentIndex = STATUS_SEQUENCE.indexOf(order.status);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(10, 16, 35, 0.6)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <h3 className="text-sm font-semibold text-slate-200 mb-5">Order Timeline</h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-800" />

        <div className="space-y-0">
          {STATUS_SEQUENCE.map((status, index) => {
            const meta = STATUS_META[status as OrderStatus];
            const Icon = meta.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isFuture = index > currentIndex;
            
            // Only 'Pending' has a fixed timestamp in the current schema (created_at)
            const timestamp = status === 'Pending' ? order.created_at : undefined;

            return (
              <div key={status} className="relative flex items-start gap-4 pb-6 last:pb-0">
                {/* Node */}
                <div
                  className={`
                    relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    transition-all duration-300
                  `}
                  style={{
                    background: isCompleted
                      ? 'rgba(34, 197, 94, 0.2)'
                      : isCurrent
                        ? meta.bgColor
                        : 'rgba(30, 41, 59, 0.8)',
                    border: `2px solid ${
                      isCompleted
                        ? 'rgba(34, 197, 94, 0.5)'
                        : isCurrent
                          ? meta.color + '80'
                          : 'rgba(51, 65, 85, 0.6)'
                    }`,
                  }}
                >
                  {isCompleted ? (
                    <Check size={14} className="text-green-400" />
                  ) : isCurrent ? (
                    <Icon size={13} style={{ color: meta.color }} />
                  ) : (
                    <Clock size={12} className="text-slate-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm font-semibold ${
                        isCompleted
                          ? 'text-green-400'
                          : isCurrent
                            ? 'text-slate-100'
                            : 'text-slate-600'
                      }`}
                      style={isCurrent ? { color: meta.color } : {}}
                    >
                      {status}
                      {isCurrent && (
                        <span
                          className="ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium"
                          style={{ background: meta.bgColor, color: meta.color }}
                        >
                          Current
                        </span>
                      )}
                    </p>
                    {timestamp ? (
                      <span className="text-xs text-slate-500 tabular whitespace-nowrap">
                        {formatDateTime(timestamp)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-700">—</span>
                    )}
                  </div>

                  {isCompleted && index === 0 && (
                    <p className="text-xs text-slate-600 mt-0.5">Order received</p>
                  )}
                  {isFuture && (
                    <p className="text-xs text-slate-700 mt-0.5">Awaiting previous step</p>
                  )}
                  {isCurrent && status !== 'Pending' && (
                    <p className="text-xs text-slate-500 mt-0.5 italic">In progress...</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
