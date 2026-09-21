import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, BadgeCheck, FileWarning, Maximize2, X } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

const SLIDE_MS = 6000;

/* ------------------------------------------------------------ moving border */

/** Seconds for one full lap of the card outline. */
const BORDER_LAP_S = 9;
/** Length of the longest (faintest) layer, in pathLength units out of 100. */
const BORDER_MAX_LEN = 20;
/** More layers = smoother taper. Three was visibly stepped. */
const BORDER_LAYER_COUNT = 14;

/**
 * Concentric dashes forming one line that thins and fades toward both ends.
 *
 * Every layer shares a single keyframe (dashoffset 0 to -100). They are kept
 * concentric with a NEGATIVE animation-delay rather than a per-layer keyframe:
 * a delay of -t seconds starts the layer t seconds into the same timeline, which
 * is exactly a phase shift along the path. Shifting each layer by half its
 * shortfall against the longest one puts every dash on the same midpoint.
 *
 * The alternative was fourteen near-identical @keyframes blocks, or animating a
 * custom property, which needs @property and degrades to a static line where
 * that is unsupported. This works everywhere CSS animations do.
 */
const BORDER_LAYERS = Array.from({ length: BORDER_LAYER_COUNT }, (_, i) => {
  const u = i / (BORDER_LAYER_COUNT - 1);          // 0 = outer trail, 1 = core
  const len = BORDER_MAX_LEN + (3 - BORDER_MAX_LEN) * u;
  return {
    key: `ib-${i}`,
    len,
    width: 0.8 + (2.4 - 0.8) * u,
    // Eased so the falloff is gradual at the tail rather than linear banding.
    opacity: 0.06 + 0.94 * u ** 1.6,
    delay: -((BORDER_MAX_LEN - len) / 2) * (BORDER_LAP_S / 100)
  };
});

/**
 * One scanned credential. The image is not guaranteed to exist — the files are
 * supplied separately — so a load failure falls back to a labelled card carrying
 * the same information as text rather than leaving a broken image on the home
 * page. The fallback is deliberately not a facsimile of the certificate: an
 * invented credential document would be worse than none.
 */
