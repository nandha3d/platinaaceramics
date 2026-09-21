import React, { useEffect, useState, useCallback } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { PALETTES } from '../data/palettes';

/**
 * TEMPORARY palette picker for client sign-off.
 *
 * Every component reads its colours from the design tokens, so switching is one
 * attribute on <html> — no component re-renders or knows this exists. The choice
 * persists per browser only; it is not shared and never reaches the server.
 *
 * To remove once a palette is agreed: copy the winning block from palettes.css
 * into the :root of index.css, then delete palettes.css, src/data/palettes.js,
 * this file, and its mount in App.jsx.
 */
const STORAGE_KEY = 'platinaa-palette';
const DEFAULT = 'platinaa';

function applyPalette(key) {
  document.documentElement.setAttribute('data-palette', key);
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(DEFAULT);

  // Storage can throw in private mode or when site data is blocked, and a
  // colour preference is never worth taking the page down for.
  useEffect(() => {
    let saved = DEFAULT;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY) || DEFAULT;
    } catch { /* fall through to the default */ }
    if (!PALETTES.some((p) => p.key === saved)) saved = DEFAULT;
    setActive(saved);
    applyPalette(saved);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const choose = useCallback((key) => {
    setActive(key);
    applyPalette(key);
    try { window.localStorage.setItem(STORAGE_KEY, key); } catch { /* not critical */ }
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Choose colour theme"
        style={{
          position: 'fixed', right: '20px', bottom: '20px', zIndex: 1200,
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'var(--clay-800)', color: 'var(--text-invert)',
          border: '2px solid var(--brand-red)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 26px rgba(0,0,0,0.28)'
        }}
      >
        {open ? <X size={21} aria-hidden="true" /> : <Palette size={21} aria-hidden="true" />}
        <span className="sr-only">{open ? 'Close colour theme picker' : 'Open colour theme picker'}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Colour theme"
          className="anim-pop"
          style={{
            position: 'fixed', right: '20px', bottom: '84px', zIndex: 1200,
            width: 'min(320px, calc(100vw - 40px))',
            maxHeight: 'min(70vh, 560px)', overflowY: 'auto',
            background: 'var(--surface-card)', borderRadius: '14px',
            border: '1px solid var(--border-mid)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.30)', padding: '16px'
          }}
        >
          <div style={{ marginBottom: '4px', fontWeight: 700, color: 'var(--text-bright)', fontSize: '0.95rem' }}>
            Colour theme
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', marginBottom: '14px', lineHeight: 1.45 }}>
            Preview only, saved to this browser. All {PALETTES.length} pass WCAG AA contrast.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {PALETTES.map((p) => {
              const on = p.key === active;
              return (
                <button
                  key={p.key}
                  onClick={() => choose(p.key)}
                  aria-pressed={on}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '11px',
                    padding: '9px 11px', borderRadius: '9px', cursor: 'pointer',
                    minHeight: '44px', width: '100%', textAlign: 'left',
                    fontFamily: 'inherit',
                    background: on ? 'var(--bg-surface-2)' : 'transparent',
                    border: `1px solid ${on ? 'var(--brand-red)' : 'var(--border-light)'}`
                  }}
                >
                  <span style={{ display: 'flex', flexShrink: 0, borderRadius: '5px', overflow: 'hidden' }}>
                    <span style={{ width: '20px', height: '26px', background: p.deep }} />
                    <span style={{ width: '20px', height: '26px', background: p.accent }} />
                    <span style={{ width: '20px', height: '26px', background: p.surface }} />
                  </span>
                  <span style={{ flex: 1, fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                    {p.label}
                  </span>
                  {on && <Check size={16} style={{ color: 'var(--brand-red)', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
