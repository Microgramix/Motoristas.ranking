// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Fastrack Ranking',
        short_name: 'Fastranking',
        description: 'Um app incrível em PWA',
        start_url: '/',
        display: 'fullscreen',  // Modo full screen
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/fasticon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/fasticon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
