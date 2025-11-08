import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For Vercel: use '/' (serves from root)
  // For GitHub Pages: use '/VNR202/'
  base: '/'
})