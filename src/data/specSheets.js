// Technical specification sheet data — layout and row structure follow the
// printed Platinaa datasheet (Platina png.pdf, page 2).
//
// PROVENANCE RULES — read before editing:
//   pdf    = taken verbatim from the printed datasheet. Authoritative.
//   own    = already published in products.js, re-mapped into the PDF row order.
//   web    = external source, only used where independent sources converged.
//   VERIFY = value is disputed or unconfirmed. Do not publish without checking.
//
// Where a product has no value for a PDF row, the row is omitted rather than
// filled with a guess. A buyer specs a reactor charge against these numbers.

// ---------------------------------------------------------------------------
// Rows unique to the printed sheet. Only HP-99 has these — they were measured
// for that grade and do not transfer to the lower alumina bodies.
// ---------------------------------------------------------------------------
const HP99_SHEET_ROWS = [
  { label: 'Apparent Porosity', unit: '%', value: '< 1 %', src: 'pdf' },
  { label: 'Roundness, dₘₐₓ/dₘᵢₙ', unit: 'mm', value: '< 1.25', src: 'pdf' },
  { label: 'Thermal Expansion Coefficient', unit: '1/K', value: '6.7 × 10⁻⁶', src: 'pdf' },
  { label: 'Spec. Thermal Energy', unit: 'kJ/(kg·K)', value: '~ 1.1', src: 'pdf' },
  { label: 'Thermal Conductivity', unit: 'kJ/(m·h·K)', value: '~ 14.6', src: 'pdf' }
];

// ---------------------------------------------------------------------------
// Size & strength. The printed table is internally consistent — kg x 9.807 = N
// and kg x 2.2046 = lbs on every row — so it is a real measured spec, not a
// transcription. Only HP-99 has one; deriving the others by scaling would be
// invention, so they are left absent.
// ---------------------------------------------------------------------------
const HP99_SIZE_STRENGTH = [
  { size: '1/8 IN – 3 MM', range: '2 to 5 MM', kg: '> 75', lbs: '165', n: '735' },
  { size: '1/4 IN – 6 MM', range: '5 to 8 MM', kg: '> 150', lbs: '331', n: '1471' },
  { size: '1/2 IN – 12 MM', range: '11 to 14 MM', kg: '> 300', lbs: '661', n: '2942' },
  { size: '3/4 IN – 19 MM', range: '17 to 21 MM', kg: '> 600', lbs: '1323', n: '5884' },
  { size: '1 IN – 25 MM', range: '23 to 27 MM', kg: '> 800', lbs: '1764', n: '7845' },
  { size: '1½ IN – 38 MM', range: '34 to 40 MM', kg: '> 1100', lbs: '2425', n: '10787' },
  { size: '2 IN – 50 MM', range: '47 to 53 MM', kg: '> 1500', lbs: '3307', n: '14706' }
];

// Benefit strip along the foot of the printed sheet. Icon keys match the
// glyphs used on the print piece; ProductDetailModal maps them to components.
const DEFAULT_BENEFITS = [
  { label: 'High Chemical Purity', icon: 'shield' },
  { label: 'Excellent Thermal Stability', icon: 'thermometer' },
  { label: 'Superior Hardness & Wear Resistance', icon: 'gem' },
  { label: 'Long Service Life & Reliability', icon: 'shieldCheck' },
  { label: 'Low Silica Leaching Risk', icon: 'molecule' }
];

// "Ideal for" row from page 1 of the printed sheet.
export const IDEAL_FOR = [
  { label: 'Petrochemical Industries', icon: 'factory' },
  { label: 'Catalyst Support', icon: 'recycle' },
  { label: 'High Temperature Processing', icon: 'flask' },
  { label: 'Environmental Applications', icon: 'leaf' }
];

