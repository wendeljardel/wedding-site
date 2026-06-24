import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
      // No dev, encaminha chamadas /api para o backend rodando localmente
      // (ex: sam local start-api na porta 3000)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
