import React from 'react';
import { useSeo } from '../hooks/useSeo';
import { seoFor } from '../lib/routeMeta';
import PageHeader from './PageHeader';
import IndustriesSection from '../components/IndustriesSection';

export default function IndustriesPage() {
  useSeo(seoFor("/industries"));

  return (
    <>
      <PageHeader
        eyebrow="Sectors Served"
        title="Industries We Supply"
        lede="Refining, petrochemical, fertilizer and gas processing operators specifying inert media against reactor drawings and operating conditions."
      />
      <IndustriesSection />
    </>
  );
}
