import { turso } from './turso';
import { initDb } from './migrations';
import { Order, OrderStatus } from '@/types';
import { MOCK_ORDERS } from './mockData';

export async function getOrders(): Promise<Order[]> {
  try {
    await initDb();
    const result = await turso.execute('SELECT * FROM orders ORDER BY created_at DESC');
    
    if (!result.rows || result.rows.length === 0) {
      return MOCK_ORDERS;
    }
    
    return result.rows.map((row: any) => ({
      id: Number(row.id),
      app_id: row.app_id || '',
      user_id: row.user_id || '',
      customer_name: row.customer_name || '',
      phone: row.phone || '',
      address: row.address || '',
      location_lat: Number(row.location_lat) || 0,
      location_lng: Number(row.location_lng) || 0,
      clothes_weight: Number(row.clothes_weight) || 0,
      blanket_count: Number(row.blanket_count) || 0,
      total_cost: Number(row.total_cost) || 0,
      status: row.status as OrderStatus,
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching orders from Turso:', error);
    return MOCK_ORDERS;
  }
}

export async function updateOrderStatus(orderId: number | string, status: OrderStatus): Promise<boolean> {
  try {
    await initDb();
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    const params: any[] = [status, orderId];

    await turso.execute({
      sql: query,
      args: params,
    });
    return true;
  } catch (error) {
    console.error('Error updating order status in Turso:', error);
    return false;
  }
}

export async function getOrderById(orderId: number | string): Promise<Order | null> {
  try {
    await initDb();
    const result = await turso.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [orderId],
    });

    if (result.rows.length === 0) {
      // Fallback to mock data
      return MOCK_ORDERS.find(o => o.id === Number(orderId)) || null;
    }

    const row: any = result.rows[0];
    
    return {
      id: Number(row.id),
      app_id: row.app_id || '',
      user_id: row.user_id || '',
      customer_name: row.customer_name || '',
      phone: row.phone || '',
      address: row.address || '',
      location_lat: Number(row.location_lat) || 0,
      location_lng: Number(row.location_lng) || 0,
      clothes_weight: Number(row.clothes_weight) || 0,
      blanket_count: Number(row.blanket_count) || 0,
      total_cost: Number(row.total_cost) || 0,
      status: row.status as OrderStatus,
      created_at: row.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching order from Turso:', error);
    return MOCK_ORDERS.find(o => o.id === Number(orderId)) || null;
  }
}
