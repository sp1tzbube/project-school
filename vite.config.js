import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    allowedHosts: [
      'localhost',
      '.ngrok-free.app' 
    ],
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})