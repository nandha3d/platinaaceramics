import React, { useState } from 'react';
import { industries } from '../data/industries';
import { Factory, Fuel, FlaskConical, Wheat, Flame, Atom, Recycle, Wind, Leaf, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';

export default function IndustriesSection({ onSelectIndustryFilter }) {
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0]);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Fuel': return <Fuel size={22} />;
      case 'FlaskConical': return <FlaskConical size={22} />;
      case 'Wheat': return <Wheat size={22} />;
      case 'Flame': return <Flame size={22} />;
      case 'Atom': return <Atom size={22} />;
      case 'Recycle': return <Recycle size={22} />;
      case 'Wind': return <Wind size={22} />;
      case 'Leaf': return <Leaf size={22} />;
      case 'Droplets': return <Droplets size={22} />;
      default: return <Factory size={22} />;
    }
  };

  return (
    <section id="industries" style={{ padding: '80px 0', background: 'var(--bg-main)', position: 'relative', borderTop: '1px solid var(--border-light)' }}>
      <div className="container-custom">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="badge-red" style={{ marginBottom: '12px' }}>
            <Factory size={14} /> SECTORS SERVED
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--text-bright)', marginBottom: '16px' }}>
            Industries We Serve
          </h2>
          <p style={{ color: 'var(--text-body)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
            Inert support media, tower packing, adsorbents and guard beds specified against the duty of each vessel.
          </p>
        </div>

        {/* Industry Selector Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
          
          {/* Left Column: List of 9 Industries */}
          <div style={{ gridColumn: 'span 5' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {industries.map((ind) => {
                const isActive = selectedIndustry.id === ind.id;
                return (
                  <div
                    key={ind.id}
                    onClick={() => setSelectedIndustry(ind)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--primary-red-light)' : 'var(--surface-card)',
                      border: isActive ? '1px solid var(--primary-red)' : '1px solid var(--border-light)',
                      color: 'var(--text-bright)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      boxShadow: '0 2px 8px color-mix(in srgb, var(--clay-800) 3%, transparent)',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <div style={{
                      color: isActive ? 'var(--primary-red)' : 'var(--text-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getIcon(ind.iconName)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: isActive ? 700 : 600, fontSize: '0.95rem' }}>
                        {ind.title}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                        {ind.shortDesc}
                      </div>
                    </div>

                    <ArrowRight size={16} style={{ color: isActive ? 'var(--primary-red)' : 'transparent' }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Active Industry Panel */}
          <div style={{ gridColumn: 'span 7' }}>
            <div className="glass-card" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--surface-card)' }}>
              
              <div>
                {/* Industry Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-red-light)',
                    color: 'var(--primary-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getIcon(selectedIndustry.iconName)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                      {selectedIndustry.title}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary-red)', fontWeight: 700 }}>
                      Industrial Solution Profile
                    </span>
                  </div>
                </div>

                {/* Main Paragraph */}
                <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
                  {selectedIndustry.description}
                </p>

                {/* Key Benefits List */}
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '14px' }}>
                  Technical Benefits Delivered
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '32px' }}>
                  {selectedIndustry.keyBenefits.map((benefit, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-bright)' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', shrink: 0, marginTop: '2px' }} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Product Grades */}
              <div style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                  Recommended Media Grades for {selectedIndustry.title}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedIndustry.recommendedProducts.map((prodName, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'var(--surface-card)',
                        border: '1px solid color-mix(in srgb, var(--clay-600) 25%, transparent)',
                        color: 'var(--text-bright)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 6px color-mix(in srgb, var(--clay-800) 3%, transparent)'
                      }}
                    >
                      {prodName}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
