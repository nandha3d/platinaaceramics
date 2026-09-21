import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy target is env-driven so the same source builds for either location:
//
//   npm run build                          -> domain root (platinaaceramics.com)
//   DEPLOY_BASE=/ceramica/ npm run build   -> subfolder   (animazon.in/ceramica/)
//
// The value must have both a leading and a trailing slash. It feeds three
// places that all have to agree — Vite's asset URLs, the router's basename and
// the .htaccess RewriteBase — so it is exposed to the app rather than repeated.
const base = process.env.DEPLOY_BASE || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  build: {
    // Fonts are self-hosted and already compressed; inlining small assets as
    // base64 would only bloat the JS that has to parse before first paint.
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        /*
         * React, the router and the icon set change far less often than the
         * site's own code. Splitting them out means a content edit ships a small
         * app chunk and leaves the vendor chunk in the visitor's cache, instead
         * of invalidating 400 kB on every deploy.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('lucide-react')) return 'vendor-icons'
          return undefined
        },
      },
    },
  },
})
