import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from './PageHeader';

export default function NotFoundPage() {
  return (
    <>
      <PageHeader eyebrow="404" title="Page not found" lede="That address does not match anything on this site." />
      <div className="container-custom" style={{ padding: '56px 24px 96px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to home
        </Link>
        <Link to="/products" className="btn-secondary" style={{ textDecoration: 'none' }}>
          Browse the catalogue
        </Link>
      </div>
    </>
  );
}
