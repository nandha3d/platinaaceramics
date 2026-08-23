import React from 'react';
import PageHeader from './PageHeader';
import SpecCalculator from '../components/SpecCalculator';

export default function CalculatorPage({ openRfqModal }) {
  return (
    <>
      <PageHeader
        eyebrow="Bed Volume Tool"
        title="Spec & Fill Calculator"
        lede="Enter the vessel internal diameter and layer depth to get bed volume and delivered tonnage at the packed bulk density of the grade selected."
      />
      <SpecCalculator openRfqModal={openRfqModal} />
    </>
  );
}
