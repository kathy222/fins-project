// vite.config.ts (FINAL PROXY FIX)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
console.log('🔧 Vite config loaded!');

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/resources': {
        target: 'https://demos.isl.ics.forth.gr',
        changeOrigin: true,
        
        // **CRUCIAL FIX:** This rewrite is the key to routing success
        rewrite: (path) => {
          const newPath = path.replace(/^\/api\/resources/, '/semantyfish-api/resources');
          console.log(`Proxying: ${path} -> ${newPath}`);
          return newPath;
        },
        secure: false,
        
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          
          // FIX: Renaming proxyReq to _proxyReq to silence the 'unused variable' warning
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
})