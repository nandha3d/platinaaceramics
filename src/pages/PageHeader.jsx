import React from 'react';

/** Masthead for every interior page. Keeps the h1 in one place so each route has
 *  exactly one, which the old single-page build could not guarantee. */
export default function PageHeader({ eyebrow, title, lede }) {
  return (
    <header style={{ background: 'var(--clay-800)', color: 'var(--text-invert)', padding: '64px 0 56px' }}>
      <div className="container-custom">
        {eyebrow && (
          <div style={{
            display: 'inline-block', background: 'var(--brand-red)', color: 'var(--on-accent)',
            padding: '5px 13px', borderRadius: '3px', fontSize: '0.64rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
          }}>{eyebrow}</div>
        )}
        <h1 className="headline-print" style={{
          fontSize: 'clamp(1.9rem, 4.2vw, 3rem)', color: 'var(--on-accent)', marginBottom: lede ? '14px' : 0
        }}>{title}</h1>
        {lede && (
          <p style={{
            maxWidth: '62ch', fontSize: '1rem', lineHeight: 1.65,
            color: 'color-mix(in srgb, var(--text-invert) 80%, transparent)'
          }}>{lede}</p>
        )}
      </div>
    </header>
  );
}
