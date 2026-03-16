import { Order, OrderStatus } from '@/types';
export type { Order, OrderStatus };

export const STATUS_SEQUENCE: OrderStatus[] = [
  'Pending',
  'Picked Up',
  'Washing',
  'Drying',
  'Ready for Delivery',
  'Delivered',
];

// Helper to generate timestamps relative to now
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

export const MOCK_ORDERS: Order[] = [
  {
    id: 341,
    app_id: 'app_1',
    user_id: 'user_1',
    customer_name: 'Maria Santos',
    phone: '0917-345-6789',
    address: '12 Sampaguita St., Brgy. Poblacion, Makati',
    location_lat: 14.5547,
    location_lng: 121.0244,
    total_cost: 770,
    status: 'Pending',
    created_at: minutesAgo(12),
  },
  {
    id: 340,
    app_id: 'app_1',
    user_id: 'user_2',
    customer_name: 'Ricardo Dela Cruz',
    phone: '0918-234-5678',
    address: '45 Mabini Ave., Brgy. San Antonio, Pasig',
    location_lat: 14.5844,
    location_lng: 121.0568,
    total_cost: 620,
    status: 'Washing',
    created_at: hoursAgo(3),
  },
  {
    id: 339,
    app_id: 'app_2',
    user_id: 'user_3',
    customer_name: 'Lourdes Fernandez',
    phone: '0919-876-5432',
    address: '78 Rizal Blvd., Brgy. Bagong Ilog, Pasig',
    location_lat: 14.5678,
    location_lng: 121.0789,
    total_cost: 1350,
    status: 'Ready for Delivery',
    created_at: hoursAgo(6),
  },
];

export function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = STATUS_SEQUENCE.indexOf(current);
  if (idx === -1 || idx === STATUS_SEQUENCE.length - 1) return null;
  return STATUS_SEQUENCE[idx + 1] as OrderStatus;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(amount);
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('sw-TZ', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
