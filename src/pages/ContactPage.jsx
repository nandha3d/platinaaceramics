import React from 'react';
import PageHeader from './PageHeader';
import ContactSection from '../components/ContactSection';

export default function ContactPage({ rfqProduct, onCloseRfq }) {
  return (
    <>
      <PageHeader
        eyebrow="Request a Quotation"
        title="Contact & RFQ"
        lede="Send the reactor drawing and operating conditions and we will prepare the layer-by-layer grading schedule with delivered tonnage."
      />
      <ContactSection rfqProduct={rfqProduct} onCloseRfq={onCloseRfq} />
    </>
  );
}
