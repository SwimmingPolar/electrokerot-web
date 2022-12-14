import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        env: {
          production: {
            plugins: [
              [
                'react-remove-properties',
                {
                  properties: ['data-cy']
                }
              ]
            ]
          }
        }
      }
    })
  ],
  server: {
    port: 8080,
    proxy: {
      '/v1': {
        target: 'http://localhost:5611',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
