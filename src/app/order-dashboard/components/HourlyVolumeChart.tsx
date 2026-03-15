'use client';

import { useMemo } from 'react';
import { Order } from '@/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HourlyVolumeChartProps {
  orders: Order[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2.5 rounded-xl text-xs shadow-xl"
        style={{
          background: 'rgba(10, 16, 35, 0.95)',
          border: '1px solid rgba(110, 231, 183, 0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p className="text-slate-400 mb-1.5 font-medium">{label}</p>
        <p className="text-emerald-300 font-semibold tabular">{payload[0]?.value} orders</p>
        <p className="text-indigo-300 tabular">₱{payload[1]?.value?.toLocaleString()} revenue</p>
      </div>
    );
  }
  return null;
};

export default function HourlyVolumeChart({ orders }: HourlyVolumeChartProps) {
  const chartData = useMemo(() => {
    // Initialize 24 hours
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      orders: 0,
      revenue: 0,
    }));

    // Fill with real data
    orders.forEach((order) => {
      try {
        const date = new Date(order.created_at);
        const h = date.getHours();
        if (h >= 0 && h < 24) {
          hours[h].orders += 1;
          hours[h].revenue += order.total_cost;
        }
      } catch (e) {
        console.error('Error parsing date for chart', order.created_at);
      }
    });

    // Filter to show only hours with data or a reasonable range (e.g., 6 AM to 10 PM)
    // For now, let's show all hours but maybe highlight the last 12
    return hours;
  }, [orders]);

  const today = new Date().toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{
        background: 'rgba(10, 16, 35, 0.6)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Hourly Order Volume</h3>
          <p className="text-xs text-slate-500 mt-0.5">Today, {today}</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Orders</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-slate-400">Revenue</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6ee7b7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            interval={3}
          />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke="#6ee7b7"
            strokeWidth={2}
            fill="url(#ordersGrad)"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#818cf8"
            strokeWidth={1.5}
            fill="url(#revenueGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
