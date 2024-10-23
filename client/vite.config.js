import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/employees': 'http://localhost:3000',  // Proxy API requests to back-end
      '/shifts': 'http://localhost:3000',       // Add this line to proxy shift requests
    }
  }
});
