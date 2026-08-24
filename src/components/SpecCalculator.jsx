import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Layers, Info } from 'lucide-react';

// Bulk (packed) densities in t/m³ — the figure that converts bed volume to
// delivered tonnage. Matches the catalogue values in data/products.js.
const GRADES = [
  { id: 'ia-23',  name: 'Inert Alumina Balls — 17–23% Al₂O₃', bulk: 1.35, voidage: 42, maxTemp: '980 °C' },
  { id: 'ia-30',  name: 'Inert Alumina Balls — 30% Al₂O₃',     bulk: 1.40, voidage: 42, maxTemp: '980 °C' },
  { id: 'ma-60',  name: 'Mid-Alumina Inert Balls — 60% Al₂O₃', bulk: 1.60, voidage: 41, maxTemp: '1400 °C' },
  { id: 'mha-75', name: 'Mid-High Alumina Balls — 75% Al₂O₃',  bulk: 1.70, voidage: 41, maxTemp: '1450 °C' },
  { id: 'ha-92',  name: 'High-Alumina Inert Balls — 92% Al₂O₃', bulk: 2.00, voidage: 40, maxTemp: '1580 °C' },
  { id: 'hp-99',  name: 'High-Purity Inert Alumina — 99% Al₂O₃', bulk: 2.10, voidage: 39, maxTemp: '1650 °C' },
  { id: 'perf',   name: 'Perforated (Open-Hole) Balls',        bulk: 1.15, voidage: 60, maxTemp: '1580 °C' }
];

const BALL_SIZES = [3, 6, 10, 13, 19, 25, 38, 50, 75];

