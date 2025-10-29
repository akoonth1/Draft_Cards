import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const base = {
    plugins: [react()],
  }

  // dev server options only when running `vite` / `npm run dev`
  if (command === 'serve') {
    base.server = {
      host: '0.0.0.0',
      port: 3000
    }
  }

  return base
})
