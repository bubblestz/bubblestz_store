import { turso } from './turso';
import { ORDERS_TABLE_SCHEMA } from './schema';
import { MOCK_ORDERS } from './mockData';
import type { Order } from '@/types';

let initialized = false;

export async function initDb(): Promise<void> {
  if (initialized) return;

  try {
    // Create table
    await turso.execute(ORDERS_TABLE_SCHEMA);

    // Seed with mock data if empty
    const countResult = await turso.execute('SELECT COUNT(*) as count FROM orders');
    const count = Number(countResult.rows[0]?.count || 0);

    if (count === 0) {
      for (const order of MOCK_ORDERS) {
        await turso.execute({
          sql: `
            INSERT INTO orders 
            (app_id, user_id, customer_name, phone, address, location_lat, location_lng, 
             clothes_weight, blanket_count, total_cost, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            order.app_id,
            order.user_id,
            order.customer_name,
            order.phone,
            order.address,
            order.location_lat,
            order.location_lng,
            order.clothes_weight,
            order.blanket_count,
            order.total_cost,
            order.status,
            order.created_at,
          ],
        });
      }
      console.log('Database initialized with mock orders');
    }

    initialized = true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

