/*
 * Renders every route to static HTML after the client build.
 *
 * Why: this is a client-rendered SPA, so the served HTML is an empty
 * <div id="root">. Google can execute JavaScript to fill it, but Bing, LinkedIn
 * and the WhatsApp link-preview bot largely cannot — and even for Google it
 * costs a second crawl pass. Prerendering also removes JavaScript from the
 * critical path for first paint: the visitor sees the real page before the
 * bundle has parsed, and React then hydrates it in place.
 *
 * Run automatically by `npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const base = process.env.DEPLOY_BASE || '/';
const dist = 'dist';
const ssrEntry = join(process.cwd(), 'dist-ssr', 'entry-server.js');

if (!existsSync(ssrEntry)) {
  console.error('prerender: dist-ssr/entry-server.js missing — the SSR build did not run.');
  process.exit(1);
}

// The route list travels with the SSR bundle, so it is derived from the same
// product data the pages render and cannot fall out of step with it.
const { render, routes } = await import(pathToFileURL(ssrEntry).href);
const template = readFileSync(join(dist, 'index.html'), 'utf8');

let count = 0;
for (const url of routes) {
  const { html, head } = render(url, base);

  let page = template
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  if (head) {
    // Replace the template's own title/description/canonical with the route's,
    // rather than appending duplicates.
    page = page
      .replace(/<title>[\s\S]*?<\/title>\s*/, '')
      .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, '')
      .replace(/<link rel="canonical"[^>]*\/>\s*/, '')
      .replace(/<meta property="og:title"[^>]*\/>\s*/, '')
      .replace(/<meta\s+property="og:description"[\s\S]*?\/>\s*/, '')
      .replace(/<meta property="og:url"[^>]*\/>\s*/, '')
      .replace(/<meta property="og:image" content="[^"]*" \/>\s*/, '')
      .replace(/<meta name="twitter:title"[^>]*\/>\s*/, '')
      .replace(/<meta\s+name="twitter:description"[\s\S]*?\/>\s*/, '')
      .replace(/<meta name="twitter:image"[^>]*\/>\s*/, '')
      .replace('</head>', `  ${head}\n  </head>`);
  }

  const outPath = url === '/' ? join(dist, 'index.html') : join(dist, url, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, page);
  count++;
}

// The SSR bundle is a build artefact; it must not ship.
rmSync('dist-ssr', { recursive: true, force: true });

console.log(`prerender: ${count} routes written as static HTML`);
