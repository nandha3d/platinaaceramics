import React, { useState } from 'react';
import { companyInfo } from '../data/companyInfo';
import { products } from '../data/products';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

/**
 * Contact channels, styled as datasheet rows rather than generic cards.
 *
 * The previous version — pastel circle, big radius, soft tinted panel — is the
 * default shape every component library produces, and it sat oddly against the
 * technical language the rest of this site uses (mono labels, hairline rules,
 * spec tables). This is squared off, indexed 01/02/03 like a parts list, and
 * leads with a solid accent mark instead of a pastel blob.
 *
 * `hue` comes in as a palette token, not a literal, so the three channels stay
 * distinguishable from each other AND follow the active theme.
 */
function ContactCard({ Icon, hue, index, eyebrow, title, href, lines = [], accentFirstLine = false }) {
  const body = (
    <>
      <span className="contact-mark" aria-hidden="true">
        <Icon size={26} strokeWidth={1.9} />
      </span>
      <span className="contact-body">
        <span className="contact-eyebrow">{eyebrow}</span>
        <span className="contact-title">{title}</span>
        {lines.map((line, i) => (
          <span
            key={line}
            className={accentFirstLine && i === 0 ? 'contact-line contact-line--ok' : 'contact-line'}
          >
            {line}
          </span>
        ))}
      </span>
      <span className="contact-index" aria-hidden="true">{index}</span>
    </>
  );

  const style = { '--tile-hue': hue };
  return href
    ? <a className="contact-card" href={href} style={style}>{body}</a>
    : <div className="contact-card" style={style}>{body}</div>;
}

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
              
              <ContactCard
                Icon={Phone}
                hue="var(--cat-1)"
                index="01"
                eyebrow="Call / WhatsApp sales desk"
                title={companyInfo.mobile}
                href={`tel:${companyInfo.mobile.replace(/\s/g, '')}`}
                lines={[`Landline: ${companyInfo.phone}`]}
              />

              <ContactCard
                Icon={Mail}
                hue="var(--cat-3)"
                index="02"
                eyebrow="Official email enquiries"
                title={companyInfo.email}
                href={`mailto:${companyInfo.email}`}
                lines={['Fast response within 2 business hours']}
                accentFirstLine
              />

              <ContactCard
                Icon={MapPin}
                hue="var(--cat-2)"
                index="03"
                eyebrow="Corporate office & works"
                title={companyInfo.name}
                lines={[companyInfo.address.full]}
              />

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
                  background: 'color-mix(in srgb, var(--accent-emerald) 9%, transparent)',
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
