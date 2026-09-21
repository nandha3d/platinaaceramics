import React from 'react';
import { useSeo } from '../hooks/useSeo';
import { seoFor } from '../lib/routeMeta';
import ProductsHero from '../components/ProductsHero';
import ProductsSection from '../components/ProductsSection';

export default function ProductsPage(props) {
  useSeo(seoFor('/products'));

  return (
    <>
      {/* The image hero replaces the plain PageHeader on this route; it carries
          the same eyebrow, title and lede, so nothing is lost. */}
      <ProductsHero />
      <div id="catalogue">
        <ProductsSection {...props} />
      </div>
    </>
  );
}
