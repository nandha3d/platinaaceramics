import { breadcrumbs } from './seo';

/**
 * Single source of route metadata.
 *
 * Both the runtime hook (useSeo, which runs in an effect) and the build-time
 * prerenderer (which cannot run effects) read from here. Keeping two copies —
 * one inline in each page, one in the prerender script — would drift the moment
 * anyone edited a title, and the drift would be invisible until someone checked
 * the served HTML against the hydrated page.
 */
export const ROUTE_META = {
  '/': {
    title: 'Inert Alumina Ceramic Balls & Catalyst Bed Support Balls Manufacturer | Platinaa Ceramics',
    description: 'Manufacturer of high-purity inert alumina ceramic balls and catalyst bed support media, 17% to 99% Al2O3, 3 mm to 75 mm, to HG/T 3683.1-2014. ISO 9001:2015 certified works at Erode, Tamil Nadu.',
    path: '/',
    trail: [{ name: 'Home', path: '/' }]
  },
  '/products': {
    title: 'Product Catalogue — Inert Ceramic Balls, Tower Packing & Adsorbents | Platinaa Ceramics',
    description: 'Full catalogue of inert alumina ceramic balls, catalyst bed support media, ceramic tower packing, activated alumina, molecular sieves and guard bed adsorbents, with datasheets for every grade.',
    path: '/products',
    trail: [{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }]
  },
  '/industries': {
    title: 'Industries Served — Refining, Petrochemical, Fertilizer & Gas | Platinaa Ceramics',
    description: 'Inert ceramic bed support and tower packing for refining, petrochemical, fertilizer, gas processing, paint and printing ink production. Layer-by-layer grading prepared to your reactor drawing.',
    path: '/industries',
    trail: [{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries' }]
  },
  '/calculator': {
    title: 'Bed Support Media Calculator — Tonnage & Layer Grading | Platinaa Ceramics',
    description: 'Estimate the tonnage of inert ceramic bed support media for your reactor from vessel diameter, layer depth and ball size, using published bulk densities and voidage.',
    path: '/calculator',
    trail: [{ name: 'Home', path: '/' }, { name: 'Spec Calculator', path: '/calculator' }]
  },
  '/about': {
    title: 'About Platinaa Industrial Ceramics — ISO 9001:2015 Manufacturer, Erode',
    description: 'Platinaa Industrial Ceramics Pvt Ltd manufactures inert alumina ceramic balls and catalyst bed support media at Erode, Tamil Nadu. ISO 9001:2015 certified, batch certification on every consignment.',
    path: '/about',
    trail: [{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about' }]
  },
  '/contact': {
    title: 'Contact & Request a Quotation | Platinaa Industrial Ceramics',
    description: 'Request bulk pricing and datasheets for inert alumina ceramic balls and catalyst bed support media. Works and registered office at Kumalankuttai, Erode, Tamil Nadu 638011.',
    path: '/contact',
    trail: [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]
  }
};

/** Shape a route's entry for useSeo / applySeo. */
export function seoFor(route) {
  const m = ROUTE_META[route];
  if (!m) return null;
  return {
    title: m.title,
    description: m.description,
    path: m.path,
    jsonLd: breadcrumbs(m.trail)
  };
}
