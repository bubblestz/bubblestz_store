'use client';

import { Order, formatDateTime } from '@/lib/mockData';
import { MapPin, Navigation, User, Phone, Info } from 'lucide-react';

interface CustomerInfoPanelProps {
  order: Order;
}

export default function CustomerInfoPanel({ order }: CustomerInfoPanelProps) {
  return (
    <div
      className="rounded-2xl p-5 space-y-5"
      style={{
        background: 'rgba(10, 16, 35, 0.6)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Customer info */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <User size={14} className="text-indigo-400" />
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Customer
          </h4>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Name</span>
            <span className="text-xs font-semibold text-slate-200">{order.customer_name}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500 shrink-0">Phone</span>
            <span className="text-xs tabular text-slate-300">{order.phone}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5" />

      {/* Delivery address */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-emerald-400" />
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Delivery Address
          </h4>
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-slate-500 shrink-0">Address</span>
            <span className="text-xs text-slate-300 text-right">{order.address}</span>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${order.location_lat},${order.location_lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Navigation size={11} />
          Open in Maps
        </a>
      </div>

      <div className="border-t border-white/5" />

      {/* Metadata */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Info size={14} className="text-blue-400" />
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Order Metadata
          </h4>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">App Source</span>
            <span className="text-xs font-semibold text-slate-200">{order.app_id || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">User ID</span>
            <span className="text-xs font-semibold text-slate-200">{order.user_id || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Order Created</span>
            <span className="text-xs tabular text-slate-300">
              {formatDateTime(order.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
