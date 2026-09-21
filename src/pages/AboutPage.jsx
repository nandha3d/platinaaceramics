import React from 'react';
import { useSeo } from '../hooks/useSeo';
import { seoFor } from '../lib/routeMeta';
import PageHeader from './PageHeader';
import AboutSection from '../components/AboutSection';

export default function AboutPage() {
  useSeo(seoFor("/about"));

  return (
    <>
      <PageHeader
        eyebrow="The Company"
        title="About Platinaa Industrial Ceramics"
        lede="Manufacturing inert alumina ceramic balls and catalyst bed support media at Erode, Tamil Nadu, to HG/T 3683.1-2014 with batch certification on every consignment."
      />
      <AboutSection />
    </>
  );
}
