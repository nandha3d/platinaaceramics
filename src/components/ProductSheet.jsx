import React, { useState, useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import {
  X, Send, AlertTriangle, Shield, ShieldCheck, Thermometer, Gem,
  Atom, Factory, Recycle, FlaskConical, Leaf,
  Droplets, Weight, Gauge, Ruler, Flame, Layers, Maximize2, Grid3x3, BadgeCheck
} from 'lucide-react';
import { IDEAL_FOR, headlineStats, compositionBars, crushBars } from '../data/specSheets';

// Infographic treatment of the printed datasheet. Rendered by BOTH the modal
// and the standalone /products/:id page so the two can never drift apart.
// Infographic treatment of the printed datasheet. The print piece leads with
// icon-circle key features, a large temperature callout and an "ideal for" row,
// then carries the dense tables. Same order here: the visuals answer "is this
// the right grade?", the tables underneath answer "what exactly am I buying?".

const ICONS = {
  shield: Shield, shieldCheck: ShieldCheck, thermometer: Thermometer,
  gem: Gem, molecule: Atom, factory: Factory, recycle: Recycle,
  flask: FlaskConical, leaf: Leaf
};

/**
 * Icon and hue per property type. These hues are semantic -- they identify what
 * kind of property a tile shows -- so they stay fixed across palette variants
 * rather than tracking the brand accent, which would collapse them to one
 * colour and lose the distinction.
 */
const PROP_STYLE = [
  [/water|absorpt/i,          Droplets,    'var(--cat-3)'],
  [/porosity/i,               Layers,      'var(--cat-5)'],
  [/particle density|density/i, Weight,    'var(--cat-2)'],
  [/temp/i,                   Flame,       'var(--cat-1)'],
  [/round/i,                  Ruler,       'var(--cat-4)'],
  [/expansion/i,              Maximize2,   'var(--cat-3)'],
  [/conduct|thermal/i,        Thermometer, 'var(--cat-1)'],
  [/hardness/i,               Gem,         'var(--cat-3)'],
  [/acid|alkali|resist/i,     ShieldCheck, 'var(--cat-2)'],
  [/voidage/i,                Grid3x3,     'var(--cat-4)'],
  [/standard/i,               BadgeCheck,  'var(--cat-5)'],
];

function propStyle(label) {
  const hit = PROP_STYLE.find(([re]) => re.test(label));
  return hit ? { Icon: hit[1], hue: hit[2] } : { Icon: Gauge, hue: 'var(--cat-5)' };
}

/**
 * Tile labels are clipped to one line, so the long printed names are shortened
 * here rather than truncated with an ellipsis. The full name still appears in
 * the specification tables and on the tile's title attribute.
 */
const SHORT_LABEL = {
  'Particle Density (Material Piece Density)': 'Particle Density',
  'Thermal Expansion Coefficient': 'Thermal Expansion',
  'Spec. Thermal Energy': 'Specific Heat',
  'Thermal Conductivity': 'Thermal Conductivity',
  'Apparent Porosity': 'Apparent Porosity',
  'Roundness, dₘₐₓ/dₘᵢₙ': 'Roundness',
  'Compressive Strength': 'Compressive Strength',
  'Spalling Resistance': 'Spalling Resistance'
};

const FEATURE_HUES = ['var(--cat-3)', 'var(--cat-1)', 'var(--cat-2)', 'var(--cat-5)', 'var(--cat-1)', 'var(--cat-4)'];

const RULE = 'var(--border-light)';

// Composition bar segment colours — a navy-to-steel ramp, red reserved for the
// brand accent so it never reads as "one oxide is the important one".
// Composition bar segments. Stepped from the palette's own deep tone out to
// its lightest neutral via color-mix, so the ramp re-derives itself under every
// theme rather than being a fixed navy list.
const SEG = [
  'var(--clay-900)',
  'var(--clay-700)',
  'var(--clay-500)',
  'var(--clay-400)',
  'color-mix(in srgb, var(--clay-400) 62%, var(--surface-card))',
  'color-mix(in srgb, var(--clay-400) 38%, var(--surface-card))',
  'color-mix(in srgb, var(--clay-400) 20%, var(--surface-card))'
];

/* ------------------------------------------------------------------ */
function Pill({ children }) {
  return (
    <div style={{
      display: 'inline-block', background: 'var(--brand-red)', color: 'var(--on-accent)',
      padding: '8px 20px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem',
      fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase',
      boxShadow: '0 8px 20px -8px color-mix(in srgb, var(--brand-red) 70%, transparent)'
    }}>
      {children}
    </div>
  );
}

function SectionHead({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
      <Pill>{children}</Pill>
    </div>
  );
}

/** Icon in a filled circle, as on the print piece. */
function IconDisc({ Icon, tone = 'navy', size = 54 }) {
  const navy = tone === 'navy';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: navy ? 'var(--clay-800)' : 'var(--brand-red)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon size={size * 0.44} strokeWidth={1.7} style={{ color: 'var(--surface-card)' }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
const thStyle = {
  background: 'var(--brand-red)', color: 'var(--surface-card)', fontWeight: 700,
  fontSize: '0.68rem', letterSpacing: '0.09em', textTransform: 'uppercase',
  padding: '10px 12px', textAlign: 'left', whiteSpace: 'nowrap'
};
const tdStyle = {
  padding: '10px 12px', borderBottom: `1px solid ${RULE}`,
  color: 'var(--text-bright)', verticalAlign: 'top'
};
const numStyle = {
  ...tdStyle, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 500
};
const slStyle = {
  ...tdStyle, textAlign: 'center', width: '52px',
  fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)'
};
const inputStyle = {
  background: 'var(--bg-main)', border: `1px solid ${RULE}`, color: 'var(--text-bright)',
  padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem',
  minHeight: '44px', fontFamily: 'inherit'
};

function SectionTable({ title, children, minWidth = 320 }) {
  return (
    <div className="reveal" style={{
      border: `1px solid ${RULE}`, borderRadius: '8px', overflow: 'hidden',
      background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        background: 'var(--clay-800)', color: 'var(--text-invert)', textAlign: 'center',
        padding: '11px 12px', fontWeight: 700, fontSize: '0.86rem',
        letterSpacing: '0.07em', textTransform: 'uppercase'
      }}>{title}</div>
      <div style={{ overflowX: 'auto' }}>
        <table className="spec-table" style={{
          width: '100%', minWidth: `${minWidth}px`, borderCollapse: 'collapse', fontSize: '0.82rem'
        }}>{children}</table>
      </div>
    </div>
  );
}

/* ================================================================== */

/**
 * The datasheet content itself, with no shell around it.
 *
 * `product` and `sheet` come from the caller so the page and the modal build the
 * spec sheet once each and pass the same shape in.
 */
export default function ProductSheet({ product, sheet, openRfqModal }) {
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', quantityKg: '', message: ''
  });
  // Buyers came here for the numbers; the tables start open and can be collapsed.
  const [showTables, setShowTables] = useState(true);
  const tablesRef = useRef(null);

  /**
   * The tables carry `.reveal`, which is opacity:0 until an IntersectionObserver
   * adds `.is-in`. That observer runs once on mount, so anything toggled on
   * afterwards mounts already-observed-past and stays invisible — the tables
   * were in the DOM the whole time, just transparent. Content revealed by a
   * deliberate click should not wait to be scrolled into view anyway, so mark it
   * visible immediately.
   */
  useEffect(() => {
    if (!showTables) return;
    const node = tablesRef.current;
    if (!node) return;
    const id = requestAnimationFrame(() => {
      node.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
    });
    return () => cancelAnimationFrame(id);
  }, [showTables]);

  const stats = headlineStats(product, sheet);
  const comp = compositionBars(sheet.chemical);
  const crush = crushBars(sheet.sizeStrength);
  const heroStat = stats[0];
  const keyRows = sheet.physical.slice(0, 6);

  const handleQuickInquiry = (e) => {
    e.preventDefault();
    const text = `Hello Platinaa Ceramics! Inquiry for product: ${product.name}%0ACompany: ${formData.company}%0AName: ${formData.name}%0APhone: ${formData.phone}%0AEst Quantity: ${formData.quantityKg} KG%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/919360340963?text=${text}`, '_blank');
  };

  return (
    <div className="product-sheet">
      {/* ============ MASTHEAD ============ */}
      <div style={{
        background: 'var(--clay-800)', color: 'var(--text-invert)',
        padding: '34px 34px 30px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px', alignItems: 'center', position: 'relative', zIndex: 2
        }}>
          <div>
            <div style={{
              display: 'inline-block', background: 'var(--brand-red)', color: 'var(--on-accent)',
              padding: '5px 13px', borderRadius: '3px', fontSize: '0.64rem',
              fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: '16px'
            }}>Technical Specification</div>

            <h2 className="headline-print" style={{
              fontSize: 'clamp(1.6rem, 3.3vw, 2.4rem)', color: 'var(--on-accent)',
              marginBottom: '14px', textWrap: 'balance'
            }}>{product.name}</h2>

            <p style={{
              color: 'color-mix(in srgb, var(--text-invert) 80%, transparent)', fontSize: '0.92rem',
              lineHeight: 1.6, marginBottom: '14px', maxWidth: '46ch'
            }}>{sheet.strapline}</p>

            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: 'color-mix(in srgb, var(--text-invert) 58%, transparent)', letterSpacing: '0.05em'
            }}>{product.material} · Grade Code {product.materialType}</p>
          </div>

          <div className="zoom-wrap" style={{
            aspectRatio: '4 / 3', borderRadius: '8px',
            border: '1px solid color-mix(in srgb, var(--text-invert) 16%, transparent)', background: 'var(--clay-900)'
          }}>
            <img
              src={`${import.meta.env.BASE_URL}${product.image}`} alt={product.name}
              loading="lazy" decoding="async" width="800" height="600"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>

      {/* ============ HEADLINE STAT BAND ============ */}
      {heroStat && (
        <div className="stat-band reveal reveal-seq" style={{
          padding: '26px 34px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '18px', alignItems: 'center'
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center',
              borderLeft: i ? '1px solid color-mix(in srgb, var(--on-accent) 22%, transparent)' : 'none'
            }}>
              <div className="font-mono" style={{
                fontSize: i === 0 ? 'clamp(1.9rem, 4vw, 2.9rem)' : 'clamp(1.35rem, 2.6vw, 1.9rem)',
                fontWeight: 700, lineHeight: 1.05,
                color: 'var(--on-accent)', letterSpacing: '-0.02em',
                textShadow: '0 2px 12px rgba(0,0,0,0.30)'
              }}>{s.value}</div>
              <div style={{
                fontSize: '0.63rem', textTransform: 'uppercase', letterSpacing: '0.14em',
                color: 'color-mix(in srgb, var(--on-accent) 84%, transparent)', marginTop: '8px'
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ============ MATERIAL OVERVIEW ============ */}
      <div style={{ background: 'var(--surface-card)', padding: '34px 34px 6px' }}>
        <div className="reveal overview-card">
          <h4 className="overview-title">Material Overview</h4>
          <p className="overview-body">{product.description}</p>
        </div>
      </div>

      {/* ============ KEY FEATURES ============ */}
      <div style={{ background: 'var(--surface-card)', padding: '38px 34px 32px' }}>
        <SectionHead>Key Features</SectionHead>
        <div className="reveal reveal-seq" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '20px'
        }}>
          {product.highlights.slice(0, 4).map((h, i) => {
            const [head, ...rest] = h.split(/ — |: /);
            const Icon = [Shield, Thermometer, Gem, ShieldCheck][i % 4];
            const hue = FEATURE_HUES[i % FEATURE_HUES.length];
            return (
              <div key={h} className="feat-card" style={{ '--tile-hue': hue }}>
                <span className="feat-disc">
                  <Icon size={30} strokeWidth={1.7} />
                </span>
                <div className="feat-head">{head}</div>
                {rest.length > 0 && <div className="feat-sub">{rest.join(': ')}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ COMPOSITION ============ */}
      {comp && (
        <div className="reveal" style={{ background: 'var(--bg-main)', padding: '34px 34px 30px' }}>
          <SectionHead>Chemical Composition</SectionHead>
          <div style={{
            display: 'flex', height: '46px', borderRadius: '6px', overflow: 'hidden',
            border: `1px solid ${RULE}`, marginBottom: '16px'
          }}>
            {comp.map((c, i) => (
              <div
                key={c.label}
                title={`${c.label} — ${c.pct.toFixed(1)}%`}
                style={{
                  width: `${Math.max(c.share, 2)}%`,
                  background: c.muted ? 'var(--sand-300)' : SEG[i % SEG.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: c.muted ? 'var(--text-bright)' : 'var(--on-accent)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600,
                  transition: 'filter .2s ease', cursor: 'default'
                }}
              >
                {c.share > 8 ? `${c.pct.toFixed(c.pct < 10 ? 1 : 0)}%` : ''}
              </div>
            ))}
          </div>
          <div className="comp-legend">
            {comp.map((c, i) => (
              <div key={c.label} className="comp-legend-item">
                <span className="comp-swatch" style={{
                  background: c.muted ? 'var(--sand-300)' : SEG[i % SEG.length]
                }} />
                <span className="comp-el">{c.label}</span>
                <span className="comp-val">
                  {sheet.chemical.find((x) => x.element === c.label)?.value || `${c.pct.toFixed(1)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ PROPERTIES AS STAT CARDS ============ */}
      <div className="reveal" style={{ background: 'var(--surface-card)', padding: '34px 34px 30px' }}>
        <SectionHead>Physical Properties</SectionHead>
        <div className="reveal reveal-seq" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px'
        }}>
          {keyRows.map((row) => {
            const { Icon, hue } = propStyle(row.label);
            return (
              <div key={row.label} className="prop-tile" style={{ '--tile-hue': hue }}>
                <span className="prop-tile-disc">
                  <Icon size={26} strokeWidth={1.8} />
                </span>
                <div className="prop-tile-value">{row.value}</div>
                <div className="prop-tile-label" title={`${row.label}${row.unit ? `, ${row.unit}` : ''}`}>
                  {SHORT_LABEL[row.label] || row.label}{row.unit ? `, ${row.unit}` : ''}
                  {row.flag === 'VERIFY' && (
                    <AlertTriangle size={11} style={{ color: 'var(--brand-red)', marginLeft: '5px', verticalAlign: '-1px' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ CRUSH STRENGTH CHART ============ */}
      {crush && (
        <div className="reveal" style={{ background: 'var(--bg-main)', padding: '34px 34px 30px' }}>
          <SectionHead>Crush Strength by Size</SectionHead>
          <div className="reveal reveal-seq bar-chart" style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {crush.map((b) => (
              <div key={b.size} style={{
                display: 'grid', gridTemplateColumns: '78px 1fr 96px',
                alignItems: 'center', gap: '12px'
              }}>
                <span className="font-mono" style={{
                  fontSize: '0.76rem', color: 'var(--text-bright)', fontWeight: 600, textAlign: 'right'
                }}>{b.size}</span>
                <div className="bar-track">
                  {/* Width travels as a custom property so CSS can grow the bar
                      from zero once the chart scrolls into view. */}
                  <div className="bar-fill" style={{ '--bar-pct': `${b.pct}%` }} />
                </div>
                <span className="font-mono" style={{
                  fontSize: '0.76rem', color: 'var(--brand-red)', fontWeight: 700
                }}>{b.kg} kg</span>
              </div>
            ))}
          </div>
          <p style={{
            fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '14px',
            fontFamily: 'var(--font-mono)'
          }}>
            Minimum crush load per particle. Full kg / lbs / N table below.
          </p>
        </div>
      )}

      {/* ============ IDEAL FOR ============ */}
      <div className="reveal" style={{ background: 'var(--surface-card)', padding: '34px 34px 30px' }}>
        <SectionHead>Ideal For</SectionHead>
        <div className="reveal reveal-seq" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px'
        }}>
          {IDEAL_FOR.map((f) => {
            const Icon = ICONS[f.icon] || FlaskConical;
            return (
              <div key={f.label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', gap: '11px'
              }}>
                <IconDisc Icon={Icon} tone="navy" size={50} />
                <span style={{
                  fontSize: '0.71rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.07em', color: 'var(--text-bright)', lineHeight: 1.35
                }}>{f.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ BENEFIT STRIP ============ */}
      <div className="reveal reveal-seq" style={{
        background: 'var(--clay-800)', padding: '24px 34px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))', gap: '18px'
      }}>
        {sheet.benefits.map((b) => {
          const Icon = ICONS[b.icon] || ShieldCheck;
          return (
            <div key={b.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: '9px'
            }}>
              <Icon size={25} strokeWidth={1.6} style={{ color: 'color-mix(in srgb, var(--brand-red) 55%, #FFFFFF)' }} />
              <span style={{
                color: 'var(--text-invert)', fontSize: '0.7rem', lineHeight: 1.35,
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em'
              }}>{b.label}</span>
            </div>
          );
        })}
      </div>

      {/* ============ FULL TABLES (progressive disclosure) ============ */}
      <div style={{ background: 'var(--bg-main)', padding: '30px 34px' }}>
        <button
          onClick={() => setShowTables((v) => !v)}
          aria-expanded={showTables}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
        >
          {showTables ? 'Hide full specification tables' : 'View full specification tables'}
        </button>

        {showTables && (
          <div ref={tablesRef} style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '20px', marginTop: '22px', alignItems: 'start'
          }}>
            <SectionTable title="Physical Properties">
              <thead><tr>
                <th style={{ ...thStyle, width: '52px', textAlign: 'center' }}>SL.NO</th>
                <th style={thStyle}>Description</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Parameters</th>
              </tr></thead>
              <tbody>
                {sheet.physical.map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 ? 'var(--bg-main)' : 'var(--surface-card)' }}>
                    <td style={slStyle}>{i + 1}</td>
                    <td style={tdStyle}>
                      {row.label}
                      {row.unit && <span style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.76rem' }}>, {row.unit}</span>}
                    </td>
                    <td style={numStyle}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </SectionTable>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SectionTable title="Chemical Properties" minWidth={280}>
                <thead><tr>
                  <th style={{ ...thStyle, width: '52px', textAlign: 'center' }}>SL.NO</th>
                  <th style={thStyle}>Description</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Content in %</th>
                </tr></thead>
                <tbody>
                  {sheet.chemical.map((row, i) => (
                    <tr key={row.element} style={{ background: i % 2 ? 'var(--bg-main)' : 'var(--surface-card)' }}>
                      <td style={slStyle}>{i + 1}</td>
                      <td style={tdStyle}>{row.element}</td>
                      <td style={numStyle}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </SectionTable>

              {sheet.sizeStrength ? (
                <SectionTable title="Size & Strength" minWidth={410}>
                  <thead><tr>
                    <th style={thStyle}>Size</th>
                    <th style={thStyle}>Size Range</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Kgs</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>lbs</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>N</th>
                  </tr></thead>
                  <tbody>
                    {sheet.sizeStrength.map((row, i) => (
                      <tr key={row.size} style={{ background: i % 2 ? 'var(--bg-main)' : 'var(--surface-card)' }}>
                        <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{row.size}</td>
                        <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{row.range}</td>
                        <td style={numStyle}>{row.kg}</td>
                        <td style={numStyle}>{row.lbs}</td>
                        <td style={numStyle}>{row.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </SectionTable>
              ) : (
                <SectionTable title="Sizes & Crush Strength" minWidth={280}>
                  <tbody>
                    <tr>
                      <td style={{ ...tdStyle, width: '42%', color: 'var(--text-subtle)' }}>Available sizes</td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{sheet.sizes}</td>
                    </tr>
                    <tr style={{ background: 'var(--bg-main)' }}>
                      <td style={{ ...tdStyle, color: 'var(--text-subtle)' }}>Crush strength</td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{sheet.crushStrength}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} style={{ ...tdStyle, borderBottom: 'none', color: 'var(--text-subtle)', fontSize: '0.78rem' }}>
                        Size-by-size crush figures ship with the batch certificate.
                      </td>
                    </tr>
                  </tbody>
                </SectionTable>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============ APPLICATIONS + ENQUIRY ============ */}
      <div style={{
        background: 'var(--surface-card)', padding: '32px 34px 34px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '28px'
      }}>
        <div className="reveal">
          <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '10px' }}>
            Recommended Applications
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {product.applications.map((app) => (
              <span key={app} style={{
                background: 'var(--bg-surface-2)', border: `1px solid ${RULE}`,
                color: 'var(--text-bright)', padding: '5px 11px',
                borderRadius: 'var(--radius-full)', fontSize: '0.76rem', fontWeight: 600
              }}>{app}</span>
            ))}
          </div>
        </div>

        <div className="reveal">
          <div style={{
            background: 'var(--bg-main)', border: `1px solid ${RULE}`,
            padding: '20px', borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '12px' }}>
              Request Bulk Quotation
            </h4>
            <form onSubmit={handleQuickInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text" aria-label="Your name or company" placeholder="Your Name / Company"
                required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="tel" aria-label="Phone number" placeholder="Phone Number"
                  required value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="text" aria-label="Required quantity in kilograms" placeholder="Quantity (KG)"
                  value={formData.quantityKg}
                  onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <button type="submit" className="btn-primary"
                style={{ padding: '12px', fontSize: '0.85rem', justifyContent: 'center', marginTop: '4px' }}>
                Send Enquiry via WhatsApp <Send size={15} />
              </button>
              {openRfqModal && (
                <button type="button" className="btn-secondary" onClick={() => openRfqModal(product)}
                  style={{ padding: '12px', fontSize: '0.85rem', justifyContent: 'center' }}>
                  Open full RFQ form
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
