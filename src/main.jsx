import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const container = document.getElementById('root')

const tree = (
  <StrictMode>
    <ErrorBoundary label="app">
      {/*
        basename comes from Vite's base, so a subfolder deploy needs no code
        change. Without it every route would resolve against the domain root and
        a deep link under /ceramica/ would 404 despite the assets loading.
        BASE_URL always carries a trailing slash; the router wants it without.
      */}
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
)

/*
 * Hydrate the prerendered markup rather than replacing it.
 *
 * The build writes real HTML for every route. createRoot would throw all of it
 * away and re-render from scratch, which wastes the work and makes the page
 * visibly blink as the server markup is swapped for identical client markup.
 * hydrateRoot adopts what is already there and only attaches behaviour.
 *
 * The emptiness check is the fallback for `vite dev`, where index.html still
 * ships an empty root and there is nothing to hydrate.
 */
if (container.firstChild) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
