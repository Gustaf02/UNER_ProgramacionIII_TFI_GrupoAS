import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ← Plugin ESPECÍFICO de v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ← Este plugin es OBLIGATORIO para v4
  ],
})