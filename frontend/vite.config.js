import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: env.VITE_HOSTS.split(',').map((host) => host.trim()),
      hmr: {
        host: env.VITE_HMR_HOST,
        clientPort: env.VITE_HMR_PROTOCOL === 'wss' ? 443 : 80,
        protocol: env.VITE_HMR_PROTOCOL
      },
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    }
  }
});
