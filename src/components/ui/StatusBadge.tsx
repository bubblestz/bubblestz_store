import React from 'react';
import { 
  Circle, 
  Truck, 
  Package, 
  PackageCheck, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag, 
  Coffee,
  CheckCircle,
  Timer,
  Droplets,
  Wind
} from 'lucide-react';

export type OrderStatus =
  | 'Pending'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Picked Up'
  | 'Washing'
  | 'Drying';

export const STATUS_SEQUENCE: OrderStatus[] = [
  'Pending',
  'Picked Up',
  'Washing',
  'Drying',
  'Ready',
  'Out for Delivery',
  'Delivered',
];

export const STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    dotColor: string;
  }
> = {
  Pending: {
    label: 'Pending',
    className: 'status-pending',
    icon: Circle,
    color: 'rgb(251, 191, 36)',
    bgColor: 'rgba(251, 191, 36, 0.15)',
    dotColor: '#fbbf24',
  },
  'Picked Up': {
    label: 'Picked Up',
    className: 'status-pickedup',
    icon: ShoppingBag,
    color: 'rgb(167, 139, 250)',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    dotColor: '#a78bfa',
  },
  Washing: {
    label: 'Washing',
    className: 'status-washing',
    icon: Droplets,
    color: 'rgb(96, 165, 250)',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    dotColor: '#60a5fa',
  },
  Drying: {
    label: 'Drying',
    className: 'status-drying',
    icon: Wind,
    color: 'rgb(251, 146, 60)',
    bgColor: 'rgba(251, 146, 60, 0.15)',
    dotColor: '#fb923c',
  },
  Preparing: {
    label: 'Preparing',
    className: 'status-preparing',
    icon: Coffee,
    color: 'rgb(167, 139, 250)',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    dotColor: '#a78bfa',
  },
  Ready: {
    label: 'Ready',
    className: 'status-ready',
    icon: CheckCircle,
    color: 'rgb(110, 231, 183)',
    bgColor: 'rgba(110, 231, 183, 0.15)',
    dotColor: '#6ee7b7',
  },
  'Out for Delivery': {
    label: 'Out for Delivery',
    className: 'status-out-for-delivery',
    icon: Truck,
    color: 'rgb(251, 146, 60)',
    bgColor: 'rgba(251, 146, 60, 0.15)',
    dotColor: '#fb923c',
  },
  Delivered: {
    label: 'Delivered',
    className: 'status-delivered',
    icon: CheckCircle2,
    color: 'rgb(74, 222, 128)',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    dotColor: '#4ade80',
  },
  Cancelled: {
    label: 'Cancelled',
    className: 'status-cancelled',
    icon: XCircle,
    color: 'rgb(248, 113, 113)',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    dotColor: '#f87171',
  },
};

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  const Icon = meta.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${meta.className} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon size={size === 'sm' ? 10 : size === 'md' ? 11 : 13} />}
      {meta.label}
    </span>
  );
}
