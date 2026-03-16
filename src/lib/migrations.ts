import { turso } from './turso';
import { ORDERS_TABLE_SCHEMA } from './schema';
import { MOCK_ORDERS } from './mockData';

let initialized = false;

export async function initDb(): Promise<void> {
  if (initialized) return;

  try {
    // Create table
    await turso.execute(ORDERS_TABLE_SCHEMA);

    // Migration: Update old statuses to new ones if they exist
    const migrationMap = {
      'Preparing': 'Washing',
      'Ready': 'Ready for Delivery',
      'Out for Delivery': 'Ready for Delivery'
    };

    for (const [oldStatus, newStatus] of Object.entries(migrationMap)) {
      await turso.execute({
        sql: 'UPDATE order_details SET status = ? WHERE status = ?',
        args: [newStatus, oldStatus],
      });
    }

    // Seed with mock data if empty
    const countResult = await turso.execute('SELECT COUNT(*) as count FROM order_details');
    const count = Number(countResult.rows[0]?.count || 0);

    if (count === 0) {
      for (const order of MOCK_ORDERS) {
        await turso.execute({
          sql: `
            INSERT INTO order_details 
            (app_id, user_id, customer_name, phone, address, location_lat, location_lng, 
             total_cost, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            order.app_id,
            order.user_id,
            order.customer_name,
            order.phone,
            order.address,
            order.location_lat,
            order.location_lng,
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
