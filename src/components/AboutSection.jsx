import React from 'react';
import { companyInfo } from '../data/companyInfo';
import { ShieldCheck, Award, Microscope, Globe2, Building2, CheckCircle2, FileCheck } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" style={{ padding: '80px 0', background: 'var(--bg-main)', borderTop: '1px solid var(--border-light)' }}>
      <div className="container-custom">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'center' }}>
          
          {/* Left Text Column */}
          <div style={{ gridColumn: 'span 7' }}>
            <div className="badge-red" style={{ marginBottom: '12px' }}>
              <Building2 size={14} /> ABOUT Platinaa Ceramics
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--text-bright)', marginBottom: '20px', lineHeight: 1.2 }}>
              Pioneering High-Performance <br />
              <span className="text-gradient-red">Industrial Ceramics Since Inception</span>
            </h2>

            <div style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
              {companyInfo.aboutText.map((p, idx) => (
                <p key={idx} style={{ marginBottom: '14px' }}>{p}</p>
              ))}
            </div>

            {/* Core Values grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '32px' }}>
              
              <div style={{ background: 'var(--surface-card)', padding: '18px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(1, 20, 49, 0.03)' }}>
                <Microscope size={22} style={{ color: 'var(--primary-red)', marginBottom: '8px' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '4px' }}>
                  Microstructural R&D Laboratory
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                  State-of-the-art sintering furnaces & laser particle size analyzer for 100% batch quality assurance.
                </p>
              </div>

              <div style={{ background: 'var(--surface-card)', padding: '18px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(1, 20, 49, 0.03)' }}>
                <Globe2 size={22} style={{ color: 'var(--accent-blue)', marginBottom: '8px' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '4px' }}>
                  Pan-India & Export Logistics
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                  Headquartered in Erode & Namakkal, Tamil Nadu, supplying paint & ink leaders across India and overseas.
                </p>
              </div>

            </div>

          </div>

          {/* Right ISO Quality Policy Showcase Card */}
          <div style={{ gridColumn: 'span 5' }}>
            <div className="glass-card" style={{ padding: '32px', border: '1px solid var(--border-glow)', background: 'var(--surface-card)' }}>
              
              {/* ISO Emblem */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-emerald) 0%, var(--accent-emerald) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--surface-card)',
                  boxShadow: '0 4px 16px rgba(47, 107, 79, 0.3)'
                }}>
                  <ShieldCheck size={32} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                    ISO 9001:2015
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    Certified Quality Management System
                  </div>
                </div>
              </div>

              {/* Quality Policy Quote */}
              <blockquote style={{
                fontSize: '0.92rem',
                color: 'var(--text-bright)',
                fontStyle: 'italic',
                lineHeight: 1.6,
                marginBottom: '20px',
                borderLeft: '3px solid var(--primary-red)',
                paddingLeft: '14px'
              }}>
                "{companyInfo.certifications[0].policy}"
              </blockquote>

              {/* Quality Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--primary-red)' }} />
                  <span>100% Crushing Load & Density Inspection per Batch</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--primary-red)' }} />
                  <span>Zero Heavy Metal & Iron Contamination Assurance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--primary-red)' }} />
                  <span>Batch Certification & Technical Data Sheets</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
