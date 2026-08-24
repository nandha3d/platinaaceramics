import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MapPin, Navigation, Copy, Check, Maximize2, Minimize2, ExternalLink,
  Phone, MessageCircle, Mail, Map as MapIcon, Satellite, Factory, Loader2
} from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

/**
 * Google's place id for the works, taken from the canonical listing URL. The cid
 * form is what resolves to the verified business pin rather than a text search,
 * which can land on the wrong side of the road for an industrial address.
 */
const PLACE_CID = '8732242145945800466';
const CANONICAL_URL = `https://www.google.com/maps?cid=${PLACE_CID}`;

const ADDRESS = companyInfo.address;
const ADDRESS_QUERY = encodeURIComponent(ADDRESS.full);

/**
 * `output=embed` is the keyless embed. The Maps Embed API proper needs a billed
 * API key, and a key shipped in a client bundle is a key anyone can spend, so
 * this form is used deliberately. `t=k` selects the satellite layer.
 */
function embedUrl(layer) {
  const base = `https://www.google.com/maps?cid=${PLACE_CID}&hl=en&z=16&output=embed`;
  return layer === 'satellite' ? `${base}&t=k` : base;
}

const DIRECTIONS_URL =
  `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS_QUERY}`;

const LAYERS = [
  { id: 'map', label: 'Map', Icon: MapIcon },
  { id: 'satellite', label: 'Satellite', Icon: Satellite }
];

/* ------------------------------------------------------------------ actions */

function ActionButton({ href, onClick, Icon, label, sub, tone = 'default' }) {
  const accent = tone === 'primary' ? 'var(--brand-red)' : 'var(--cat-3)';
  const common = {
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
    padding: '13px 14px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-main)', border: '1px solid var(--border-light)',
    color: 'var(--text-bright)', textDecoration: 'none', cursor: 'pointer',
    font: 'inherit', textAlign: 'left', minHeight: '58px',
    transition: 'border-color .2s var(--ease-out), transform .2s var(--ease-out), box-shadow .2s var(--ease-out)'
  };

  const inner = (
    <>
      <span
        aria-hidden="true"
        style={{
          width: '36px', height: '36px', flexShrink: 0, borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent
        }}
      >
        <Icon size={18} />
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, lineHeight: 1.25 }}>
          {label}
        </span>
        {sub && (
          <span style={{
            display: 'block', fontSize: '0.74rem', color: 'var(--text-subtle)',
            marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {sub}
          </span>
        )}
      </span>
    </>
  );

  const hover = {
    onMouseEnter: (e) => {
      e.currentTarget.style.borderColor = `color-mix(in srgb, ${accent} 45%, transparent)`;
      e.currentTarget.style.transform = 'translate3d(0,-2px,0)';
      e.currentTarget.style.boxShadow = `0 10px 24px -14px color-mix(in srgb, ${accent} 75%, transparent)`;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.borderColor = 'var(--border-light)';
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={common} {...hover}>
        {inner}
      </a>
    );
  }
  return <button type="button" onClick={onClick} style={common} {...hover}>{inner}</button>;
}

/* --------------------------------------------------------------- map canvas */

/**
 * The iframe is not mounted until the card is close to the viewport. A Google
 * Maps embed pulls roughly a megabyte of tiles and script and sets third-party
 * cookies, none of which should happen for a visitor who never scrolls this far
 * down the contact page.
 */
function useNearViewport(ref) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ref, near]);

  return near;
}

/* ---------------------------------------------------------------- component */

