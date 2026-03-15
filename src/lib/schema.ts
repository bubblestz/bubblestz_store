export const ORDERS_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    location_lat REAL,
    location_lng REAL,
    clothes_weight REAL,
    blanket_count INTEGER DEFAULT 0,
    total_cost REAL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

