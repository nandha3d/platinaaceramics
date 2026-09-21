import React, { useRef } from 'react';
import { useSeo } from '../hooks/useSeo';
import { seoFor } from '../lib/routeMeta';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FullWidth3DSliderHero from '../components/FullWidth3DSliderHero';
import ProductsSection from '../components/ProductsSection';
import CompanyIntro from '../components/CompanyIntro';
import ClientsStrip from '../components/ClientsStrip';
import { useReveal } from '../hooks/useReveal';

/** Home leads with the 3D bed, then who we are, then a trimmed catalogue that
 *  links onward to the full /products page rather than duplicating it. */
export default function HomePage(props) {
  useSeo(seoFor("/"));

  const pageRef = useRef(null);

  // The intro cards carry .reveal, which is opacity:0 until observed. Without
  // this they would never appear.
  useReveal(pageRef, []);

  return (
    <div ref={pageRef}>
      <FullWidth3DSliderHero />
      <CompanyIntro />
      <ClientsStrip />
      <ProductsSection {...props} limit={6} heading="Featured Media" />
      <div className="container-custom" style={{ padding: '0 24px 72px', textAlign: 'center' }}>
        <Link to="/products" className="btn-primary" style={{ textDecoration: 'none' }}>
          View the full catalogue <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
