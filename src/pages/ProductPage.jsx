import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { products } from '../data/products';
import { buildSpecSheet } from '../data/specSheets';
import ProductSheet from '../components/ProductSheet';
import { useReveal } from '../hooks/useReveal';
import NotFoundPage from './NotFoundPage';

/**
 * Standalone page per grade — the shareable, indexable counterpart to the modal.
 * Both render the same <ProductSheet>, so the two can never drift apart.
 */
export default function ProductPage({ openRfqModal, toggleCompare, compareList }) {
  const { productId } = useParams();
  const pageRef = useRef(null);
  const product = products.find((p) => p.id === productId);

  // Per-page title and description. Without this every route would inherit the
  // one title from index.html, which defeats the point of separate pages.
  useEffect(() => {
    if (!product) return undefined;
    const prevTitle = document.title;
    document.title = `${product.name} | Platinaa Industrial Ceramics`;

    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta ? meta.getAttribute('content') : null;
    if (meta) meta.setAttribute('content', product.shortDesc);

    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute('content', prevDesc);
    };
  }, [product]);

  // Without this the sheet's .reveal-seq children stay at opacity 0 forever.
  useReveal(pageRef, [productId]);

  if (!product) return <NotFoundPage />;

  const sheet = buildSpecSheet(product);
  const isCompared = compareList?.some((p) => p.id === product.id);

  return (
    <div ref={pageRef} style={{ background: 'var(--bg-main)' }}>
      <div className="container-custom" style={{ padding: '20px 24px 0' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-subtle)',
            textDecoration: 'none', padding: '8px 0', minHeight: '40px'
          }}
        >
          <ArrowLeft size={15} /> All products
        </Link>
      </div>

      <div className="container-custom" style={{ padding: '8px 24px 64px' }}>
        <ProductSheet product={product} sheet={sheet} openRfqModal={openRfqModal} />

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '26px' }}>
          <button
            className={isCompared ? 'btn-primary' : 'btn-secondary'}
            onClick={() => toggleCompare(product)}
            aria-pressed={!!isCompared}
          >
            <Scale size={15} /> {isCompared ? 'In comparison' : 'Add to compare'}
          </button>
          <Link to="/products" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Browse other grades
          </Link>
        </div>
      </div>
    </div>
  );
}
