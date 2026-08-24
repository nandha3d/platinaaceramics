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
})
