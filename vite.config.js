import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Project image assets live in ./Pictures — import as "@pictures/<file>"
      '@pictures': fileURLToPath(new URL('./Pictures', import.meta.url)),
    },
  },
})
