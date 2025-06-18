import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    // Define environment variables for browser build
    __SUPABASE_URL__: JSON.stringify(process.env.VITE_SUPABASE_URL),
    __SUPABASE_ANON_KEY__: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    __STORE_PAYTAG__: JSON.stringify(process.env.VITE_STORE_PAYTAG),
    __PAYMAN_CLIENT_ID__: JSON.stringify(process.env.VITE_PAYMAN_CLIENT_ID),
    __PAYMAN_CLIENT_SECRET__: JSON.stringify(process.env.VITE_PAYMAN_CLIENT_SECRET),
    __PAYMAN_ENVIRONMENT__: JSON.stringify(process.env.VITE_PAYMAN_ENVIRONMENT),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
