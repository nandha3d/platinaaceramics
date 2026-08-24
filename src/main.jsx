import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
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
  </StrictMode>,
)
