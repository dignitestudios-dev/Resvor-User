import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://54.81.22.252:3001',
        changeOrigin: true,
        credentials: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
