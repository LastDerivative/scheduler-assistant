import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/employees': 'http://localhost:3000',  // Proxy API employees requests to back-end
      '/shifts': 'http://localhost:3000',  // Proxy API shift requests to back-end
      '/employeeRequests': 'http://localhost:3000',  // Proxy API shift-trade requests to back-end
    }
  }
});
