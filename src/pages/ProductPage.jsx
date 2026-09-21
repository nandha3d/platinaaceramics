import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { products } from '../data/products';
import { buildSpecSheet } from '../data/specSheets';
import ProductSheet from '../components/ProductSheet';
import { useReveal } from '../hooks/useReveal';
import NotFoundPage from './NotFoundPage';
import { applySeo, breadcrumbs, SITE_URL } from '../lib/seo';

/**
 * Standalone page per grade — the shareable, indexable counterpart to the modal.
 * Both render the same <ProductSheet>, so the two can never drift apart.
 */
export default function ProductPage({ openRfqModal, toggleCompare, compareList }) {
  const { productId } = useParams();
  const pageRef = useRef(null);
  const product = products.find((p) => p.id === productId);

  /*
   * Full head metadata plus Product structured data.
   *
   * This used to set only title and description by hand. Everything else —
   * canonical, Open Graph, the noindex guard on non-production hosts — now comes
   * from the shared helper, so a product URL shared in a message or indexed by a
   * crawler carries the same information the rest of the site does. The Product
   * schema is what lets a result show the grade and alumina content directly.
   */
  useEffect(() => {
    if (!product) return undefined;
    return applySeo({
      title: `${product.name} — Technical Datasheet | Platinaa Ceramics`,
      description: product.shortDesc,
      path: `/products/${product.id}`,
      image: product.image,
      type: 'product',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Product',
            name: product.name,
            description: product.shortDesc,
            image: product.image ? `${SITE_URL}/${String(product.image).replace(/^\//, '')}` : undefined,
            category: product.category,
            material: 'Alumina (Al2O3)',
            brand: { '@type': 'Organization', name: 'Platinaa Industrial Ceramics Pvt Ltd' },
            manufacturer: { '@type': 'Organization', name: 'Platinaa Industrial Ceramics Pvt Ltd' },
            additionalProperty: [
              product.grade && { '@type': 'PropertyValue', name: 'Grade', value: product.grade },
              product.density && { '@type': 'PropertyValue', name: 'Density', value: product.density },
              product.acidResistance && { '@type': 'PropertyValue', name: 'Acid resistance', value: product.acidResistance }
            ].filter(Boolean)
          },
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: product.name, path: `/products/${product.id}` }
          ])
        ]
      }
    });
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
