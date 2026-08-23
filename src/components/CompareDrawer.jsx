import React, { useState, useEffect } from 'react';
import { X, Scale, Trash2, ArrowRight, Minus, ChevronUp, ChevronDown } from 'lucide-react';
import { buildSpecSheet } from '../data/specSheets';

/**
 * Side-by-side comparison. Collapsed it is a slim bar; expanded it is a full
 * property matrix so grades can be judged on the numbers rather than on the
 * two or three figures a card has room for.
 *
 * Rows are built from the union of the selected products' spec sheets, so a
 * property only appears if at least one product publishes it. Where a product
 * has no value the cell shows an em dash rather than a blank, which keeps the
 * columns readable and never implies a zero.
 */

const IDENTITY_ROWS = [
  ['Grade', (p) => p.grade],
  ['Grade code', (p) => p.materialType],
  ['Material', (p) => p.material],
  ['Standard', (p) => p.standard]
];

function collectRows(sheets) {
  const order = [];
  const seen = new Set();
  sheets.forEach((s) => {
    s.physical.forEach((r) => {
      const key = r.unit ? `${r.label}, ${r.unit}` : r.label;
      if (!seen.has(key)) { seen.add(key); order.push({ key, label: r.label, unit: r.unit }); }
    });
  });
  return order;
}

function valueFor(sheet, row) {
  const hit = sheet.physical.find((r) => r.label === row.label);
  return hit ? hit.value : null;
}

export default function CompareDrawer({ compareList, toggleCompare, clearCompare, openRfqModal }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (compareList.length === 0) return null;

  const sheets = compareList.map((p) => buildSpecSheet(p));
  const physRows = collectRows(sheets);

  // Union of chemical elements across the selection, first-seen order.
  const elements = [];
  sheets.forEach((s) => s.chemical.forEach((c) => {
    if (!elements.includes(c.element)) elements.push(c.element);
  }));

  const cols = compareList.length;

  return (
    <div className={`cmp-drawer${expanded ? ' is-expanded' : ''}`}>
      <div className="cmp-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <Scale size={18} style={{ color: 'var(--brand-red)', flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-bright)' }}>
            Comparing {compareList.length} of 3
          </span>
          <span className="cmp-names">
            {compareList.map((p) => p.materialType).join(' · ')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button className="cmp-link" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
            {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            {expanded ? 'Hide table' : 'Compare specs'}
          </button>
          <button className="cmp-link" onClick={clearCompare}>
            <Trash2 size={14} /> Clear
          </button>
          <button onClick={() => openRfqModal()} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
            Multi-Grade Quote <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="cmp-scroll">
          <table className="cmp-table" style={{ '--cmp-cols': cols }}>
            <thead>
              <tr>
                <th className="cmp-rowhead cmp-corner">Property</th>
                {compareList.map((p) => (
                  <th key={p.id} className="cmp-colhead">
                    <button
                      className="cmp-remove"
                      onClick={() => toggleCompare(p)}
                      aria-label={`Remove ${p.name} from comparison`}
                    >
                      <X size={13} />
                    </button>
                    <img
                      src={`${import.meta.env.BASE_URL}${p.image}`}
                      alt=""
                      loading="lazy"
                      width="800"
                      height="600"
                      className="cmp-thumb"
                    />
                    <span className="cmp-name">{p.name}</span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr className="cmp-section"><td colSpan={cols + 1}>Identity</td></tr>
              {IDENTITY_ROWS.map(([label, get]) => (
                <tr key={label}>
                  <th className="cmp-rowhead">{label}</th>
                  {compareList.map((p) => (
                    <td key={p.id}>{get(p) || <Minus size={13} className="cmp-none" />}</td>
                  ))}
                </tr>
              ))}

              <tr className="cmp-section"><td colSpan={cols + 1}>Physical properties</td></tr>
              {physRows.map((row) => (
                <tr key={row.key}>
                  <th className="cmp-rowhead">
                    {row.label}
                    {row.unit && <span className="cmp-unit">, {row.unit}</span>}
                  </th>
                  {sheets.map((s, i) => {
                    const v = valueFor(s, row);
                    return (
                      <td key={compareList[i].id} className={v ? 'cmp-num' : ''}>
                        {v || <Minus size={13} className="cmp-none" />}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr className="cmp-section"><td colSpan={cols + 1}>Chemical analysis</td></tr>
              {elements.map((el) => (
                <tr key={el}>
                  <th className="cmp-rowhead">{el}</th>
                  {sheets.map((s, i) => {
                    const hit = s.chemical.find((c) => c.element === el);
                    return (
                      <td key={compareList[i].id} className={hit ? 'cmp-num' : ''}>
                        {hit ? hit.value : <Minus size={13} className="cmp-none" />}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr className="cmp-section"><td colSpan={cols + 1}>Sizes &amp; crush strength</td></tr>
              <tr>
                <th className="cmp-rowhead">Available sizes</th>
                {compareList.map((p) => (
                  <td key={p.id} className="cmp-num">{p.sizes || <Minus size={13} className="cmp-none" />}</td>
                ))}
              </tr>
              <tr>
                <th className="cmp-rowhead">Crush strength</th>
                {compareList.map((p) => (
                  <td key={p.id} className="cmp-num">{p.crushStrength || <Minus size={13} className="cmp-none" />}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
