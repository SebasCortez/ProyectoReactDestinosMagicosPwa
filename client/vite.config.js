import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 1. allowedHosts va aquí (dentro de server, fuera de proxy)
    allowedHosts: [
      'trapper-playoff-manliness.ngrok-free.dev'
    ],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
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