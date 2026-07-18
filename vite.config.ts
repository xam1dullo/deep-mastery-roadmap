import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative base so the built app works both at a domain root (Vercel) and
  // under a project subpath (GitHub Pages: /<repo>/). Safe because the app is a
  // single page with no client-side router.
  base: './',
  plugins: [react(), tailwindcss()],
})
