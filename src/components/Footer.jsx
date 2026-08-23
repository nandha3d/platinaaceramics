import React from 'react';
import { Link } from 'react-router-dom';
import { companyInfo } from '../data/companyInfo';
import { ShieldCheck, Phone, Mail, MapPin, Download, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer({ openCalculator, openRfqModal }) {
  return (
    <footer style={{
      background: 'var(--bg-main)',
      borderTop: '1px solid var(--border-light)',
      color: 'var(--text-body)',
      paddingTop: '60px',
      paddingBottom: '30px',
      fontSize: '0.88rem'
    }}>
      <div className="container-custom">
        
        {/* Top Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', marginBottom: '48px' }}>
          
          {/* Col 1: Brand Info */}
          <div style={{ gridColumn: 'span 4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src={`${import.meta.env.BASE_URL}logo-mark.png`}
                alt="Platinaa Ceramics"
                width={40}
                height={40}
                style={{ width: '40px', height: '40px', objectFit: 'contain', display: 'block', flexShrink: 0 }}
              />

              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-bright)', lineHeight: 1.1 }}>
                  Platinaa Ceramics
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px', fontSize: '0.85rem' }}>
              Manufacturer of inert alumina ceramic balls and catalyst bed support media for refining, petrochemical, fertilizer and gas processing. Full alumina range from 17% to 99% Al₂O₃, to HG/T 3683.1-2014.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontSize: '0.78rem', fontWeight: 700 }}>
              <ShieldCheck size={16} /> ISO 9001 Quality Management System
            </div>
          </div>

          {/* Col 2: Navigation Sitemap */}
          <div style={{ gridColumn: 'span 2' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link></li>
              <li><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Product Catalogue</Link></li>
              <li><Link to="/industries" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Industries Served</Link></li>
              <li><Link to="/calculator" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Bed Volume Calculator</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact & RFQ</Link></li>
            </ul>
          </div>

          {/* Col 3: Product Portfolio */}
          <div style={{ gridColumn: 'span 3' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Product Portfolio
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <li><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>High-Purity Inert Alumina Balls — 99%</Link></li>
              <li><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>High-Alumina Inert Balls — 92%</Link></li>
              <li><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Inert Alumina Ceramic Balls — 17–23%</Link></li>
              <li><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Catalyst Bed Support Balls</Link></li>
              <li><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Ceramic Tower Packing</Link></li>
              <li><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Activated Alumina & Molecular Sieves</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Factory Location */}
          <div style={{ gridColumn: 'span 3' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Head Office & Works
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} style={{ color: 'var(--primary-red)', shrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'var(--text-muted)' }}>{companyInfo.address.full}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} style={{ color: 'var(--primary-red)', shrink: 0 }} />
                <span style={{ color: 'var(--text-muted)' }}>{companyInfo.mobile} / {companyInfo.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: 'var(--primary-red)', shrink: 0 }} />
                <span style={{ color: 'var(--text-muted)' }}>{companyInfo.email}</span>
              </div>

              <button
                onClick={() => openRfqModal()}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: '8px', justifyContent: 'center' }}
              >
                Request Datasheet & Quote <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.78rem',
          color: 'var(--text-subtle)'
        }}>
          <div>
            Copyright © {new Date().getFullYear()} Platinaa Ceramics All Rights Reserved.
          </div>

          <div style={{ display: 'flex', gap: '18px' }}>
            <span>Privacy Policy</span>
            <span>Quality Certification</span>
            <span>Terms of Supply</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
