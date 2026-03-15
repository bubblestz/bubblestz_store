'use client';

import { Order } from '@/types';
import { formatCurrency } from '@/lib/mockData';
import {
  ShoppingBag,
  Clock,
  Waves,
  PackageCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface KpiCardsProps {
  orders: Order[];
}

export default function KpiCards({ orders }: KpiCardsProps) {
  const today = new Date().toDateString();

  const activeCount = orders.filter((o) => o.status !== 'Delivered').length;
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const inProcessCount = orders.filter(
    (o) => o.status === 'Washing' || o.status === 'Drying'
  ).length;
  const readyCount = orders.filter((o) => o.status === 'Ready for Delivery').length;
  
  // Using created_at as fallback for date check since deliveredAt is gone
  const deliveredToday = orders.filter(
    (o) =>
      o.status === 'Delivered' && o.created_at && new Date(o.created_at).toDateString() === today
  ).length;
  
  const revenueToday = orders
    .filter(
      (o) =>
        o.status === 'Delivered' &&
        o.created_at &&
        new Date(o.created_at).toDateString() === today
    )
    .reduce((sum, o) => sum + o.total_cost, 0);

  // Overdue = pending for more than 30 minutes
  const overdueCount = orders.filter((o) => {
    if (o.status !== 'Pending') return false;
    const age = Date.now() - new Date(o.created_at).getTime();
    return age > 30 * 60 * 1000;
  }).length;

  const cards = [
    {
      label: 'Active Orders',
      value: activeCount,
      icon: ShoppingBag,
      color: 'text-indigo-400',
      bgColor: 'rgba(129, 140, 248, 0.1)',
      borderColor: 'rgba(129, 140, 248, 0.2)',
      trend: '+2 since 1h ago',
      trendUp: true,
      span: 'col-span-1',
    },
    {
      label: 'Pending Pickup',
      value: pendingCount,
      icon: Clock,
      color: overdueCount > 0 ? 'text-amber-400' : 'text-yellow-400',
      bgColor: overdueCount > 0 ? 'rgba(251, 191, 36, 0.12)' : 'rgba(251, 191, 36, 0.08)',
      borderColor: overdueCount > 0 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(251, 191, 36, 0.2)',
      badge: overdueCount > 0 ? `${overdueCount} overdue` : undefined,
      badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
      span: 'col-span-1',
    },
    {
      label: 'In Processing',
      value: inProcessCount,
      icon: Waves,
      color: 'text-violet-400',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      sub: 'Washing + Drying',
      span: 'col-span-1',
    },
    {
      label: 'Ready for Delivery',
      value: readyCount,
      icon: PackageCheck,
      color: 'text-emerald-400',
      bgColor: 'rgba(110, 231, 183, 0.1)',
      borderColor: 'rgba(110, 231, 183, 0.25)',
      trend: readyCount > 0 ? 'Needs dispatch' : 'All clear',
      trendUp: readyCount === 0,
      span: 'col-span-1',
    },
    {
      label: 'Delivered Today',
      value: deliveredToday,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'rgba(34, 197, 94, 0.08)',
      borderColor: 'rgba(34, 197, 94, 0.2)',
      trend: 'On track',
      trendUp: true,
      span: 'col-span-1',
    },
    {
      label: "Today\'s Revenue",
      value: formatCurrency(revenueToday),
      icon: DollarSign,
      color: 'text-emerald-300',
      bgColor: 'rgba(110, 231, 183, 0.08)',
      borderColor: 'rgba(110, 231, 183, 0.2)',
      trend: `${deliveredToday} orders`,
      trendUp: true,
      isLarge: true,
      span: 'col-span-1 md:col-span-2',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`
              relative overflow-hidden rounded-2xl p-4 fade-in
              ${card.span}
              transition-all duration-200 hover:scale-[1.02] cursor-default
            `}
            style={{
              background: card.bgColor,
              border: `1px solid ${card.borderColor}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: card.bgColor, border: `1px solid ${card.borderColor}` }}
              >
                <Icon size={17} className={card.color} />
              </div>
              {card.badge && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              )}
            </div>

            <p className="text-xs font-500 text-slate-400 tracking-wide mb-1">{card.label}</p>
            <p className={`text-2xl font-bold tabular ${card.color}`}>{card.value}</p>

            {card.sub && <p className="text-xs text-slate-500 mt-1">{card.sub}</p>}
            {card.trend && (
              <p
                className={`text-xs mt-1 flex items-center gap-1 ${card.trendUp ? 'text-emerald-400' : 'text-amber-400'}`}
              >
                <TrendingUp size={10} />
                {card.trend}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
