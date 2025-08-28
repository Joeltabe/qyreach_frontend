import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        // Backend server - update this to match your backend port
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔥 Proxy error - Backend server may not be running');
            console.log('💡 Backend should be running on port 3000 (or set VITE_API_BASE_URL)');
            console.log('📋 Error details:', err.message);
            
            // Try to send a helpful error response
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Backend server not available',
                message: 'Please start your backend server on port 3000'
              }));
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`📡 API Request: ${req.method} ${req.url}`);
          });
        }
      }
    }
  }
})
