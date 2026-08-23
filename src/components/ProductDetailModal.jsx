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
        position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(1, 13, 32, 0.74)',
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
          boxShadow: '0 25px 70px rgba(1, 13, 32, 0.45)'
        }}
      >
        <button
          onClick={onClose} aria-label="Close specification sheet"
          style={{
            position: 'absolute', top: '18px', right: '18px', background: 'var(--surface-card)',
            border: '1px solid var(--border-light)', color: 'var(--text-bright)', width: '44px',
            height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', zIndex: 20
          }}
        ><X size={20} /></button>

        <ProductSheet product={product} sheet={sheet} openRfqModal={openRfqModal} />
      </div>
    </div>
  );
}
