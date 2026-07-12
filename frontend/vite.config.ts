import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// vite.config roda no Node; declaramos process para o tsc sem @types/node.
declare const process: { env: Record<string, string | undefined> }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    allowedHosts: ['.ngrok-free.app', '.ngrok.io', 'localhost'],
    hmr: {
      host: '127.0.0.1',
      port: 5173,
    },
    proxy: {
      // No dev, encaminha chamadas /api para a API publicada na AWS
      // (API Gateway). Sobrescreva com API_PROXY_TARGET=http://localhost:3000
      // caso rode um backend local.
      '/api': {
        target:
          process.env.API_PROXY_TARGET ??
          'https://cnztx0qzu3.execute-api.us-east-1.amazonaws.com',
        changeOrigin: true,
      },
    },
  },
})
