import { turso } from './turso';
import { initDb } from './migrations';
import { Order, OrderStatus } from '@/types';

const LOCAL_STORAGE_KEY = 'bubblestz_orders_cache';
let isOfflineMode = false;
let lastRetryTime = 0;
const RETRY_INTERVAL = 30000; // 30 seconds

/**
 * Robustly parses an ID to a string
 */
function parseId(id: any): string {
  if (id === null || id === undefined) return '0';
  return String(id);
}

/**
 * Gets orders from localStorage
 */
function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * Saves orders to localStorage
 */
function saveLocalOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
}

/**
 * Helper to check if we should even try Turso
 */
function shouldTryTurso(): boolean {
  if (!isOfflineMode) return true;
  const now = Date.now();
  if (now - lastRetryTime > RETRY_INTERVAL) {
    return true; // Try again after interval
  }
  return false;
}

export async function getOrders(): Promise<Order[]> {
  // Always get local data as a baseline for instant UI
  const localOrders = getLocalOrders();

  if (!shouldTryTurso()) {
    return localOrders;
  }

  try {
    await initDb().catch(() => {});
    const result = await Promise.race([
      turso.execute('SELECT * FROM Order_details ORDER BY created_at DESC'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]) as any;
    
    if (result.rows) {
      console.log(`Successfully fetched ${result.rows.length} orders from Turso`);
      const orders = result.rows.map((row: any) => ({
        id: parseId(row.id),
        user_id: row.user_id || '',
        customer_name: row.customer_name || '',
        phone: row.phone || '',
        address: row.address || '',
        lat: Number(row.lat) || 0,
        lng: Number(row.lng) || 0,
        clothes_weight: Number(row.clothes_weight) || 0,
        blankets_count: Number(row.blankets_count) || 0,
        total_price: Number(row.total_price) || 0,
        status: (row.status as OrderStatus) || 'Pending',
        created_at: row.created_at || new Date().toISOString(),
      }));
      saveLocalOrders(orders);
      isOfflineMode = false;
      return orders;
    }
    return localOrders;
  } catch (error) {
    console.error('Turso fetch error:', error);
    isOfflineMode = true;
    lastRetryTime = Date.now();
    return localOrders;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  user_id?: string
): Promise<boolean> {
  // 1. UPDATE LOCALLY IMMEDIATELY
  const local = getLocalOrders();
  const updated = local.map(o => o.id === orderId ? { ...o, status } : o);
  saveLocalOrders(updated);

  if (!shouldTryTurso()) {
    return true; // Act as if successful for UI responsiveness
  }

  // 2. TRY SYNCING IN BACKGROUND
  try {
    await initDb().catch(() => {});
    let query = 'UPDATE Order_details SET status = ? WHERE id = ?';
    const params: any[] = [status, orderId];
    if (user_id) { query += ' AND user_id = ?'; params.push(user_id); }

    await turso.execute({ sql: query, args: params });
    isOfflineMode = false;
    return true;
  } catch (error) {
    isOfflineMode = true;
    lastRetryTime = Date.now();
    return true; // Still return true because we updated locally
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const local = getLocalOrders();
  const localMatch = local.find(o => o.id === orderId);

  if (!shouldTryTurso()) return localMatch || null;

  try {
    await initDb().catch(() => {});
    const result = await turso.execute({ sql: 'SELECT * FROM Order_details WHERE id = ?', args: [orderId] });
    if (result.rows.length > 0) {
      const row: any = result.rows[0];
      return {
        id: parseId(row.id),
        user_id: row.user_id || '',
        customer_name: row.customer_name || '',
        phone: row.phone || '',
        address: row.address || '',
        lat: Number(row.lat) || 0,
        lng: Number(row.lng) || 0,
        clothes_weight: Number(row.clothes_weight) || 0,
        blankets_count: Number(row.blankets_count) || 0,
        total_price: Number(row.total_price) || 0,
        status: row.status as OrderStatus,
        created_at: row.created_at || new Date().toISOString(),
      };
    }
    return localMatch || null;
  } catch (error) {
    isOfflineMode = true;
    lastRetryTime = Date.now();
    return localMatch || null;
  }
}

export async function insertOrder(order: Partial<Order>): Promise<string | null> {
  const local = getLocalOrders();
  const newId = `ORD-${Date.now()}`;
  
  const newOrder: Order = {
    id: newId,
    user_id: order.user_id || '',
    customer_name: order.customer_name || 'Unknown',
    phone: order.phone || '',
    address: order.address || '',
    lat: order.lat || 0,
    lng: order.lng || 0,
    clothes_weight: order.clothes_weight || 0,
    blankets_count: order.blankets_count || 0,
    total_price: order.total_price || 0,
    status: (order.status as OrderStatus) || 'Pending',
    created_at: order.created_at || new Date().toISOString(),
  };

  // 1. SAVE LOCALLY
  saveLocalOrders([newOrder, ...local]);

  if (!shouldTryTurso()) return newId;

  // 2. TRY SYNCING
  try {
    await initDb().catch(() => {});
    await turso.execute({
      sql: `INSERT INTO Order_details (id, user_id, customer_name, phone, address, lat, lng, clothes_weight, blankets_count, total_price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newOrder.id, newOrder.user_id, newOrder.customer_name, newOrder.phone,
        newOrder.address, newOrder.lat, newOrder.lng,
        newOrder.clothes_weight, newOrder.blankets_count,
        newOrder.total_price, newOrder.status, newOrder.created_at
      ]
    });
    isOfflineMode = false;
    return newId;
  } catch (error) {
    isOfflineMode = true;
    lastRetryTime = Date.now();
    return newId;
  }
}

export async function getPendingOrders(): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter(o => o.status === 'Pending');
}

export async function getTrends() {
  const orders = await getOrders();
  const groups: Record<string, number> = {};
  orders.forEach(o => {
    const date = (o.created_at || '').split('T')[0] || new Date().toISOString().split('T')[0];
    groups[date] = (groups[date] || 0) + 1;
  });
  return Object.entries(groups).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getStatusCounts() {
  const orders = await getOrders();
  const groups: Record<string, number> = {};
  orders.forEach(o => {
    groups[o.status] = (groups[o.status] || 0) + 1;
  });
  return Object.entries(groups).map(([status, count]) => ({ status, count }));
}
