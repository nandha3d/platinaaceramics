import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { buildSpecSheet } from '../data/specSheets';
import ProductSheet from './ProductSheet';
import { useReveal } from '../hooks/useReveal';

/**
 * Dialog shell only. All datasheet content lives in <ProductSheet>, which the
 * standalone /products/:id page renders too — one source, no drift.
 */
export default function ProductDetailModal({ product, onClose, openRfqModal }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    // The page behind must not scroll while a modal is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useReveal(panelRef, [product?.id], panelRef);

  if (!product) return null;
  const sheet = buildSpecSheet(product);

  return (
    <div
      className="anim-fade"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, background: 'color-mix(in srgb, var(--clay-900) 74%, transparent)',
        backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '20px'
      }}
    >
      <div
        ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true"
        aria-label={`Technical specification sheet — ${product.name}`}
        className="anim-pop"
        style={{
          background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', width: '100%',
          maxWidth: '1060px', maxHeight: '93vh', overflowY: 'auto', position: 'relative',
          boxShadow: '0 25px 70px color-mix(in srgb, var(--clay-900) 45%, transparent)'
        }}
      >
        {/*
          The panel itself is the scroll container, so an absolutely positioned
          close button scrolls away with the content and forces a trip back to
          the top to dismiss. A zero-height sticky strip pins the button to the
          panel's top-right instead. height:0 keeps it out of the flow so no
          content is pushed down or covered, and pointer-events are re-enabled
          only on the button so the strip never swallows clicks on the sheet.
        */}
        <div
          style={{
            position: 'sticky', top: 0, height: 0, zIndex: 30,
            display: 'flex', justifyContent: 'flex-end', pointerEvents: 'none'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close specification sheet"
            style={{
              pointerEvents: 'auto', margin: '18px 18px 0 0',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-light)', color: 'var(--text-bright)', width: '44px',
              height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 6px 20px color-mix(in srgb, var(--clay-900) 35%, transparent)'
            }}
          >
            <X size={20} aria-hidden="true" />
            <span className="sr-only">Close specification sheet</span>
          </button>
        </div>

        <ProductSheet product={product} sheet={sheet} openRfqModal={openRfqModal} />
      </div>
    </div>
  );
}
