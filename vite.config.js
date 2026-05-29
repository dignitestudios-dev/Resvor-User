import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://35ppzgmv-3050.inc1.devtunnels.ms',
        changeOrigin: true,
        credentials: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
