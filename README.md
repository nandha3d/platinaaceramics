# Platinaa Ceramics

Marketing site for **PLATINAA INDUSTRIAL CERAMICS PVT LTD** — inert alumina ceramic
balls, catalyst bed support media, ceramic tower packing, adsorbents and guard beds.

React 19 + Vite 8. Builds to plain static files — no server runtime, no database.

---

## Run it locally

### Windows (easiest)

```powershell
.\setup.ps1
```

Checks Node, installs dependencies if needed, starts the dev server on
<http://localhost:5173/> and opens your browser.

If Windows blocks the script, run this once in the same terminal:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### macOS / Linux / Git Bash

```bash
./setup.sh
```

### Or plain npm (any platform)

```bash
npm start          # installs, then starts the dev server
```

---

## Script options

| Command | What it does |
| --- | --- |
| `.\setup.ps1` | Install if needed, start dev server, open browser |
| `.\setup.ps1 -Fresh` | Delete `node_modules` + lockfile, reinstall, then start |
| `.\setup.ps1 -Build` | Production build into `dist\` |
| `.\setup.ps1 -Preview` | Build, then serve the built site locally |
| `.\setup.ps1 -Port 3000` | Use a different port |

`setup.sh` takes `--fresh`, `--build`, `--preview`.

Raw npm scripts: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.

**Requires Node 20 or newer** (Vite 8). Check with `node -v`.

---

## Deploying

```bash
npm run build
```

Upload **the contents of `dist/`** to the web root. That is the whole deployment —
it is a static site, so any shared hosting plan serves it without PHP, a database
or a Node process.

`vite.config.js` sets `base: '/'` for the domain root. If you deploy into a
subfolder, change it to `base: '/your-subfolder/'` and rebuild.

---

## Project layout

```
src/
  data/
    products.js      23 products across 5 categories — specs to HG/T 3683.1-2014
    industries.js    9 sectors served
    companyInfo.js   Brand, address, contact, certifications, stats
  components/
    FullWidth3DSliderHero.jsx   Hero with the 3D ball canvas overlaid
    Physics3DHeroCanvas.jsx     The 3D physics ball simulation
    ProductsSection.jsx         Filterable catalogue grid
    ProductDetailModal.jsx      Datasheet modal with 3D preview
    SpecCalculator.jsx          Reactor bed volume / tonnage calculator
    IndustriesSection.jsx       Sector selector
    AboutSection.jsx  ContactSection.jsx  Navbar.jsx  Footer.jsx
    CompareDrawer.jsx           Side-by-side product comparison
  index.css          Design tokens: sandal / brown / white palette
public/
  robots.txt  sitemap.xml  favicon.svg  concrete.png (3D floor texture)
```

### Editing content

Almost all copy lives in `src/data/`. To add a product, append an object to the
`products` array in `products.js` using the same keys as the existing entries —
the catalogue grid, filters, datasheet modal and comparison drawer all read from
there automatically.

---

## Design system

Palette is defined once as CSS custom properties at the top of `src/index.css`:

- `--sand-50` … `--sand-600` — warm neutral (sandal)
- `--clay-400` … `--clay-900` — brown through near-black espresso
- White and warm white for surfaces

Type: **Fraunces** (display serif), **Inter** (body), **JetBrains Mono**
(technical figures and labels).

Change the palette in `:root` and it propagates through the whole site.

---

## Performance notes

The 3D hero is heavy (three.js). It is loaded with `React.lazy` so the page text
and layout paint first:

| Chunk | Gzipped | When it loads |
| --- | --- | --- |
| `index.js` + CSS | ~96 kB | Immediately |
| `Physics3DHeroCanvas` | ~114 kB | After first paint |
| `ContactShadows` (drei) | ~236 kB | With the 3D canvas |
| `ThreeCanvas` | ~7 kB | Only when a datasheet modal opens |

`public/concrete.png` is 805 kB and is the 3D floor texture. Converting it to
WebP would cut it to roughly 60 kB with no visible difference.

---

## Known SEO limitation

This is a single-page app on one URL, rendered in the browser. All 23 products
share `https://platinaaceramics.com/`, so the site cannot rank separately for
each product's keywords, and crawlers that do not execute JavaScript (Bing and
most AI crawlers) see an empty page.

Fixing that means pre-rendering to static HTML with per-product routes — an Astro
migration or a Vite prerender plugin. The components and `src/data/` files are
already structured for it.
