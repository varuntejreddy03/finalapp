import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",   // default, but makes it explicit for Render
  },
  base: "/",          // important for React Router on reload
})
