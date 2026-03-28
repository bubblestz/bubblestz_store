export const ORDERS_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS Order_details (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    customer_name TEXT,
    phone TEXT,
    address TEXT,
    lat REAL,
    lng REAL,
    clothes_weight REAL,
    blankets_count INTEGER,
    total_price REAL,
    status TEXT DEFAULT 'Pending',
    created_at NUMERIC DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Order_details_user_id_clients_details_id_fk FOREIGN KEY(user_id) REFERENCES clients_details(id)
  )
`;
