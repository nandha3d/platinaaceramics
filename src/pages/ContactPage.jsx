import React from 'react';
import PageHeader from './PageHeader';
import ContactSection from '../components/ContactSection';
import LocationMapCard from '../components/LocationMapCard';

export default function ContactPage({ rfqProduct, onCloseRfq }) {
  return (
    <>
      <PageHeader
        eyebrow="Request a Quotation"
        title="Contact & RFQ"
        lede="Send the reactor drawing and operating conditions and we will prepare the layer-by-layer grading schedule with delivered tonnage."
      />
      <ContactSection rfqProduct={rfqProduct} onCloseRfq={onCloseRfq} />

      {/* Buyers who have already decided to visit or ship are looking for the
          works, not the form — so the map is its own block below the RFQ rather
          than a thumbnail wedged into the contact cards. */}
      <section style={{ padding: '0 0 80px', background: 'var(--surface-card)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)', fontWeight: 800,
              color: 'var(--text-bright)', marginBottom: '10px'
            }}>
              Find our works in Erode
            </h2>
            <p style={{
              color: 'var(--text-body)', maxWidth: '620px', margin: '0 auto', fontSize: '0.98rem'
            }}>
              Plant visits and sample collection are welcome by prior appointment.
            </p>
          </div>
          <LocationMapCard />
        </div>
      </section>
    </>
  );
}