export default function LocationMapCard() {
  const [layer, setLayer] = useState('map');
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const shellRef = useRef(null);
  const near = useNearViewport(shellRef);

  // Switching layers swaps the iframe src, so the skeleton comes back until the
  // new tiles paint. Without this the card looks frozen on a stale layer.
  useEffect(() => { setLoaded(false); }, [layer]);

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS.full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard is blocked on insecure origins and in some embedded webviews.
      // Selecting the text is the honest fallback — better than a silent no-op.
      const sel = window.getSelection?.();
      const node = document.getElementById('platinaa-address-text');
      if (sel && node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, []);

  const mapHeight = expanded ? 'clamp(460px, 70vh, 760px)' : 'clamp(300px, 42vh, 420px)';

  return (
    <div
      ref={shellRef}
      className="glass-card"
      style={{
        background: 'var(--bg-main)', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden'
      }}
    >
      {/* ---------------------------------------------------------- header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
        padding: '18px 20px', borderBottom: '1px solid var(--border-light)',
        background: 'var(--surface-card)'
      }}>
        <span
          aria-hidden="true"
          style={{
            width: '42px', height: '42px', flexShrink: 0, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--primary-red-light)', color: 'var(--brand-red)'
          }}
        >
          <Factory size={21} />
        </span>

        <div style={{ minWidth: '180px', flex: '1 1 auto' }}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--text-subtle)'
          }}>
            Works &amp; Registered Office
          </div>
          <div style={{
            fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-bright)', marginTop: '3px'
          }}>
            {companyInfo.legalName}
          </div>
        </div>

        {/* Layer switch */}
        <div
          role="group" aria-label="Map layer"
          style={{
            display: 'flex', gap: '4px', padding: '4px',
            background: 'var(--bg-main)', border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-full)'
          }}
        >
          {LAYERS.map(({ id, label, Icon }) => {
            const active = layer === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setLayer(id)}
                aria-pressed={active}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: 'var(--radius-full)',
                  border: 'none', cursor: 'pointer', font: 'inherit',
                  fontSize: '0.76rem', fontWeight: 700,
                  background: active ? 'var(--brand-red)' : 'transparent',
                  color: active ? 'var(--on-accent)' : 'var(--text-body)',
                  transition: 'background .2s var(--ease-out), color .2s var(--ease-out)'
                }}
              >
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------- map canvas */}
      <div style={{
        position: 'relative', height: mapHeight, background: 'var(--surface-card)',
        transition: 'height .35s var(--ease-out)'
      }}>
        {near ? (
          <iframe
            key={layer}
            title={`Map showing ${companyInfo.legalName}, ${ADDRESS.city}`}
            src={embedUrl(layer)}
            onLoad={() => setLoaded(true)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            style={{
              width: '100%', height: '100%', border: 0, display: 'block',
              opacity: loaded ? 1 : 0, transition: 'opacity .45s var(--ease-out)'
            }}
          />
        ) : null}

        {/* Skeleton — also the permanent state if the embed is blocked. */}
        {(!near || !loaded) && (
          <div
            style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '12px',
              color: 'var(--text-subtle)', pointerEvents: 'none'
            }}
          >
            <Loader2 size={22} className="animate-spin" aria-hidden="true" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em' }}>
              Loading map…
            </span>
          </div>
        )}

        {/* Expand control, floated over the tiles. */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Shrink map' : 'Enlarge map'}
          style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 2,
            width: '38px', height: '38px', borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-main)', border: '1px solid var(--border-light)',
            color: 'var(--text-bright)', cursor: 'pointer',
            boxShadow: '0 4px 14px color-mix(in srgb, var(--clay-900) 22%, transparent)'
          }}
        >
          {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>
      </div>

      {/* ---------------------------------------------------- address strip */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '13px',
        padding: '18px 20px', borderBottom: '1px solid var(--border-light)'
      }}>
        <MapPin size={19} style={{ color: 'var(--brand-red)', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <address
            id="platinaa-address-text"
            style={{
              fontStyle: 'normal', fontSize: '0.92rem', lineHeight: 1.65,
              color: 'var(--text-body)'
            }}
          >
            <strong style={{ color: 'var(--text-bright)' }}>{ADDRESS.street}</strong><br />
            {ADDRESS.locality}, {ADDRESS.city} Dist. — {ADDRESS.pincode}<br />
            {ADDRESS.state}, {ADDRESS.country}
          </address>
        </div>
        <button
          type="button"
          onClick={copyAddress}
          aria-label="Copy full address"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px', flexShrink: 0,
            padding: '9px 14px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
            font: 'inherit', fontSize: '0.76rem', fontWeight: 700,
            background: copied ? 'color-mix(in srgb, var(--accent-emerald) 15%, transparent)' : 'var(--surface-card)',
            border: `1px solid ${copied ? 'var(--accent-emerald)' : 'var(--border-light)'}`,
            color: copied ? 'var(--accent-emerald)' : 'var(--text-body)',
            transition: 'all .2s var(--ease-out)'
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* --------------------------------------------------------- actions */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '10px', padding: '18px 20px'
      }}>
        <ActionButton
          href={DIRECTIONS_URL}
          Icon={Navigation}
          label="Get directions"
          sub="Open turn-by-turn navigation"
          tone="primary"
        />
        <ActionButton
          href={CANONICAL_URL}
          Icon={ExternalLink}
          label="View on Google Maps"
          sub="Verified business listing"
        />
        <ActionButton
          href={`tel:${companyInfo.mobile.replace(/\s/g, '')}`}
          Icon={Phone}
          label="Call sales desk"
          sub={companyInfo.mobile}
        />
        <ActionButton
          href={`https://wa.me/${companyInfo.whatsapp.replace('+', '')}`}
          Icon={MessageCircle}
          label="WhatsApp"
          sub="Send drawings and conditions"
        />
        <ActionButton
          href={`mailto:${companyInfo.email}`}
          Icon={Mail}
          label="Email enquiries"
          sub={companyInfo.email}
        />
      </div>
    </div>
  );
}
