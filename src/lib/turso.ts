import { createClient } from '@libsql/client';

// Use direct URL if provided in env (preferred), fallback to proxy in dev if missing
const url = import.meta.env.VITE_TURSO_URL || 
  (import.meta.env.DEV && typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api');
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.warn('Turso credentials are missing in .env file');
}

// Create the client
// When using the proxy '/api/turso', the driver will use standard fetch to the local dev server
export const turso = createClient({
  url: url || '',
  authToken: authToken || '',
});
