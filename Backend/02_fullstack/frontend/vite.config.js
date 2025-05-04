import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: { //whenever we use /api automatically it will add/append in this url and 100% sure that this /api request origin from this url(http://localhost:3000) 
    proxy: {
      '/api': 'http://localhost:3000', 
    },
  },
  plugins: [react()],
})
