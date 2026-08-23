import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from the domain root (https://platinaaceramics.com/).
  // If you deploy into a subfolder instead, set this to '/subfolder/'.
  base: '/',
  plugins: [react()],
})