export default function SpecCalculator({ openRfqModal }) {
  const [vesselDia, setVesselDia] = useState(2400);   // mm, internal diameter
  const [layerDepth, setLayerDepth] = useState(150);  // mm, depth of this layer
  const [gradeId, setGradeId] = useState('ha-92');
  const [ballSize, setBallSize] = useState(25);

  const grade = GRADES.find((g) => g.id === gradeId) || GRADES[0];

  const result = useMemo(() => {
    const radiusM = vesselDia / 2 / 1000;
    const depthM = layerDepth / 1000;
    const volumeM3 = Math.PI * radiusM * radiusM * depthM;
    const tonnes = volumeM3 * grade.bulk;
    return {
      volumeM3,
      litres: volumeM3 * 1000,
      kg: tonnes * 1000,
      tonnes,
      // A layer wants at least ~4 ball diameters of depth to grade properly.
      minDepthMm: ballSize * 4,
      depthOk: layerDepth >= ballSize * 4
    };
  }, [vesselDia, layerDepth, grade, ballSize]);

  const fmt = (n, d = 0) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });

  const sliderStyle = {
    width: '100%',
    accentColor: 'var(--clay-500)',
    height: '3px',
    cursor: 'pointer'
  };

  const fieldLabel = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '10px'
  };

  return (
    <section
      id="calculator"
      style={{
        padding: '96px 0',
        background: 'var(--clay-800)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ maxWidth: '620px', marginBottom: '48px' }}>
          <div
            className="label-tech"
            style={{ color: 'var(--sand-500)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <Calculator size={14} /> Bed Volume Calculator
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.6vw, 3rem)',
              color: 'var(--sand-50)',
              marginBottom: '18px'
            }}
          >
            Size your support layer
          </h2>
          <p style={{ color: 'color-mix(in srgb, var(--text-invert) 68%, transparent)', fontSize: '1rem', lineHeight: 1.65 }}>
            Enter the vessel internal diameter and the depth of the layer you are grading.
            The calculator returns bed volume and delivered tonnage at the packed bulk
            density of the grade selected.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '28px',
            alignItems: 'start'
          }}
        >
          {/* ---------------------------------------------------- Inputs */}
          <div
            style={{
              gridColumn: 'span 7',
              background: 'color-mix(in srgb, var(--surface-card) 4%, transparent)',
              border: '1px solid color-mix(in srgb, var(--sand-300) 16%, transparent)',
              borderRadius: 'var(--radius-md)',
              padding: '30px'
            }}
          >
            {/* Vessel diameter */}
            <div style={{ marginBottom: '28px' }}>
              <div style={fieldLabel}>
                <label className="label-tech" style={{ color: 'color-mix(in srgb, var(--text-invert) 60%, transparent)' }}>
                  Vessel internal diameter
                </label>
                <span className="font-mono" style={{ color: 'var(--sand-300)', fontSize: '1rem' }}>
                  {fmt(vesselDia)} mm
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="6000"
                step="50"
                value={vesselDia}
                onChange={(e) => setVesselDia(Number(e.target.value))}
                style={sliderStyle}
              />
              <div className="label-tech" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.6rem', color: 'color-mix(in srgb, var(--text-invert) 38%, transparent)' }}>
                <span>500 mm</span>
                <span>6000 mm</span>
              </div>
            </div>

            {/* Layer depth */}
            <div style={{ marginBottom: '28px' }}>
              <div style={fieldLabel}>
                <label className="label-tech" style={{ color: 'color-mix(in srgb, var(--text-invert) 60%, transparent)' }}>
                  Layer depth
                </label>
                <span className="font-mono" style={{ color: 'var(--sand-300)', fontSize: '1rem' }}>
                  {fmt(layerDepth)} mm
                </span>
              </div>
              <input
                type="range"
                min="25"
                max="1200"
                step="25"
                value={layerDepth}
                onChange={(e) => setLayerDepth(Number(e.target.value))}
                style={sliderStyle}
              />
              <div className="label-tech" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.6rem', color: 'color-mix(in srgb, var(--text-invert) 38%, transparent)' }}>
                <span>25 mm</span>
                <span>1200 mm</span>
              </div>
            </div>

            {/* Ball size */}
            <div style={{ marginBottom: '28px' }}>
              <label className="label-tech" style={{ color: 'color-mix(in srgb, var(--text-invert) 60%, transparent)', display: 'block', marginBottom: '12px' }}>
                Ball diameter
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {BALL_SIZES.map((s) => {
                  const active = s === ballSize;
                  return (
                    <button
                      key={s}
                      onClick={() => setBallSize(s)}
                      className="font-mono"
                      style={{
                        padding: '8px 13px',
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        background: active ? 'var(--sand-200)' : 'transparent',
                        color: active ? 'var(--clay-800)' : 'color-mix(in srgb, var(--text-invert) 70%, transparent)',
                        border: `1px solid ${active ? 'var(--sand-200)' : 'color-mix(in srgb, var(--sand-300) 22%, transparent)'}`,
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {s} mm
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grade */}
            <div>
              <label className="label-tech" style={{ color: 'color-mix(in srgb, var(--text-invert) 60%, transparent)', display: 'block', marginBottom: '12px' }}>
                Media grade
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {GRADES.map((g) => {
                  const active = g.id === gradeId;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGradeId(g.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        padding: '11px 14px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        background: active ? 'color-mix(in srgb, var(--sand-300) 14%, transparent)' : 'transparent',
                        border: `1px solid ${active ? 'var(--sand-400)' : 'color-mix(in srgb, var(--sand-300) 16%, transparent)'}`,
                        color: active ? 'var(--sand-100)' : 'color-mix(in srgb, var(--text-invert) 62%, transparent)',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <span style={{ fontSize: '0.85rem' }}>{g.name}</span>
                      <span className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--sand-400)', whiteSpace: 'nowrap' }}>
                        {g.bulk.toFixed(2)} t/m³
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------- Results */}
          <div style={{ gridColumn: 'span 5', position: 'sticky', top: '96px' }}>
            <div
              style={{
                background: 'var(--sand-50)',
                borderRadius: 'var(--radius-md)',
                padding: '30px',
                border: '1px solid var(--sand-300)'
              }}
            >
              <div className="label-tech" style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '9px' }}>
                <Layers size={14} /> Calculated charge
              </div>

              {/* Headline number */}
              <div style={{ marginBottom: '6px' }}>
                <span
                  className="font-mono"
                  style={{ fontSize: 'clamp(2.4rem, 4.6vw, 3.4rem)', fontWeight: 600, color: 'var(--clay-800)', lineHeight: 1 }}
                >
                  {fmt(result.kg)}
                </span>
                <span className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--text-subtle)', marginLeft: '8px' }}>
                  kg
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '24px' }}>
                ≈ {fmt(result.tonnes, 2)} MT of {grade.name.split('—')[0].trim()}
              </div>

              <dl style={{ margin: '0 0 24px' }}>
                <div className="spec-row">
                  <dt>Bed volume</dt>
                  <dd>{fmt(result.volumeM3, 3)} m³</dd>
                </div>
                <div className="spec-row">
                  <dt>Bed volume (litres)</dt>
                  <dd>{fmt(result.litres)} L</dd>
                </div>
                <div className="spec-row">
                  <dt>Bulk (packed) density</dt>
                  <dd>{grade.bulk.toFixed(2)} t/m³</dd>
                </div>
                <div className="spec-row">
                  <dt>Typical voidage</dt>
                  <dd>{grade.voidage}%</dd>
                </div>
                <div className="spec-row">
                  <dt>Max service temp.</dt>
                  <dd>{grade.maxTemp}</dd>
                </div>
                <div className="spec-row">
                  <dt>Ball diameter</dt>
                  <dd>{ballSize} mm</dd>
                </div>
              </dl>

              {/* Layer depth sanity check */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '22px',
                  background: result.depthOk ? 'color-mix(in srgb, var(--cat-2) 9%, transparent)' : 'color-mix(in srgb, var(--cat-1) 10%, transparent)',
                  border: `1px solid ${result.depthOk ? 'color-mix(in srgb, var(--cat-2) 28%, transparent)' : 'color-mix(in srgb, var(--cat-1) 32%, transparent)'}`
                }}
              >
                <Info
                  size={15}
                  style={{ color: result.depthOk ? 'var(--accent-emerald)' : 'var(--accent-rust)', flexShrink: 0, marginTop: '2px' }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {result.depthOk
                    ? `Layer depth is at least 4 ball diameters (${result.minDepthMm} mm) — sound for even grading.`
                    : `A ${ballSize} mm layer wants at least ${result.minDepthMm} mm depth (4 ball diameters) to grade evenly. Increase depth or drop to a smaller ball.`}
                </span>
              </div>

              <button
                onClick={() =>
                  openRfqModal({
                    mediaName: grade.name,
                    requiredWeightKg: Math.round(result.kg),
                    vesselDia,
                    layerDepth,
                    ballSize
                  })
                }
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Request quote for this charge <ArrowRight size={16} />
              </button>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '14px', lineHeight: 1.5 }}>
                Indicative only. Actual tonnage varies with size distribution, vessel
                internals and loading method. Send us the reactor drawing and we will
                prepare the full grading schedule.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #calculator .container-custom > div:last-of-type > div { grid-column: span 12 !important; position: static !important; }
        }
      `}</style>
    </section>
  );
}
