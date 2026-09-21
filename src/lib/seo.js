/**
 * Per-route document head management.
 *
 * The site is a client-rendered SPA, so index.html's tags are the only ones a
 * crawler sees until React runs. Before this, every route below "/" inherited
 * the home page's title and description verbatim — eight URLs competing with
 * each other on identical metadata, which search engines treat as duplicates and
 * is the single cheapest SEO problem to fix here.
 */

/** Production origin. Everything canonical points here regardless of where the
 *  bundle is actually served from. */
export const SITE_URL = 'https://platinaaceramics.com';

const DEFAULT_IMAGE = `${SITE_URL}/og-cover.jpg`;



function upsertMeta(selector, attr, name, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  return el;
}

/**
 * Applies a route's metadata. Returns a restore function so a page can put back
 * whatever was there when it unmounts.
 *
 * `path` is the route path without the deploy base, e.g. "/products".
 */
export function applySeo({ title, description, path = '/', image, type = 'website', jsonLd }) {
  const origin = typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null'
    ? window.location.origin
    : SITE_URL;
  const canonical = `${origin}${path === '/' ? '/' : path}`;
  const img = image ? (image.startsWith('http') ? image : `${origin}/${image.replace(/^\//, '')}`) : DEFAULT_IMAGE;

  const prevTitle = document.title;
  document.title = title;

  upsertMeta('meta[name="description"]', 'name', 'description', description);
  upsertLink('canonical', canonical);

  upsertMeta('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large');

  upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
  upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', img);

  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', img);

  // Route-specific structured data lives in its own tag so it can be removed
  // cleanly without touching the site-wide graph in index.html.
  let ld = null;
  if (jsonLd) {
    ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.dataset.route = 'true';
    ld.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(ld);
  }

  return () => {
    document.title = prevTitle;
    ld?.remove();
  };
}

/** Breadcrumb trail, which is what produces the path display under a result. */
export function breadcrumbs(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`
    }))
  };
}
