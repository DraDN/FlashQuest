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
  const hostsString = env.VITE_HOSTS || 'localhost';

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,


      allowedHosts: hostsString.split(',').map((host) => host.trim()),

      hmr: {
        host: env.VITE_HMR_HOST || 'localhost',
        protocol: env.VITE_HMR_PROTOCOL || 'ws',
        clientPort: env.VITE_HMR_PORT ? parseInt(env.VITE_HMR_PORT) : 5173,
        port: 5173
      },

      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://backend:3000',
          changeOrigin: true,
        },
      },
    }
  }
});
