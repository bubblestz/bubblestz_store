import { createClient } from '@libsql/client';

// Use the Vite proxy in development to bypass CORS, fall back to direct URL in production
const isDev = import.meta.env.DEV;
const url = isDev ? '/api/turso' : import.meta.env.VITE_TURSO_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.warn('Turso credentials are missing in .env file');
}

import { initDb } from './migrations';

let _initialized = false;

// Create the client
// When using the proxy '/api/turso', the driver will use standard fetch to the local dev server
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
      await initDb().catch(() => {}); // Silent fail for init
    } catch (error) {
      _initialized = false;
    }
  }
  return originalExecute(...(args as [any]));
}) as any;
