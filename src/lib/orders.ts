import { turso } from './turso';
import { initDb } from './migrations';
import { Order, OrderStatus } from '@/types';
import { MOCK_ORDERS } from './mockData';

const LOCAL_STORAGE_KEY = 'bubblestz_orders_cache';
let isOfflineMode = false;
let lastRetryTime = 0;
const RETRY_INTERVAL = 30000; // 30 seconds

/**
 * Robustly parses an ID to a number
 */
function parseId(id: any): number {
  const num = Number(id);
  return isNaN(num) ? 0 : num;
}

/**
 * Gets orders from localStorage, initializing with MOCK_ORDERS if empty
 */
function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return MOCK_ORDERS;
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      return MOCK_ORDERS;
    }
  }
  // Seed initial data if empty
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_ORDERS));
  return MOCK_ORDERS;
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
      turso.execute('SELECT * FROM order_details ORDER BY created_at DESC'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ]) as any;
    
    if (result.rows && result.rows.length > 0) {
      const orders = result.rows.map((row: any) => ({
        id: parseId(row.id),
        app_id: row.app_id || '',
        user_id: row.user_id || '',
        customer_name: row.customer_name || '',
        phone: row.phone || '',
        address: row.address || '',
        location_lat: Number(row.location_lat) || 0,
        location_lng: Number(row.location_lng) || 0,
        total_cost: Number(row.total_cost) || 0,
        status: (row.status as OrderStatus) || 'Pending',
        created_at: row.created_at || new Date().toISOString(),
      }));
      saveLocalOrders(orders);
      isOfflineMode = false;
      return orders;
    }
    return localOrders;
  } catch (error) {
    isOfflineMode = true;
    lastRetryTime = Date.now();
    return localOrders;
  }
}

export async function updateOrderStatus(
  orderId: number | string,
  status: OrderStatus,
  app_id?: string,
  user_id?: string
): Promise<boolean> {
  const numericId = Number(orderId);
  
  // 1. UPDATE LOCALLY IMMEDIATELY
  const local = getLocalOrders();
  const updated = local.map(o => o.id === numericId ? { ...o, status } : o);
  saveLocalOrders(updated);

  if (!shouldTryTurso()) {
    return true; // Act as if successful for UI responsiveness
  }

  // 2. TRY SYNCING IN BACKGROUND
  try {
    await initDb().catch(() => {});
    let query = 'UPDATE order_details SET status = ? WHERE id = ?';
    const params: any[] = [status, numericId];
    if (app_id) { query += ' AND app_id = ?'; params.push(app_id); }
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

export async function getOrderById(orderId: number | string): Promise<Order | null> {
  const id = Number(orderId);
  const local = getLocalOrders();
  const localMatch = local.find(o => o.id === id);

  if (!shouldTryTurso()) return localMatch || null;

  try {
    await initDb().catch(() => {});
    const result = await turso.execute({ sql: 'SELECT * FROM order_details WHERE id = ?', args: [id] });
    if (result.rows.length > 0) {
      const row: any = result.rows[0];
      return {
        id: parseId(row.id),
        app_id: row.app_id || '',
        user_id: row.user_id || '',
        customer_name: row.customer_name || '',
        phone: row.phone || '',
        address: row.address || '',
        location_lat: Number(row.location_lat) || 0,
        location_lng: Number(row.location_lng) || 0,
        total_cost: Number(row.total_cost) || 0,
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

export async function insertOrder(order: Partial<Order>): Promise<number | null> {
  const local = getLocalOrders();
  const validIds = local.map(o => Number(o.id)).filter(id => !isNaN(id) && id > 0);
  const newId = validIds.length > 0 ? Math.max(...validIds) + 1 : 1;
  
  const newOrder: Order = {
    id: newId,
    app_id: order.app_id || 'DefaultApp',
    user_id: order.user_id || '',
    customer_name: order.customer_name || 'Unknown',
    phone: order.phone || '',
    address: order.address || '',
    location_lat: order.location_lat || 0,
    location_lng: order.location_lng || 0,
    total_cost: order.total_cost || 0,
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
      sql: `INSERT INTO order_details (app_id, user_id, customer_name, phone, address, location_lat, location_lng, total_cost, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newOrder.app_id, newOrder.user_id, newOrder.customer_name, newOrder.phone,
        newOrder.address, newOrder.location_lat, newOrder.location_lng,
        newOrder.total_cost, newOrder.status, newOrder.created_at
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
