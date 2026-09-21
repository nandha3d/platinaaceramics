import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

/**
 * Products page hero.
 *
 * The artwork is served as AVIF with a WebP fallback — 1709 KB as the source PNG,
 * 30 KB as AVIF at 1600px wide. It is the LCP element on this route, so it is
 * NOT lazy-loaded: `fetchpriority="high"` and eager loading get it into the
 * first request wave, which is the opposite of what you want for images further
 * down the page.
 *
 * A 114-byte blurred placeholder sits behind it as a CSS background, so the band
 * paints something immediately rather than showing a dark hole while the image
 * arrives.
 */
const LQIP = 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQBACdASoYAA0APu1krU6ppaSiMAgBMCWJZwDLTKgKS1AJRJhNiuUV1I8pfHqxTytUyv+8Adwot6+lfz1yCJ6+xIYqvSHqvOWnCz2VXm3IZItT5Vy7DlAAAA==';

export default function ProductsHero() {
  return (
    <section className="ph-hero" style={{ backgroundImage: `url("${LQIP}")` }}>
      <picture>
        <source
          type="image/avif"
          srcSet={`${import.meta.env.BASE_URL}hero/products-hero-900.avif 900w, ${import.meta.env.BASE_URL}hero/products-hero-1600.avif 1600w`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`${import.meta.env.BASE_URL}hero/products-hero-900.webp 900w, ${import.meta.env.BASE_URL}hero/products-hero-1600.webp 1600w`}
          sizes="100vw"
        />
        <img
          className="ph-hero-img"
          src={`${import.meta.env.BASE_URL}hero/products-hero-1600.webp`}
          alt="Inert alumina ceramic balls, tower packing rings and adsorbent media in front of a refinery"
          width={1717}
          height={916}
          decoding="async"
          fetchPriority="high"
        />
      </picture>

      <div className="ph-hero-scrim" aria-hidden="true" />

      {/* The copy block is nested INSIDE the container rather than being the
          container. Putting a max-width on .container-custom itself left its
          `margin: 0 auto` in force, so the block centred in the viewport and
          stranded the empty left third of the artwork. Nested, it starts at the
          container's left edge and lines up with the navbar logo. */}
      <div className="container-custom ph-hero-wrap">
        <div className="ph-hero-inner">
        <span className="label-tech ph-hero-eyebrow">Complete range</span>
        <h1 className="ph-hero-title">Inert Ceramic Media &amp; Bed Support</h1>
        <p className="ph-hero-lede">
          Inert alumina ceramic balls from 17% to 99% Al₂O₃, graded catalyst bed
          support media, ceramic tower packing, adsorbents and guard beds — every
          grade with a full datasheet.
        </p>
        <div className="ph-hero-actions">
          <a href="#catalogue" className="btn-primary" style={{ textDecoration: 'none' }}>
            Browse the catalogue <ArrowRight size={16} />
          </a>
          <Link to="/calculator" className="btn-ghost-light" style={{ textDecoration: 'none' }}>
            <FileText size={16} /> Size a bed
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
