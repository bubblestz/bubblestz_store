'use client';

import { Order, OrderStatus } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatusPieChartProps {
  orders: Order[];
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: '#fbbf24',
  'Picked Up': '#60a5fa',
  Washing: '#a78bfa',
  Drying: '#fb923c',
  'Ready for Delivery': '#6ee7b7',
  Delivered: '#4ade80',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div
        className="px-3 py-2 rounded-xl text-sm shadow-xl"
        style={{
          background: 'rgba(10, 16, 35, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p className="font-semibold" style={{ color: item.payload.color }}>
          {item.name}
        </p>
        <p className="text-slate-300 tabular">
          {item.value} order{item.value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

export default function StatusPieChart({ orders }: StatusPieChartProps) {
  const statusCounts = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_COLORS[status as OrderStatus] || '#64748b',
    }));

  const total = orders.length;

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
          <h3 className="text-sm font-semibold text-slate-200">Status Distribution</h3>
          <p className="text-xs text-slate-500 mt-0.5">{total} total orders</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
          Live
        </span>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-100 tabular">{total}</p>
            <p className="text-xs text-slate-500">Orders</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-1.5 mt-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="text-xs text-slate-400 truncate">{item.name}</span>
            <span className="text-xs font-semibold tabular ml-auto" style={{ color: item.color }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