// Headline stat row, in the spirit of page 1 of the printed sheet.
//
// These MUST be derived from the product on screen. They were briefly hardcoded
// to HP-99's figures from the print piece, which made every other sheet
// contradict its own tables one screen below: the 75% grade claimed
// "1500°C+ / >99% alumina" directly above a table reading 1450°C and 40-75%.
// Never reintroduce fixed values here.
export function headlineStats(product, sheet) {
  const out = [];

  const temp = sheet.physical.find((r) => r.label === 'Working Temp');
  if (temp) out.push({ value: temp.value, label: 'Max Service Temperature' });

  if (product.grade) out.push({ value: product.grade, label: 'Alumina Content' });

  const last = sheet.sizeStrength ? sheet.sizeStrength[sheet.sizeStrength.length - 1] : null;
  if (last) {
    out.push({ value: `${last.kg} kg`, label: `Crush Strength at ${last.size.split('–').pop().trim()}` });
  } else if (product.hardness) {
    out.push({ value: product.hardness, label: 'Mohs Hardness' });
  } else if (product.waterAbsorption) {
    out.push({ value: product.waterAbsorption, label: 'Water Absorption' });
  }

  return out.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Per-product overrides. Anything not listed here falls back to the generic
// sheet built from products.js in buildSpecSheet() below.
// ---------------------------------------------------------------------------
export const specSheets = {
  'high-purity-inert-alumina-balls-99': {
    kicker: 'High Purity Support Media',
    strapline: 'The ultimate high-purity support media, for extreme environments.',
    // PDF figures win over products.js wherever the two disagree.
    physicalOverrides: {
      // products.js says "< 0.5%" — the printed sheet is tighter.
      waterAbsorption: { value: '0.4 % Max', src: 'pdf' },
      // products.js says "3.2 - 3.6 g/cm3".
      density: { value: '3.0 to 3.5 gm/cc', src: 'pdf' },
      // products.js says "2.0 - 2.2 g/cm3".
      bulkDensity: { value: '2.15 Kg/L', src: 'pdf' },
      // 1800 degC is stated independently by two Platinaa documents
      // (Platina png.pdf p2 and HACB SPEC 99%.pdf), so it is the published
      // figure. products.js still says 1650 degC and should be reconciled.
      maxTemp: { value: '1800 °C', src: 'pdf' }
    },
    extraPhysical: HP99_SHEET_ROWS,
    chemical: [
      { element: 'Al₂O₃', value: '> 99.0 %', src: 'pdf' },
      { element: 'SiO₂', value: '0.20 % MAX', src: 'pdf' },
      { element: 'Na₂O', value: '0.40 % MAX', src: 'pdf' },
      { element: 'Fe₂O₃', value: '0.10 % MAX', src: 'pdf' }
    ],
    sizeStrength: HP99_SIZE_STRENGTH,
    benefits: DEFAULT_BENEFITS
  },

  // -------------------------------------------------------------------------
  // HPCBSM SPEC.pdf — High Performance Catalyst Bed Support Media
  // -------------------------------------------------------------------------
  'high-performance-catalyst-bed-support-media': {
    kicker: 'High Performance Support Media',
    strapline: 'Engineered bed support for moderate-temperature reactors, with low leachable iron.',
    physicalOverrides: {
      waterAbsorption: { value: '0.4 % Max', src: 'pdf' },
      density: { value: '2.3 gm/cc', src: 'pdf' },
      maxTemp: { value: '1000 °C', src: 'pdf' },
      bulkDensity: { value: '1.35 Kg/L', src: 'pdf' }
    },
    extraPhysical: [
      { label: 'Apparent Porosity', unit: '%', value: '< 1 %', src: 'pdf' },
      { label: 'Roundness, dₘₐₓ/dₘᵢₙ', unit: 'mm', value: '< 1.25', src: 'pdf' },
      { label: 'Thermal Expansion Coefficient', unit: '1/K', value: '4.7 × 10⁻⁶', src: 'pdf' },
      { label: 'Spec. Thermal Energy', unit: 'kJ/(kg·K)', value: '~ 0.84', src: 'pdf' },
      { label: 'Thermal Conductivity', unit: 'kJ/(m·h·K)', value: '~ 6.3', src: 'pdf' }
    ],
    chemical: [
      { element: 'Al₂O₃', value: '20 to 26 %', src: 'pdf' },
      { element: 'SiO₂', value: '65 to 72 %', src: 'pdf' },
      { element: 'SiO₂ + Al₂O₃', value: '> 92 %', src: 'pdf' },
      { element: 'K₂O', value: '2.1 to 3 %', src: 'pdf' },
      { element: 'Na₂O', value: '1.3 to 1.8 %', src: 'pdf' },
      { element: 'CaO', value: '0.5 to 1.1 %', src: 'pdf' },
      { element: 'MgO', value: '0.5 to 1.2 %', src: 'pdf' },
      { element: 'Fe₂O₃', value: '0.4 to 0.8 %', src: 'pdf' },
      { element: 'TiO₂', value: '0.4 to 0.8 %', src: 'pdf' },
      { element: 'Leachable Iron', value: '< 0.1 %', src: 'pdf' }
    ],
    // The printed sheet carries four sizes only. Not extrapolated beyond it.
    sizeStrength: [
      { size: '1/8 IN – 3 MM', range: '2 to 5 MM', kg: '> 25', lbs: '55', n: '245' },
      { size: '1/4 IN – 6 MM', range: '5 to 8 MM', kg: '> 65', lbs: '143', n: '637' },
      { size: '1/2 IN – 12 MM', range: '11 to 14 MM', kg: '> 180', lbs: '397', n: '1765' },
      { size: '3/4 IN – 19 MM', range: '17 to 21 MM', kg: '> 430', lbs: '948', n: '4217' }
    ],
    benefits: [
      { label: 'Low Leachable Iron', icon: 'shield' },
      { label: 'Stable to 1000°C', icon: 'thermometer' },
      { label: 'Tight Sphericity', icon: 'gem' },
      { label: 'Even Flow Distribution', icon: 'shieldCheck' },
      { label: 'Low Bed Pressure Drop', icon: 'molecule' }
    ]
  },

  // -------------------------------------------------------------------------
  // PLATINAA INDUSTRIAL CERAMICS PVT LTD -1.docx
  // High Performance Inert Ceramic Ball
  // -------------------------------------------------------------------------
  'high-performance-inert-ceramic-ball': {
    kicker: 'High Performance Inert Ball',
    strapline: 'Standard-duty inert ceramic ball for tower packing and bed support at moderate temperature.',
    physicalOverrides: {
      // Note this grade ABSORBS: >3%, unlike the dense high-alumina bodies.
      waterAbsorption: { value: '> 3 %', src: 'docx' },
      density: { value: '2.3 – 2.4 g/cm³', src: 'docx' },
      maxTemp: { value: '> 980 °C', src: 'docx' },
      hardness: { value: '6.5 Mohs', src: 'docx' },
      acidResistance: { value: '> 98 %', src: 'docx' },
      alkaliResistance: { value: '> 80 %', src: 'docx' }
    },
    extraPhysical: [
      { label: 'Spalling Resistance', unit: '°C', value: '> 300', src: 'docx' },
      { label: 'Compressive Strength', unit: 'kN/pellet', value: '> 2.5', src: 'docx' }
    ],
    chemical: [
      { element: 'Al₂O₃', value: '17 – 35 %', src: 'docx' },
      { element: 'Al₂O₃ + SiO₂', value: '≥ 92 %', src: 'docx' },
      { element: 'Fe₂O₃', value: '< 1 %', src: 'docx' },
      { element: 'CaO', value: '< 1.5 %', src: 'docx' },
      { element: 'MgO', value: '< 2.5 %', src: 'docx' },
      { element: 'K₂O + Na₂O', value: '< 4.0 %', src: 'docx' },
      { element: 'TiO₂', value: '< 0.5 %', src: 'docx' }
    ],
    benefits: [
      { label: 'Broad Chemical Tolerance', icon: 'shield' },
      { label: 'Thermal Shock Resistant', icon: 'thermometer' },
      { label: 'Consistent Sphericity', icon: 'gem' },
      { label: 'Economical Bed Fill', icon: 'shieldCheck' },
      { label: 'Acid Resistance > 98%', icon: 'molecule' }
    ]
  }
};

// ---------------------------------------------------------------------------
// Branch + warehouse block, from the foot of the printed sheet.
// ---------------------------------------------------------------------------
export const branches = [
  {
    label: 'Branch & Warehouse — 01',
    lines: [
      'Plot No B-1/1, Basement Floor, Block - D',
      'Near Badli Railway Station Road',
      'Yadav Nagar, Samaypur Badli',
      'New Delhi - 110 042, India'
    ],
    phones: ['+91 78458 40963', '78670 11890'],
    email: 'sales.delhi@platinaaceramics.com'
  },
  {
    label: 'Branch & Warehouse — 02',
    lines: [
      'A-06, Bijal Business Centre, Ground Floor',
      'Opp. Shyam Icon, Ring Road',
      'Aslali, Ahmedabad - 382 427',
      'Gujarat, India'
    ],
    phones: ['+91 78719 40963', '78670 11891'],
    email: 'sales.ahd@platinaaceramics.com'
  }
];

// ---------------------------------------------------------------------------
// Assemble a sheet for any product. Rows follow the printed order; a row with
// no value is dropped so the table never shows an empty cell.
// ---------------------------------------------------------------------------
export function buildSpecSheet(product) {
  const sheet = specSheets[product.id] || {};
  const ov = sheet.physicalOverrides || {};

  const pick = (key, fallback) =>
    ov[key] ? ov[key] : fallback ? { value: fallback, src: 'own' } : null;

  const rows = [
    { label: 'Water absorption', ...pick('waterAbsorption', product.waterAbsorption) },
    { label: 'Particle Density (Material Piece Density)', ...pick('density', product.density) },
    ...(sheet.extraPhysical ? [sheet.extraPhysical[0]] : []),
    { label: 'Working Temp', ...pick('maxTemp', product.maxTemp) },
    ...(sheet.extraPhysical ? sheet.extraPhysical.slice(1) : []),
    { label: 'Packing Density', ...pick('bulkDensity', product.bulkDensity) },
    // Rows Platinaa publishes that the printed sheet does not carry.
    { label: 'Mohs Hardness', ...pick('hardness', product.hardness) },
    { label: 'Acid Resistance', ...pick('acidResistance', product.acidResistance) },
    { label: 'Alkali Resistance', ...pick('alkaliResistance', product.alkaliResistance) },
    { label: 'Bed Voidage', ...pick('voidage', product.voidage) },
    { label: 'Standard', ...pick('standard', product.standard) }
  ].filter((r) => r && r.value);

  const chemical =
    sheet.chemical ||
    (product.chemicalComposition || []).map((c) => ({
      element: c.element,
      value: c.value,
      src: 'own'
    }));

  return {
    kicker: sheet.kicker || product.grade,
    strapline: sheet.strapline || product.shortDesc,
    physical: rows,
    chemical,
    sizeStrength: sheet.sizeStrength || null,
    sizes: product.sizes,
    crushStrength: product.crushStrength,
    benefits: sheet.benefits || DEFAULT_BENEFITS
  };
}


// ---------------------------------------------------------------------------
// Parsers for the infographic views. Spec values are human strings ("20 to 26 %",
// "> 1500"), so the charts read numbers back out of them. Anything unparseable
// returns null and the caller falls back to the plain table — a chart is never
// drawn from a guessed number.
// ---------------------------------------------------------------------------
export function parseNumber(str) {
  if (typeof str !== 'string') return null;
  const m = str.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

/** Midpoint of a range like "20 to 26 %" or "17 – 35 %"; else the single value. */
export function parseMagnitude(str) {
  if (typeof str !== 'string') return null;
  const nums = (str.replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || []).map(parseFloat);
  if (!nums.length) return null;
  if (nums.length >= 2 && /to|–|-|~/.test(str)) return (nums[0] + nums[1]) / 2;
  return nums[0];
}

/** Chemical rows -> stacked composition bar. Only main oxides, normalised. */
export function compositionBars(chemical) {
  const skip = /leachable|\+/i;
  const rows = chemical
    .filter((c) => !skip.test(c.element))
    .map((c) => ({ label: c.element, pct: parseMagnitude(c.value) }))
    .filter((c) => c.pct != null && c.pct > 0);
  if (!rows.length) return null;
  const total = rows.reduce((a, b) => a + b.pct, 0);
  if (total <= 0) return null;
  const rest = Math.max(0, 100 - total);
  const out = rows.map((r) => ({ ...r, share: (r.pct / Math.max(total, 100)) * 100 }));
  if (rest > 0.5 && total < 100) out.push({ label: 'Balance', pct: rest, share: rest, muted: true });
  return out;
}

/** Size/strength rows -> bar chart scaled to the strongest size. */
export function crushBars(sizeStrength) {
  if (!sizeStrength || !sizeStrength.length) return null;
  const rows = sizeStrength
    .map((r) => ({ size: r.size.replace(/^.*–\s*/, ''), kg: parseNumber(r.kg), n: r.n, lbs: r.lbs }))
    .filter((r) => r.kg != null);
  if (!rows.length) return null;
  const max = Math.max(...rows.map((r) => r.kg));
  return rows.map((r) => ({ ...r, pct: (r.kg / max) * 100 }));
}
