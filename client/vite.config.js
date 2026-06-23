import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
  build: {
    // Asegura que el sw.js en /public se copie tal cual al build
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
