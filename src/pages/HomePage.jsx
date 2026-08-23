import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FullWidth3DSliderHero from '../components/FullWidth3DSliderHero';
import ProductsSection from '../components/ProductsSection';

/** Home leads with the 3D bed, then a trimmed catalogue that links onward to the
 *  full /products page rather than duplicating it. */
export default function HomePage(props) {
  return (
    <>
      <FullWidth3DSliderHero />
      <ProductsSection {...props} limit={6} heading="Featured Media" />
      <div className="container-custom" style={{ padding: '0 24px 72px', textAlign: 'center' }}>
        <Link to="/products" className="btn-primary" style={{ textDecoration: 'none' }}>
          View the full catalogue <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
