import { SITE_URL } from './seo';
import { ROUTE_META } from './routeMeta';
import { products } from '../data/products';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Head markup for a route, produced at build time.
 *
 * The runtime path (applySeo) mutates document from inside an effect, and
 * effects do not run during renderToString — so a prerendered page would
 * otherwise ship the index.html defaults on every URL, which is the duplicate
 * metadata problem the whole SEO pass existed to fix. This produces the same
 * tags as strings, from the same ROUTE_META.
 */
export function applySeoToHead(url) {
  const path = url.split('?')[0].replace(/\/$/, '') || '/';

  let meta = ROUTE_META[path];
  let jsonLd = null;

  // Product detail pages are data-driven rather than listed in ROUTE_META.
  if (!meta && path.startsWith('/products/')) {
    const id = path.slice('/products/'.length);
    const p = products.find((x) => x.id === id);
    if (p) {
      meta = {
        title: `${p.name} — Technical Datasheet | Platinaa Ceramics`,
        description: p.shortDesc,
        path
      };
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description: p.shortDesc,
        category: p.category,
        material: 'Alumina (Al2O3)',
        brand: { '@type': 'Organization', name: 'Platinaa Industrial Ceramics Pvt Ltd' }
      };
    }
  }

  if (!meta) return '';

  const canonical = `${SITE_URL}${meta.path === '/' ? '/' : meta.path}`;
  const img = `${SITE_URL}/og-cover.jpg`;

  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${img}" />`
  ];

  if (jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
  }

  return tags.join('\n    ');
}

/** Every URL the prerenderer should emit. */
export function allRoutes() {
  return [...Object.keys(ROUTE_META), ...products.map((p) => `/products/${p.id}`)];
}
