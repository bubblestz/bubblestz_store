import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    proxy: {
      '/api/turso': {
        target: 'https://bubbeoders-am3lue.aws-eu-west-1.turso.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/turso/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
