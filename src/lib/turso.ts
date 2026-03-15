import { createClient } from '@libsql/client';

const url = import.meta.env.VITE_TURSO_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.warn('Turso credentials are missing in .env file');
}

import { initDb } from './migrations';

let _initialized = false;

export const turso = createClient({
  url: url || '',
  authToken: authToken || '',
});

// Auto-initialize on first use
const originalExecute = turso.execute.bind(turso);
turso.execute = (async (...args: any[]) => {
  if (!_initialized) {
    _initialized = true;
    try {
      await initDb();
    } catch (error) {
      console.error('Database initialization failed:', error);
      _initialized = false;
    }
  }
  return originalExecute(...(args as [any]));
}) as any;
