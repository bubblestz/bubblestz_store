import { turso } from './turso';
import { ORDERS_TABLE_SCHEMA } from './schema';
import { MOCK_ORDERS } from './mockData';

let initialized = false;

export async function initDb(): Promise<void> {
  if (initialized) return;

  try {
    // Create table
    await turso.execute(ORDERS_TABLE_SCHEMA);

    // Check for existing data
    const countResult = await turso.execute('SELECT COUNT(*) as count FROM Order_details');
    const count = Number(countResult.rows[0]?.count || 0);
    
    if (count === 0) {
      console.log('Database table exists but is empty. No mock data will be seeded.');
    } else {
      console.log(`Database connected successfully. Found ${count} orders.`);
    }

    initialized = true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
