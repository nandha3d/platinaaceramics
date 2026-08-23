import React, { useState } from 'react';
import { companyInfo } from '../data/companyInfo';
import { products } from '../data/products';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactSection({ rfqProduct, onCloseRfq }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: rfqProduct ? rfqProduct.mediaName || rfqProduct.name : 'Inert Alumina Ceramic Balls — 17–23% Al₂O₃',
    quantityKg: rfqProduct && rfqProduct.requiredWeightKg ? rfqProduct.requiredWeightKg : '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // WhatsApp direct link trigger
    const text = `*New Quote Request via Website*%0AName: ${formState.name}%0ACompany: ${formState.company}%0AEmail: ${formState.email}%0APhone: ${formState.phone}%0AProduct: ${formState.product}%0AEst Quantity: ${formState.quantityKg} KG%0AMessage: ${formState.message}`;
    setTimeout(() => {
      window.open(`https://wa.me/${companyInfo.whatsapp.replace('+', '')}?text=${text}`, '_blank');
    }, 800);
  };

  return (
    <section id="contact" style={{ padding: '80px 0', background: 'var(--surface-card)', position: 'relative', borderTop: '1px solid var(--border-light)' }}>
      <div className="container-custom">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="badge-red" style={{ marginBottom: '12px' }}>
            <Mail size={14} /> DIRECT FACTORY INQUIRIES
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--text-bright)', marginBottom: '16px' }}>
            Get Free Consulting & Bulk Quotation
          </h2>
          <p style={{ color: 'var(--text-body)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
            Connect directly with our sales engineering team in Tamil Nadu for pricing, technical datasheets, and sample dispatches.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
          
          {/* Left Contact Info Cards */}
          <div style={{ gridColumn: 'span 5' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Phone Card */}
              <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'var(--bg-main)' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-red-light)',
                  color: 'var(--primary-red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shrink: 0
                }}>
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Call / WhatsApp Sales Desk
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-bright)', margin: '4px 0' }}>
                    {companyInfo.mobile}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-body)' }}>
                    Landline: {companyInfo.phone}
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'var(--bg-main)' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(65, 86, 110, 0.12)',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shrink: 0
                }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Official Email Enquiries
                  </div>
                  <a href={`mailto:${companyInfo.email}`} style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-bright)', textDecoration: 'none', display: 'block', margin: '4px 0' }}>
                    {companyInfo.email}
                  </a>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    Fast response within 2 business hours
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'var(--bg-main)' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(2, 35, 86, 0.12)',
                  color: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shrink: 0
                }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Corporate Office & Works
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-bright)', margin: '4px 0', lineHeight: 1.5 }}>
                    {companyInfo.name}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                    {companyInfo.address.full}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right RFQ Form Panel */}
          <div style={{ gridColumn: 'span 7' }}>
            <div className="glass-card" style={{ padding: '36px', border: '1px solid var(--border-glow)', background: 'var(--surface-card)' }}>
              
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-bright)', marginBottom: '8px' }}>
                Request RFQ & Pricing Datasheet
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', marginBottom: '24px' }}>
                Fill out the form below to receive competitive bulk pricing for your ceramic media requirement.
              </p>

              {submitted ? (
                <div style={{
                  background: 'rgba(47, 107, 79, 0.08)',
                  border: '1px solid var(--accent-emerald)',
                  padding: '32px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  color: 'var(--text-bright)'
                }}>
                  <CheckCircle2 size={48} style={{ color: 'var(--accent-emerald)', marginBottom: '12px' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Quotation Request Generated!</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>
                    Your request has been prepared. Opening WhatsApp sales chat to connect with our technical engineers...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)', display: 'block', marginBottom: '6px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-bright)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)', display: 'block', marginBottom: '6px' }}>
                        Company / Enterprise Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Acme Chemical Pvt Ltd"
                        value={formState.company}
                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-bright)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)', display: 'block', marginBottom: '6px' }}>
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-bright)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)', display: 'block', marginBottom: '6px' }}>
                        Phone / Mobile *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-bright)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)', display: 'block', marginBottom: '6px' }}>
                        Select Product Media Grade
                      </label>
                      <select
                        value={formState.product}
                        onChange={(e) => setFormState({ ...formState, product: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-bright)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none', cursor: 'pointer' }}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.name}>{p.name} ({p.density})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)', display: 'block', marginBottom: '6px' }}>
                        Estimated Quantity (KG)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 500 KG"
                        value={formState.quantityKg}
                        onChange={(e) => setFormState({ ...formState, quantityKg: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-bright)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)', display: 'block', marginBottom: '6px' }}>
                      Additional Technical Notes / Slurry Viscosity Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Reactor / vessel ID, bed depth, operating temperature and pressure, required layer sizes and quantity..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-bright)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '0.95rem', justifyContent: 'center', marginTop: '8px' }}>
                    Submit RFQ & Chat on WhatsApp <Send size={16} />
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
