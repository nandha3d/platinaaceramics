import React from 'react';
import PageHeader from './PageHeader';
import ProductsSection from '../components/ProductsSection';

export default function ProductsPage(props) {
  return (
    <>
      <PageHeader
        eyebrow="Complete Range"
        title="Inert Ceramic Media & Bed Support"
        lede="Inert alumina ceramic balls from 17% to 99% Al₂O₃, graded catalyst bed support media, ceramic tower packing, adsorbents and guard beds."
      />
      <ProductsSection {...props} />
    </>
  );
}
