import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { applySeoToHead, allRoutes } from './lib/seoStatic.js';

/** Every URL to emit. Exported so the route list and the data stay in step. */
export const routes = allRoutes();

/**
 * Server entry used only at build time, by scripts/prerender.mjs.
 *
 * The site is a single-page app, so without this a crawler receives an empty
 * <div id="root"> and has to run JavaScript to see anything. Google usually
 * manages that; Bing, LinkedIn and the WhatsApp link preview bot frequently do
 * not. Rendering each route to real HTML at build time removes that dependency
 * entirely, and gives a visitor markup to paint before the bundle has parsed.
 *
 * StaticRouter rather than BrowserRouter: there is no history or location in
 * Node, so the URL is passed in explicitly.
 */
export function render(url, base = '/') {
  const basename = base.replace(/\/$/, '');

  /*
   * The location must INCLUDE the basename.
   *
   * StaticRouter matches the raw location against the basename first and, if it
   * does not start with it, renders nothing at all — silently. Passing a bare
   * "/about" alongside basename "/ceramica" produced empty markup for every
   * route on the subfolder build while the root build was fine, because there
   * the basename is "". The prerender then wrote pages with correct per-route
   * metadata and an empty body, which looks like a working build.
   */
  const html = renderToString(
    <React.StrictMode>
      <ErrorBoundary label="app">
        <StaticRouter basename={basename || undefined} location={`${basename}${url}`}>
          <App />
        </StaticRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );

  if (!html) {
    throw new Error(`prerender produced empty markup for ${url} (basename "${basename}")`);
  }

  return { html, head: applySeoToHead(url) };
}