function CredentialSlide({ item, active, onOpen }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="cred-slide"
      aria-hidden={!active}
      // Inert while off-screen, so hidden slides are not tab stops.
      {...(!active ? { inert: true } : {})}
    >
      {failed ? (
        <div className="cred-missing">
          <FileWarning size={26} aria-hidden="true" />
          <span className="cred-missing-title">{item.title}</span>
          <span className="cred-missing-note">{item.issuer}</span>
        </div>
      ) : (
        <button
          type="button"
          className="cred-open"
          onClick={() => onOpen(item)}
          aria-label={`View ${item.title} certificate full size`}
        >
          <img
            src={`${import.meta.env.BASE_URL}${item.src}`}
            alt={`${item.title} — ${item.issuer}`}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
          <span className="cred-open-hint" aria-hidden="true">
            <Maximize2 size={15} /> View full size
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * Full-screen certificate viewer.
 *
 * These are scanned documents whose whole value is being readable — at carousel
 * size the certificate number and scope text cannot be made out, which is
 * exactly what a buyer verifying a supplier wants to check.
 */
function CredentialLightbox({ item, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="cred-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — ${item.issuer}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button ref={closeRef} type="button" className="cred-lightbox-close" onClick={onClose} aria-label="Close">
        <X size={20} />
      </button>
      <figure className="cred-lightbox-figure">
        <img src={`${import.meta.env.BASE_URL}${item.src}`} alt={`${item.title} — ${item.issuer}`} />
        <figcaption>
          <strong>{item.title}</strong> · {item.issuer} · {item.meta}
        </figcaption>
      </figure>
    </div>
  );
}

export default function CompanyIntro() {
  const slides = companyInfo.credentials;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zoomed, setZoomed] = useState(null);
  const regionRef = useRef(null);

  const go = useCallback((next) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance, held while the visitor is hovering, focused inside, or has
  // asked for reduced motion. An unstoppable carousel is the classic complaint.
  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    let reduced = false;
    try {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch { /* older browsers just get the carousel */ }
    if (reduced) return undefined;

    const t = setTimeout(() => go(index + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, go, slides.length]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  };

  const current = slides[index];

  return (
    <section className="intro-band" aria-labelledby="company-intro-title">
      <div className="container-custom intro-grid">

        {/* ------------------------------------------------------- copy ---- */}
        <div className="intro-card reveal">
          {/*
            One dash travelling the card's outline.

            This replaced a rotating conic gradient, which could not work here: a
            conic rotates about the centre, so equal angles only map to equal
            distance along the edge when the element is a circle. On a tall card
            the arc crawled up the long sides and shot across the short ones,
            reading as the line dying at one corner and a new one starting at the
            next. A stroke dash follows the real perimeter, so it moves at one
            constant speed the whole way round.

            pathLength="100" normalises the outline to 100 units regardless of the
            card's rendered size, which is what lets the dash pattern and the
            offset wrap exactly and keeps the loop seamless at any height.
          */}
          <svg className="intro-border" aria-hidden="true" focusable="false">
            {BORDER_LAYERS.map((l) => (
              <rect
                key={l.key}
                className="ib-layer"
                width="100%" height="100%" rx="18" pathLength="100"
                style={{
                  strokeWidth: l.width,
                  strokeDasharray: `${l.len} ${100 - l.len}`,
                  opacity: l.opacity,
                  animationDelay: `${l.delay}s`
                }}
              />
            ))}
          </svg>

          <span className="label-tech intro-eyebrow">Company profile</span>
          <h2 id="company-intro-title" className="intro-title">
            Platinaa Industrial Ceramics
          </h2>

          <div className="intro-body">
            {companyInfo.homeIntro.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
          </div>

          {/* The copy names paint and printing ink specifically, so the imagery
              backs the claim rather than decorating around it. Shown at close to
              native size — the source files are 360px wide and a full-bleed band
              would be visibly soft. */}
          <div className="intro-figures">
            <figure>
              <img
                src={`${import.meta.env.BASE_URL}industries-paint.jpg`}
                alt="Open tins of coloured paint on a production line"
                width={360} height={280} loading="lazy" decoding="async"
              />
              <figcaption>Paint &amp; coatings</figcaption>
            </figure>
            <figure>
              <img
                src={`${import.meta.env.BASE_URL}industries-printing.jpg`}
                alt="Printing ink production"
                width={360} height={280} loading="lazy" decoding="async"
              />
              <figcaption>Printing inks</figcaption>
            </figure>
          </div>

          <div className="intro-actions">
            <Link to="/about" className="btn-primary" style={{ textDecoration: 'none' }}>
              More about us <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Talk to our sales team
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------ credentials ---- */}
        <div
          className="cred-card reveal"
          ref={regionRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Certifications"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
          }}
        >
          <div className="cred-head">
            <BadgeCheck size={18} aria-hidden="true" />
            <span>Certified &amp; audited</span>
            <span className="cred-count">{index + 1}/{slides.length}</span>
          </div>

          <div className="cred-viewport">
            <div
              className="cred-track"
              style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
            >
              {slides.map((item, i) => (
                <CredentialSlide key={item.id} item={item} active={i === index} onOpen={setZoomed} />
              ))}
            </div>

            <button
              type="button" className="cred-nav cred-nav--prev"
              onClick={() => go(index - 1)} aria-label="Previous certificate"
            >
              <ChevronLeft size={18} aria-hidden="true" />
              <span className="sr-only">Previous certificate</span>
            </button>
            <button
              type="button" className="cred-nav cred-nav--next"
              onClick={() => go(index + 1)} aria-label="Next certificate"
            >
              <ChevronRight size={18} aria-hidden="true" />
              <span className="sr-only">Next certificate</span>
            </button>
          </div>

          {/* aria-live so the caption change is announced, since the visual
              transition alone conveys nothing to a screen reader. */}
          <div className="cred-caption" aria-live="polite">
            <div className="cred-title">{current.title}</div>
            <div className="cred-issuer">{current.issuer}</div>
            <div className="cred-meta">{current.meta}</div>
            <p className="cred-note">{current.note}</p>
          </div>

          <div className="cred-dots" aria-label="Select certificate slide">
            {slides.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-current={i === index ? 'true' : 'false'}
                aria-label={`Show ${item.title} certificate`}
                className={`cred-dot${i === index ? ' is-on' : ''}`}
                onClick={() => go(i)}
              >
                <span
                  className="cred-dot-fill"
                  style={{ animationDuration: `${SLIDE_MS}ms` }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {zoomed && <CredentialLightbox item={zoomed} onClose={() => setZoomed(null)} />}
    </section>
  );
}
