// Product catalogue — inert alumina ceramic balls, catalyst bed support media,
// ceramic tower packing and adsorbents.
// Spec basis: HG/T 3683.1-2014 (Industrial Ceramic Balls — Inert Ceramic Balls).

export const categories = [
  { id: "all", name: "All Products", badge: "Complete Range" },
  { id: "inert-balls", name: "Inert Alumina Balls", badge: "Core Range" },
  { id: "bed-support", name: "Catalyst Bed Support", badge: "Reactor Grade" },
  { id: "tower-packing", name: "Ceramic Tower Packing", badge: "Mass Transfer" },
  { id: "adsorbents", name: "Adsorbents & Desiccants", badge: "Purification" },
  { id: "catalysts", name: "Catalysts & Guards", badge: "Process Chemistry" }
];

export const products = [
  // ---------------------------------------------------------------------------
  // INERT ALUMINA CERAMIC BALLS — graded by alumina content
  // ---------------------------------------------------------------------------
  {
    id: "high-purity-inert-alumina-balls-99",
    image: "products/high-purity-inert-alumina-balls-99.jpg",
    name: "High-Purity Inert Alumina Ceramic Balls — 99% Al₂O₃",
    category: "inert-balls",
    grade: "99% Al₂O₃",
    material: "≥ 99% α-Alumina (Corundum)",
    materialType: "HP-99",
    shortDesc: "Ultra-pure α-alumina bed support media for severe-service hydroprocessing reactors and high-temperature catalyst beds.",
    description: "High-Purity Inert Alumina Ceramic Balls are isostatically formed from ≥99% calcined α-alumina and sintered above 1700°C into a fully densified, closed-pore corundum structure. With Fe₂O₃ held below 0.2%, they introduce no iron, silica or alkali contamination into the process stream — critical for noble-metal reforming, hydrocracking and hydrotreating beds where trace metals poison the active phase. Service temperature reaches 1650°C with excellent thermal shock and creep resistance under full reactor load.",
    density: "3.2 – 3.6 g/cm³",
    bulkDensity: "2.0 – 2.2 g/cm³",
    hardness: "≥ 9.0 Mohs",
    waterAbsorption: "< 0.5%",
    acidResistance: "≥ 99.8%",
    alkaliResistance: "≥ 90%",
    crushStrength: "200 kg (3mm) → 3400 kg (50mm)",
    maxTemp: "1650 °C",
    voidage: "38 – 40%",
    sizes: "3, 6, 8, 10, 13, 16, 19, 25, 30, 38, 50, 60, 75 mm",
    standard: "HG/T 3683.1-2014",
    color: "#FFFFFF",
    colorName: "Corundum White",
    chemicalComposition: [
      { element: "Al₂O₃", value: "≥ 99.0%" },
      { element: "Fe₂O₃", value: "< 0.2%" },
      { element: "SiO₂ + Others", value: "Balance" }
    ],
    applications: [
      "Hydrocracker & hydrotreater bed support",
      "Catalytic reforming reactors (noble metal)",
      "Ammonia & methanol synthesis converters",
      "Primary & secondary steam reformers",
      "High-temperature VOC / RTO oxidisers",
      "Sulphur recovery (Claus) reactor beds"
    ],
    highlights: [
      "Fe₂O₃ below 0.2% — no iron pickup into catalyst",
      "Closed porosity: zero adsorption of process liquid",
      "Survives full reactor thermal cycling without spalling",
      "Highest crush strength in the inert ball range"
    ],
    featured: true,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "high-alumina-inert-balls-92",
    image: "products/high-alumina-inert-balls-92.jpg",
    name: "High-Alumina Inert Ceramic Balls — 92% Al₂O₃",
    category: "inert-balls",
    grade: "92% Al₂O₃",
    material: "85 – 97% Sintered Alumina",
    materialType: "HA-92",
    shortDesc: "Dense high-alumina support media balancing near-corundum performance against high-purity cost.",
    description: "The 92% Al₂O₃ grade is the workhorse of high-severity bed support. Sintered to 3.2–3.4 g/cm³ with essentially closed porosity, it delivers crush strength and chemical inertness close to the 99% grade at substantially lower cost. It is the standard selection for the load-bearing bottom layer of fixed-bed reactors, hydrogen generation units and desulphurisation vessels operating to 1580°C.",
    density: "3.2 – 3.4 g/cm³",
    bulkDensity: "1.9 – 2.1 g/cm³",
    hardness: "≥ 7.5 Mohs",
    waterAbsorption: "< 2.0%",
    acidResistance: "≥ 99.7%",
    alkaliResistance: "≥ 88%",
    crushStrength: "180 kg (3mm) → 3000 kg (50mm)",
    maxTemp: "1580 °C",
    voidage: "38 – 42%",
    sizes: "3, 6, 8, 10, 13, 16, 19, 25, 30, 38, 50, 60, 75 mm",
    standard: "HG/T 3683.1-2014",
    color: "#F7F2E8",
    colorName: "Sintered Ivory",
    chemicalComposition: [
      { element: "Al₂O₃", value: "85 – 97%" },
      { element: "Al₂O₃ + SiO₂", value: "> 94%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Hydrogen generation unit (HGU) reactors",
      "Hydrodesulphurisation bed support",
      "Shift converters in ammonia plants",
      "Natural gas dehydration vessels",
      "Petrochemical fixed-bed reactors"
    ],
    highlights: [
      "Near-corundum strength at mid-range cost",
      "Low water absorption — fast dry-out on start-up",
      "Stable under cyclic hydrogen service",
      "Preferred load-bearing bottom-layer grade"
    ],
    featured: true,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "mid-high-alumina-inert-balls-75",
    image: "products/mid-high-alumina-inert-balls-75.jpg",
    name: "Mid-High Alumina Inert Ceramic Balls — 75% Al₂O₃",
    category: "inert-balls",
    grade: "75% Al₂O₃",
    material: "40 – 75% Alumina Body",
    materialType: "MHA-75",
    shortDesc: "Mid-high alumina media for moderate-temperature reactors and tower bases needing elevated thermal limits.",
    description: "Mid-high alumina inert balls bridge the economy and high-alumina grades. The 40–75% Al₂O₃ body sinters to 2.6–2.9 g/cm³ and raises the service ceiling to 1450°C — well above the 980°C limit of the low-alumina grades — making it the correct choice for reformer outlet zones, regenerator beds and drying towers where economy balls would soften or spall.",
    density: "2.6 – 2.9 g/cm³",
    bulkDensity: "1.6 – 1.8 g/cm³",
    hardness: "≥ 7.0 Mohs",
    waterAbsorption: "< 1.0%",
    acidResistance: "≥ 99.6%",
    alkaliResistance: "≥ 85%",
    crushStrength: "120 kg (3mm) → 2100 kg (50mm)",
    maxTemp: "1450 °C",
    voidage: "40 – 43%",
    sizes: "3, 6, 8, 10, 13, 16, 19, 25, 30, 38, 50, 60, 75 mm",
    standard: "HG/T 3683.1-2014",
    color: "#EFE6D4",
    colorName: "Warm Ivory",
    chemicalComposition: [
      { element: "Al₂O₃", value: "40 – 75%" },
      { element: "Al₂O₃ + SiO₂", value: "> 93%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Steam reformer outlet collectors",
      "Regenerative thermal oxidiser beds",
      "Gas drying & dehydration towers",
      "Sulphuric acid plant converters",
      "Intermediate bed grading layers"
    ],
    highlights: [
      "1450°C ceiling — 470°C above economy grades",
      "Strong thermal shock resistance on cyclic duty",
      "Cost-effective intermediate grading layer",
      "Low absorption keeps bed pressure drop stable"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "mid-alumina-inert-balls-60",
    image: "products/mid-alumina-inert-balls-60.jpg",
    name: "Mid-Alumina Inert Ceramic Balls — 60% Al₂O₃",
    category: "inert-balls",
    grade: "60% Al₂O₃",
    material: "55 – 65% Alumina Body",
    materialType: "MA-60",
    shortDesc: "Medium-alumina inert media for general chemical and gas-processing bed support at moderate severity.",
    description: "The 60% Al₂O₃ grade offers a balanced combination of chemical inertness, crush strength and price for general-duty catalyst bed support. It is widely specified for the middle grading layers of fixed-bed reactors and as the primary support charge in adsorption and drying vessels where the 92% grade is over-specified.",
    density: "2.6 – 2.8 g/cm³",
    bulkDensity: "1.5 – 1.7 g/cm³",
    hardness: "≥ 7.0 Mohs",
    waterAbsorption: "< 1.0%",
    acidResistance: "≥ 99.5%",
    alkaliResistance: "≥ 85%",
    crushStrength: "100 kg (3mm) → 1800 kg (50mm)",
    maxTemp: "1400 °C",
    voidage: "40 – 43%",
    sizes: "3, 6, 8, 10, 13, 16, 19, 25, 30, 38, 50, 60, 75 mm",
    standard: "HG/T 3683.1-2014",
    color: "#E0D2B8",
    colorName: "Light Sandal",
    chemicalComposition: [
      { element: "Al₂O₃", value: "55 – 65%" },
      { element: "SiO₂", value: "30 – 38%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Middle grading layers in fixed-bed reactors",
      "Adsorption & molecular sieve vessel support",
      "Gas purification towers",
      "Chemical reactor bed dispersion layers",
      "Air separation pre-treatment vessels"
    ],
    highlights: [
      "Balanced strength-to-cost for bulk layers",
      "Chemically inert to acids, alkalis and solvents",
      "Uniform sphericity for predictable voidage",
      "Wide size range for multi-layer grading"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "inert-alumina-ceramic-balls-30",
    image: "products/inert-alumina-ceramic-balls-30.jpg",
    name: "Inert Alumina Ceramic Balls — 30% Al₂O₃",
    category: "inert-balls",
    grade: "23 – 30% Al₂O₃",
    material: "23 – 30% Alumina Silicate",
    materialType: "IA-30",
    shortDesc: "Medium-grade inert ceramic balls for tower packing support and moderate-duty catalyst beds.",
    description: "The 23–30% Al₂O₃ grade raises alumina content and crush strength over the standard economy ball while retaining its low cost per cubic metre. Typical duty is covering and supporting catalyst in vessels operating below 980°C — absorption towers, scrubbers, and the upper distribution layers of fixed-bed reactors.",
    density: "2.3 – 2.4 g/cm³",
    bulkDensity: "1.35 – 1.45 g/cm³",
    hardness: "≥ 7.0 Mohs",
    waterAbsorption: "< 0.5%",
    acidResistance: "≥ 99.4%",
    alkaliResistance: "≥ 85%",
    crushStrength: "80 kg (3mm) → 1500 kg (50mm)",
    maxTemp: "980 °C",
    voidage: "40 – 44%",
    sizes: "3, 6, 8, 10, 13, 16, 19, 25, 30, 38, 50, 60, 75 mm",
    standard: "HG/T 3683.1-2014",
    color: "#CBB48E",
    colorName: "Sandal Beige",
    chemicalComposition: [
      { element: "Al₂O₃", value: "23 – 30%" },
      { element: "Al₂O₃ + SiO₂", value: "> 92%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Absorption & scrubbing tower support",
      "Upper catalyst distribution layers",
      "Water treatment filter bed support",
      "Ethylene & propylene drying vessels",
      "General chemical processing beds"
    ],
    highlights: [
      "Higher crush strength than economy grade",
      "Water absorption below 0.5%",
      "Low cost per cubic metre of bed volume",
      "Consistent sizing for even flow distribution"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "inert-alumina-ceramic-balls-17-23",
    image: "products/inert-alumina-ceramic-balls-17-23.jpg",
    name: "Inert Alumina Ceramic Balls — 17–23% Al₂O₃",
    category: "inert-balls",
    grade: "17 – 23% Al₂O₃",
    material: "17 – 23% Alumina Silicate",
    materialType: "IA-23",
    shortDesc: "Standard-grade inert ceramic balls — the highest-volume bed support and tower packing media worldwide.",
    description: "The 17–23% Al₂O₃ inert ceramic ball is the industry baseline for catalyst bed support and tower packing. Fired from selected alumina-silicate clays into a dense, low-absorption body, it is chemically inert to acids, alkalis and organic solvents and holds full crush strength to 980°C. Supplied to HG/T 3683.1-2014 with tight sphericity and size tolerance for predictable bed voidage and pressure drop.",
    density: "2.3 – 2.4 g/cm³",
    bulkDensity: "1.30 – 1.40 g/cm³",
    hardness: "≥ 6.5 Mohs",
    waterAbsorption: "< 0.5%",
    acidResistance: "≥ 99.0%",
    alkaliResistance: "≥ 85%",
    crushStrength: "60 kg (3mm) → 1200 kg (50mm)",
    maxTemp: "980 °C",
    voidage: "40 – 44%",
    sizes: "3, 6, 8, 10, 13, 16, 19, 25, 30, 38, 50, 60, 75 mm",
    standard: "HG/T 3683.1-2014",
    color: "#D9C7A7",
    colorName: "Natural Sandal",
    chemicalComposition: [
      { element: "Al₂O₃", value: "17 – 23%" },
      { element: "Al₂O₃ + SiO₂", value: "> 93%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Catalyst bed support in fixed-bed reactors",
      "Ceramic tower packing support plates",
      "Absorption, scrubbing & drying towers",
      "Refinery & petrochemical vessels",
      "Water treatment filtration beds"
    ],
    highlights: [
      "Highest-volume, lowest-cost inert support grade",
      "Chemically inert to acid, alkali and solvents",
      "Tight sphericity — predictable bed voidage",
      "Manufactured to HG/T 3683.1-2014"
    ],
    featured: true,
    is3DModel: "sphere-gloss-white"
  },

  // ---------------------------------------------------------------------------
  // CATALYST BED SUPPORT & GRADING MEDIA
  // ---------------------------------------------------------------------------
  {
    id: "catalyst-bed-support-balls",
    image: "products/catalyst-bed-support-balls.jpg",
    name: "Catalyst Bed Support Balls",
    category: "bed-support",
    grade: "17 – 99% Al₂O₃ (graded)",
    material: "Graded Alumina Support Media",
    materialType: "CBS",
    shortDesc: "Engineered multi-layer support charge that carries the catalyst bed, distributes flow and protects reactor internals.",
    description: "Catalyst Bed Support Balls form the graded layers beneath and above an active catalyst charge. Their function is mechanical and hydraulic, not chemical: they carry the compressive load of the bed, spread feed uniformly across the reactor cross-section, prevent catalyst migration into outlet collectors, and hold the bed down against upward flow. Layers are graded from coarse at the support grid to fine at the catalyst interface, with alumina grade selected against the temperature and severity of each layer.",
    density: "2.3 – 3.6 g/cm³ (grade dependent)",
    bulkDensity: "1.30 – 2.20 g/cm³",
    hardness: "6.5 – 9.0 Mohs",
    waterAbsorption: "< 0.5 – 2.0%",
    acidResistance: "≥ 99.0 – 99.8%",
    alkaliResistance: "≥ 85 – 90%",
    crushStrength: "60 kg → 3400 kg (size & grade dependent)",
    maxTemp: "980 – 1650 °C",
    voidage: "38 – 44%",
    sizes: "3, 6, 10, 13, 19, 25, 38, 50, 75 mm graded layers",
    standard: "HG/T 3683.1-2014",
    color: "#EFE6D4",
    colorName: "Graded Ivory / Sandal",
    chemicalComposition: [
      { element: "Al₂O₃", value: "17 – 99% by layer" },
      { element: "Fe₂O₃", value: "< 1.0% (< 0.2% on HP-99)" },
      { element: "SiO₂ + Others", value: "Balance" }
    ],
    applications: [
      "Fixed-bed reactor top & bottom support layers",
      "Hydrotreater and hydrocracker bed grading",
      "Reformer outlet collector protection",
      "Ammonia, methanol & hydrogen plant reactors",
      "Adsorber and dryer vessel support charges"
    ],
    highlights: [
      "Layer-by-layer grading designed to your reactor drawing",
      "Prevents catalyst fines migration & channelling",
      "Distributes feed evenly — eliminates hot spots",
      "Full traceability and batch certification per layer"
    ],
    featured: true,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "perforated-ceramic-balls",
    image: "products/perforated-ceramic-balls.jpg",
    name: "Perforated (Open-Hole) Ceramic Balls",
    category: "bed-support",
    grade: "17 – 92% Al₂O₃",
    material: "Perforated Alumina Body",
    materialType: "PCB",
    shortDesc: "Through-drilled inert balls delivering far higher void fraction and markedly lower bed pressure drop.",
    description: "Perforated ceramic balls carry one or more through-holes that raise open area to 55–65% against the 38–44% of a solid ball. In outlet collector and support-grid duty this cuts bed pressure drop substantially, lowering compressor load and energy cost over a full run. The open geometry also resists plugging by scale and catalyst fines, extending run length between turnarounds.",
    density: "2.3 – 3.4 g/cm³",
    bulkDensity: "0.9 – 1.4 g/cm³",
    hardness: "≥ 6.5 Mohs",
    waterAbsorption: "< 0.5 – 2.0%",
    acidResistance: "≥ 99.0%",
    alkaliResistance: "≥ 85%",
    crushStrength: "Grade & wall-thickness dependent",
    maxTemp: "980 – 1580 °C",
    voidage: "55 – 65%",
    sizes: "13, 19, 25, 38, 50, 75 mm",
    standard: "HG/T 3683.1-2014",
    color: "#E0D2B8",
    colorName: "Open-Cell Sandal",
    chemicalComposition: [
      { element: "Al₂O₃", value: "17 – 92%" },
      { element: "Al₂O₃ + SiO₂", value: "> 93%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Reactor outlet collector zones",
      "Low pressure-drop support grids",
      "High gas-velocity reformer beds",
      "Fouling-prone heavy feed services",
      "Revamps targeting compressor energy reduction"
    ],
    highlights: [
      "Void fraction 55 – 65% versus 38 – 44% solid",
      "Cuts bed pressure drop and compressor duty",
      "Resists plugging by fines and scale",
      "Lower ceramic mass per m³ of reactor volume"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "catalyst-bed-grading-media",
    image: "products/catalyst-bed-grading-media.jpg",
    name: "Catalyst Bed Grading & Topping Media",
    category: "bed-support",
    grade: "92 – 99% Al₂O₃",
    material: "High-Alumina Grading Media",
    materialType: "CBG",
    shortDesc: "Fine-size topping layers that trap particulates and scale before they reach the active catalyst.",
    description: "Grading and topping media sit directly above the active catalyst as the final filtration stage of the bed. Sized between 3mm and 13mm, they capture iron scale, coke fines and corrosion particulates carried in with the feed, protecting the catalyst from surface fouling and pressure-drop build-up. High-alumina grades are used so the topping layer contributes no contaminant of its own.",
    density: "3.2 – 3.6 g/cm³",
    bulkDensity: "1.9 – 2.2 g/cm³",
    hardness: "≥ 7.5 Mohs",
    waterAbsorption: "< 0.5%",
    acidResistance: "≥ 99.7%",
    alkaliResistance: "≥ 88%",
    crushStrength: "180 kg (3mm) → 870 kg (13mm)",
    maxTemp: "1580 – 1650 °C",
    voidage: "38 – 41%",
    sizes: "3, 6, 8, 10, 13 mm",
    standard: "HG/T 3683.1-2014",
    color: "#F7F2E8",
    colorName: "High-Alumina Ivory",
    chemicalComposition: [
      { element: "Al₂O₃", value: "92 – 99%" },
      { element: "Fe₂O₃", value: "< 0.2 – 1.0%" },
      { element: "SiO₂ + Others", value: "Balance" }
    ],
    applications: [
      "Hydrotreater feed-side topping layers",
      "Particulate & scale trapping above catalyst",
      "Guard bed construction",
      "Heavy & dirty feed hydroprocessing",
      "Pressure-drop management in long-run units"
    ],
    highlights: [
      "Extends catalyst run length between turnarounds",
      "Traps iron scale and coke fines at the bed surface",
      "High-alumina body adds no contamination",
      "Custom size distribution per unit design"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "thermal-storage-regenerator-balls",
    image: "products/thermal-storage-regenerator-balls.jpg",
    name: "Thermal Storage & Regenerator Balls",
    category: "bed-support",
    grade: "75 – 99% Al₂O₃",
    material: "High Heat-Capacity Alumina",
    materialType: "TSR",
    shortDesc: "High heat-capacity alumina spheres for regenerative thermal oxidisers and heat-recovery beds.",
    description: "Regenerator balls store and release heat through repeated thermal cycles in RTO, RCO and hot blast stove service. Selection is driven by volumetric heat capacity and thermal shock resistance rather than chemical duty: the media must absorb combustion heat, release it into the incoming stream, and survive thousands of rapid cycles without spalling or attrition.",
    density: "2.6 – 3.6 g/cm³",
    bulkDensity: "1.6 – 2.2 g/cm³",
    hardness: "≥ 7.0 Mohs",
    waterAbsorption: "< 1.0%",
    acidResistance: "≥ 99.6%",
    alkaliResistance: "≥ 85%",
    crushStrength: "120 kg (3mm) → 3400 kg (50mm)",
    maxTemp: "1450 – 1650 °C",
    voidage: "38 – 43%",
    sizes: "10, 13, 19, 25, 38, 50 mm",
    standard: "HG/T 3683.1-2014",
    color: "#D9C7A7",
    colorName: "Kiln Sandal",
    chemicalComposition: [
      { element: "Al₂O₃", value: "75 – 99%" },
      { element: "Al₂O₃ + SiO₂", value: "> 93%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Regenerative thermal oxidisers (RTO / RCO)",
      "Hot blast stove checker beds",
      "Waste heat recovery vessels",
      "VOC abatement systems",
      "High-temperature gas preheaters"
    ],
    highlights: [
      "High volumetric heat capacity per m³ of bed",
      "Withstands thousands of rapid thermal cycles",
      "Low attrition — minimal bed top-up over life",
      "Available in solid and perforated geometry"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },

  // ---------------------------------------------------------------------------
  // CERAMIC TOWER PACKING
  // ---------------------------------------------------------------------------
  {
    id: "ceramic-raschig-rings",
    image: "products/ceramic-raschig-rings.jpg",
    name: "Ceramic Raschig Rings",
    category: "tower-packing",
    grade: "17 – 23% Al₂O₃",
    material: "Chemical Porcelain",
    materialType: "CRR",
    shortDesc: "Classic cylindrical random packing for acid absorption, scrubbing and drying towers.",
    description: "Ceramic Raschig Rings are open-ended cylinders of equal height and diameter, the longest-established random tower packing in chemical service. Their high chemical and thermal resistance suits sulphuric acid plants, nitric acid absorption and solvent recovery towers where metal and plastic packing would corrode or soften.",
    density: "2.3 – 2.4 g/cm³",
    bulkDensity: "0.6 – 0.9 g/cm³",
    hardness: "≥ 6.5 Mohs",
    waterAbsorption: "< 0.5%",
    acidResistance: "≥ 99.6%",
    alkaliResistance: "≥ 85%",
    crushStrength: "Size dependent",
    maxTemp: "1000 °C",
    voidage: "62 – 75%",
    sizes: "6, 10, 13, 16, 25, 38, 50, 76 mm",
    standard: "HG/T 3218",
    color: "#CBB48E",
    colorName: "Porcelain Sandal",
    chemicalComposition: [
      { element: "Al₂O₃", value: "17 – 23%" },
      { element: "SiO₂", value: "70 – 75%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Sulphuric & nitric acid absorption towers",
      "Gas scrubbing and washing columns",
      "Solvent recovery towers",
      "Drying and cooling towers",
      "Bed support beneath structured packing"
    ],
    highlights: [
      "Proven chemical porcelain corrosion resistance",
      "Service to 1000°C",
      "Wide size range from 6mm to 76mm",
      "Low cost per cubic metre of packed volume"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "ceramic-pall-rings",
    image: "products/ceramic-pall-rings.jpg",
    name: "Ceramic Pall Rings",
    category: "tower-packing",
    grade: "17 – 23% Al₂O₃",
    material: "Chemical Porcelain",
    materialType: "CPR",
    shortDesc: "Windowed ring packing delivering higher capacity and lower pressure drop than Raschig rings.",
    description: "Ceramic Pall Rings modify the Raschig geometry with punched windows and internal tongues that open the ring interior to flow. The result is roughly 50% more capacity and materially lower pressure drop at equal bed depth, with better liquid distribution and reduced wall channelling — the standard upgrade when debottlenecking an existing porcelain-packed column.",
    density: "2.3 – 2.4 g/cm³",
    bulkDensity: "0.5 – 0.8 g/cm³",
    hardness: "≥ 6.5 Mohs",
    waterAbsorption: "< 0.5%",
    acidResistance: "≥ 99.6%",
    alkaliResistance: "≥ 85%",
    crushStrength: "Size dependent",
    maxTemp: "1000 °C",
    voidage: "72 – 78%",
    sizes: "25, 38, 50, 76 mm",
    standard: "HG/T 3218",
    color: "#D9C7A7",
    colorName: "Natural Sandal",
    chemicalComposition: [
      { element: "Al₂O₃", value: "17 – 23%" },
      { element: "SiO₂", value: "70 – 75%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Absorption & desorption columns",
      "Distillation and stripping towers",
      "Flue gas desulphurisation scrubbers",
      "Column debottlenecking revamps",
      "Chemical and petrochemical washing towers"
    ],
    highlights: [
      "Around 50% higher capacity than Raschig rings",
      "Lower pressure drop at equal bed depth",
      "Improved liquid distribution, less channelling",
      "Direct drop-in replacement in existing columns"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "ceramic-intalox-saddles",
    image: "products/ceramic-intalox-saddles.jpg",
    name: "Ceramic Intalox Saddles",
    category: "tower-packing",
    grade: "17 – 23% Al₂O₃",
    material: "Chemical Porcelain",
    materialType: "CIS",
    shortDesc: "Saddle-geometry packing giving the highest mass transfer efficiency in the ceramic random range.",
    description: "Intalox Saddles use a curved saddle profile that cannot nest or interlock, producing a uniformly random bed with no blind pockets. Surface area per cubic metre and mass transfer efficiency are the highest of the ceramic random packings, making them the choice where separation performance governs the column design.",
    density: "2.3 – 2.4 g/cm³",
    bulkDensity: "0.5 – 0.8 g/cm³",
    hardness: "≥ 6.5 Mohs",
    waterAbsorption: "< 0.5%",
    acidResistance: "≥ 99.6%",
    alkaliResistance: "≥ 85%",
    crushStrength: "Size dependent",
    maxTemp: "1000 °C",
    voidage: "72 – 79%",
    sizes: "16, 25, 38, 50, 76 mm",
    standard: "HG/T 3218",
    color: "#E0D2B8",
    colorName: "Light Sandal",
    chemicalComposition: [
      { element: "Al₂O₃", value: "17 – 23%" },
      { element: "SiO₂", value: "70 – 75%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "High-efficiency absorption columns",
      "Drying towers in sulphuric acid plants",
      "Solvent and gas stripping units",
      "Chemical purification columns",
      "Separation-critical tower service"
    ],
    highlights: [
      "Highest mass transfer efficiency in ceramic range",
      "Non-nesting geometry — no blind pockets",
      "High surface area per cubic metre",
      "Uniform random bed with even flow"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "ceramic-cross-partition-rings",
    image: "products/ceramic-cross-partition-rings.jpg",
    name: "Ceramic Cross-Partition Rings",
    category: "tower-packing",
    grade: "17 – 23% Al₂O₃",
    material: "Chemical Porcelain",
    materialType: "CXP",
    shortDesc: "Heavy stacked packing forming the load-bearing bottom course of large packed columns.",
    description: "Cross-Partition Rings are large internally-ribbed cylinders laid by hand in a stacked pattern at the base of a packed tower. The internal cross bracing carries the compressive load of the random packing above while maintaining high open area, and the stacked arrangement gives an even flow field across the full column cross-section.",
    density: "2.3 – 2.4 g/cm³",
    bulkDensity: "0.6 – 0.8 g/cm³",
    hardness: "≥ 6.5 Mohs",
    waterAbsorption: "< 0.5%",
    acidResistance: "≥ 99.6%",
    alkaliResistance: "≥ 85%",
    crushStrength: "High — stacked load bearing",
    maxTemp: "1000 °C",
    voidage: "58 – 65%",
    sizes: "50, 76, 100, 125, 150 mm",
    standard: "HG/T 3218",
    color: "#CBB48E",
    colorName: "Sandal Beige",
    chemicalComposition: [
      { element: "Al₂O₃", value: "17 – 23%" },
      { element: "SiO₂", value: "70 – 75%" },
      { element: "Fe₂O₃", value: "< 1.0%" }
    ],
    applications: [
      "Bottom stacked course of packed towers",
      "Load-bearing layer under random packing",
      "Sulphuric acid drying & absorption towers",
      "Gas distribution zones",
      "Large-diameter absorption columns"
    ],
    highlights: [
      "Carries the full compressive load of the bed above",
      "Internal ribs maintain open area under load",
      "Hand-stacked for an even flow field",
      "Sizes to 150mm for large-diameter columns"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },

  // ---------------------------------------------------------------------------
  // ADSORBENTS & DESICCANTS
  // ---------------------------------------------------------------------------
  {
    id: "activated-alumina-balls",
    image: "products/activated-alumina-balls.jpg",
    name: "Activated Alumina Balls",
    category: "adsorbents",
    grade: "≥ 93% Al₂O₃",
    material: "Activated γ-Alumina",
    materialType: "AA",
    shortDesc: "High surface area γ-alumina desiccant for deep gas and liquid dehydration and defluoridation.",
    description: "Activated Alumina is a porous γ-phase alumina with a surface area of 300–350 m²/g, used as a regenerable desiccant and adsorbent. It dries compressed air and hydrocarbon gas streams to dewpoints below −70°C, removes fluoride from drinking water, and serves as a chloride and HCl guard in refinery service. It regenerates thermally at 180–250°C over hundreds of cycles.",
    density: "3.2 – 3.4 g/cm³",
    bulkDensity: "0.70 – 0.80 g/cm³",
    hardness: "Crush resistant, low attrition",
    waterAbsorption: "Static capacity ≥ 55% at 60% RH",
    acidResistance: "Stable in neutral & mildly acidic service",
    alkaliResistance: "Stable to pH 9",
    crushStrength: "≥ 130 N per ball (Ø 3 – 5mm)",
    maxTemp: "500 °C (regeneration 180 – 250 °C)",
    voidage: "Surface area 300 – 350 m²/g",
    sizes: "1–3, 3–5, 4–6, 5–8 mm spheres",
    standard: "HG/T 3927",
    color: "#F7F2E8",
    colorName: "Activated White",
    chemicalComposition: [
      { element: "Al₂O₃", value: "≥ 93%" },
      { element: "SiO₂", value: "≤ 0.3%" },
      { element: "Fe₂O₃", value: "≤ 0.06%" },
      { element: "Na₂O", value: "≤ 0.5%" }
    ],
    applications: [
      "Compressed air & instrument air drying",
      "Natural gas dehydration",
      "Water defluoridation",
      "HCl & chloride guard beds",
      "Hydrogen peroxide purification",
      "Transformer oil drying"
    ],
    highlights: [
      "Surface area 300 – 350 m²/g",
      "Dewpoint below −70°C achievable",
      "Thermally regenerable over hundreds of cycles",
      "Low attrition — long bed life"
    ],
    featured: true,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "molecular-sieve-3a-4a-5a",
    image: "products/molecular-sieve-3a-4a-5a.jpg",
    name: "Molecular Sieve 3A / 4A / 5A",
    category: "adsorbents",
    grade: "Type A Zeolite",
    material: "Crystalline Alumino-Silicate",
    materialType: "MS-A",
    shortDesc: "Precision pore-size zeolites separating molecules by diameter for drying and purification duty.",
    description: "Type A molecular sieves are crystalline alumino-silicates with a uniform pore aperture set by the exchange cation: 3Å (potassium) for drying unsaturated hydrocarbons and ethanol without co-adsorbing the product, 4Å (sodium) as a general-purpose desiccant, and 5Å (calcium) for n-paraffin separation and PSA oxygen generation. Selectivity is by molecular diameter, giving performance no bulk desiccant can match.",
    density: "2.0 – 2.1 g/cm³",
    bulkDensity: "0.62 – 0.72 g/cm³",
    hardness: "≥ 30 N crush (Ø 3mm)",
    waterAbsorption: "Static capacity ≥ 21 – 22 wt%",
    acidResistance: "Not for pH below 5",
    alkaliResistance: "Stable to pH 12",
    crushStrength: "≥ 30 N (Ø3mm), ≥ 60 N (Ø5mm)",
    maxTemp: "Regeneration 200 – 350 °C",
    voidage: "Pore aperture 3Å / 4Å / 5Å",
    sizes: "1.6 – 2.5, 3 – 5 mm beads; 1.6 & 3.2 mm pellets",
    standard: "HG/T 2524",
    color: "#EFE6D4",
    colorName: "Zeolite Ivory",
    chemicalComposition: [
      { element: "3A", value: "K₂O · Na₂O · Al₂O₃ · 2SiO₂" },
      { element: "4A", value: "Na₂O · Al₂O₃ · 2SiO₂" },
      { element: "5A", value: "CaO · Na₂O · Al₂O₃ · 2SiO₂" }
    ],
    applications: [
      "Ethanol & solvent dehydration (3A)",
      "Cracked gas & olefin drying (3A)",
      "Insulating glass & general drying (4A)",
      "PSA oxygen & hydrogen purification (5A)",
      "n-Paraffin separation (5A)",
      "Refrigerant and LPG drying"
    ],
    highlights: [
      "Separation by molecular diameter, not bulk affinity",
      "Water capacity above 21 wt%",
      "3A excludes hydrocarbons — no coking on olefins",
      "Fully regenerable at 200 – 350°C"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "molecular-sieve-13x",
    image: "products/molecular-sieve-13x.jpg",
    name: "Molecular Sieve 13X & 13X APG",
    category: "adsorbents",
    grade: "Type X Zeolite",
    material: "Crystalline Alumino-Silicate",
    materialType: "MS-13X",
    shortDesc: "Large-pore 10Å zeolite for air pre-purification, CO₂ removal and deep desulphurisation.",
    description: "13X molecular sieve carries a 10Å pore aperture — the largest in common industrial use — admitting molecules that Type A sieves exclude. It is the standard adsorbent for cryogenic air separation pre-purification units, removing CO₂ and moisture ahead of the cold box, and for mercaptan and H₂S removal from natural gas and LPG. The APG variant is optimised specifically for air pre-purification duty.",
    density: "2.0 – 2.1 g/cm³",
    bulkDensity: "0.61 – 0.69 g/cm³",
    hardness: "≥ 30 N crush (Ø 3mm)",
    waterAbsorption: "Static capacity ≥ 24 – 26 wt%",
    acidResistance: "Not for pH below 5",
    alkaliResistance: "Stable to pH 12",
    crushStrength: "≥ 30 N (Ø3mm), ≥ 70 N (Ø5mm)",
    maxTemp: "Regeneration 250 – 350 °C",
    voidage: "Pore aperture 10Å",
    sizes: "1.6 – 2.5, 3 – 5 mm beads; 1.6 & 3.2 mm pellets",
    standard: "HG/T 2525",
    color: "#FFFFFF",
    colorName: "Sieve White",
    chemicalComposition: [
      { element: "Na₂O", value: "Structural" },
      { element: "Al₂O₃", value: "Structural" },
      { element: "SiO₂", value: "2.8 · Al₂O₃ ratio" }
    ],
    applications: [
      "Cryogenic air separation pre-purification",
      "CO₂ removal ahead of cold boxes",
      "Natural gas & LPG sweetening",
      "Mercaptan and H₂S removal",
      "Medical & PSA oxygen concentrators",
      "Nitrogen generation systems"
    ],
    highlights: [
      "10Å pore — largest common industrial aperture",
      "Water capacity to 26 wt%",
      "Simultaneous CO₂ and moisture removal",
      "APG grade tuned for air pre-purification units"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "ceramic-honeycomb-heat-exchanger",
    image: "products/ceramic-honeycomb-heat-exchanger.jpg",
    name: "Ceramic Honeycomb Media",
    category: "adsorbents",
    grade: "Cordierite / Mullite / Corundum",
    material: "Extruded Honeycomb Ceramic",
    materialType: "CHM",
    shortDesc: "Extruded honeycomb blocks giving very high geometric surface area at minimal pressure drop.",
    description: "Ceramic honeycomb media are extruded monolith blocks with parallel straight channels, providing very high geometric surface area per cubic metre with almost no flow resistance. Cordierite grades give exceptional thermal shock resistance for RTO heat recovery; mullite and corundum grades extend the service ceiling for high-temperature catalyst carrier and flue gas treatment duty.",
    density: "2.3 – 2.7 g/cm³",
    bulkDensity: "0.45 – 0.75 g/cm³",
    hardness: "Thermal shock resistant body",
    waterAbsorption: "< 1.0%",
    acidResistance: "≥ 95%",
    alkaliResistance: "≥ 85%",
    crushStrength: "≥ 3 MPa axial",
    maxTemp: "1200 – 1650 °C",
    voidage: "65 – 75% open frontal area",
    sizes: "150×150, 150×300 mm blocks; 25 – 100 cells/in²",
    standard: "Cordierite / Mullite / Corundum grades",
    color: "#D9C7A7",
    colorName: "Cordierite Sandal",
    chemicalComposition: [
      { element: "Al₂O₃", value: "35 – 90% by grade" },
      { element: "SiO₂", value: "Balance" },
      { element: "MgO", value: "Cordierite phase" }
    ],
    applications: [
      "RTO & RCO heat recovery blocks",
      "SCR / SNCR catalyst carriers",
      "Flue gas treatment monoliths",
      "Industrial furnace heat exchangers",
      "VOC abatement systems"
    ],
    highlights: [
      "Very high surface area at near-zero pressure drop",
      "Cordierite grade survives severe thermal cycling",
      "Cell density selectable from 25 to 100 cpsi",
      "Direct replacement for saddle-packed RTO beds"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },

  // ---------------------------------------------------------------------------
  // CATALYSTS & GUARD BEDS
  // ---------------------------------------------------------------------------
  {
    id: "claus-catalyst-sru",
    image: "products/claus-catalyst-sru.jpg",
    name: "Claus Catalyst — Sulphur Recovery Units",
    category: "catalysts",
    grade: "Activated Alumina / Ti-promoted",
    material: "γ-Alumina & Titania Based",
    materialType: "SRU-CL",
    shortDesc: "Alumina and titania Claus catalysts converting H₂S and SO₂ to elemental sulphur in SRU converters.",
    description: "Claus catalysts drive the reaction of H₂S with SO₂ to elemental sulphur across the converter train of a Sulphur Recovery Unit. The standard activated-alumina grade carries high surface area and pore volume for the first and second converters, while the titania-promoted grade is used where COS and CS₂ hydrolysis governs overall recovery — typically the first converter on amine and sour water stripper feeds. Both are supplied with the oxygen-scavenging protective grade for the bottom layer.",
    density: "3.2 – 3.4 g/cm³",
    bulkDensity: "0.65 – 0.75 g/cm³ (alumina) / 0.95 – 1.05 (Ti)",
    hardness: "Attrition loss < 0.5%",
    waterAbsorption: "Pore volume 0.40 – 0.50 ml/g",
    acidResistance: "Stable in H₂S / SO₂ service",
    alkaliResistance: "Not applicable",
    crushStrength: "≥ 150 N (alumina), ≥ 100 N (titania)",
    maxTemp: "200 – 340 °C operating",
    voidage: "Surface area 300 – 340 m²/g",
    sizes: "3 – 6 mm spheres; 4 mm extrudates",
    standard: "Claus converter service",
    color: "#F7F2E8",
    colorName: "Alumina White",
    chemicalComposition: [
      { element: "Al₂O₃", value: "≥ 93% (standard grade)" },
      { element: "TiO₂", value: "≥ 85% (Ti grade)" },
      { element: "Na₂O", value: "≤ 0.35%" }
    ],
    applications: [
      "Claus converter beds 1, 2 and 3",
      "COS & CS₂ hydrolysis duty",
      "Refinery sulphur recovery units",
      "Gas plant SRU trains",
      "Tail gas treatment units"
    ],
    highlights: [
      "Raises overall sulphur recovery efficiency",
      "Titania grade maximises COS / CS₂ conversion",
      "High resistance to sulphation ageing",
      "Protective oxygen-scavenging bottom layer available"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "hydrotreating-catalysts",
    image: "products/hydrotreating-catalysts.jpg",
    name: "Hydrotreating Catalysts — CoMo / NiMo",
    category: "catalysts",
    grade: "CoMo · NiMo · NiW",
    material: "Alumina-Supported Metal Oxides",
    materialType: "HDT",
    shortDesc: "Cobalt- and nickel-molybdenum catalysts for desulphurisation, denitrogenation and saturation duty.",
    description: "Hydrotreating catalysts remove sulphur, nitrogen and metals from refinery streams over an alumina support carrying cobalt- or nickel-molybdenum active phases. CoMo grades favour hydrodesulphurisation at lower hydrogen consumption; NiMo grades are selected where denitrogenation and aromatic saturation govern. Supplied for naphtha, kerosene, diesel and coker feed service, with matched guard and grading layers.",
    density: "3.2 – 3.6 g/cm³",
    bulkDensity: "0.65 – 0.85 g/cm³",
    hardness: "Attrition loss < 1.0%",
    waterAbsorption: "Pore volume 0.45 – 0.65 ml/g",
    acidResistance: "Stable under hydrogen partial pressure",
    alkaliResistance: "Not applicable",
    crushStrength: "≥ 15 N/mm side crush",
    maxTemp: "320 – 400 °C operating",
    voidage: "Surface area 180 – 280 m²/g",
    sizes: "1.3, 1.6, 2.5 mm tri-lobe & quadra-lobe extrudates",
    standard: "Refinery hydroprocessing service",
    color: "#EFE6D4",
    colorName: "Extrudate Ivory",
    chemicalComposition: [
      { element: "MoO₃", value: "14 – 24%" },
      { element: "CoO / NiO", value: "3 – 6%" },
      { element: "Al₂O₃", value: "Balance (support)" }
    ],
    applications: [
      "Naphtha hydrotreating",
      "Coker naphtha & gasoil hydrotreating",
      "Diesel hydrodesulphurisation (ULSD)",
      "Kerosene sweetening",
      "Feed pre-treatment ahead of reforming"
    ],
    highlights: [
      "CoMo and NiMo grades for HDS or HDN duty",
      "Shaped extrudates lower bed pressure drop",
      "Matched guard and grading layers supplied",
      "In-situ or ex-situ pre-sulphiding available"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "reforming-catalysts",
    image: "products/reforming-catalysts.jpg",
    name: "Reforming Catalysts — Nickel Based",
    category: "catalysts",
    grade: "Ni / Al₂O₃ · CaAl₂O₄",
    material: "Nickel on Alumina Carrier",
    materialType: "REF-Ni",
    shortDesc: "Nickel steam reforming catalysts for hydrogen generation, ammonia decomposition and DRI plants.",
    description: "Nickel-based reforming catalysts convert light hydrocarbons and steam into synthesis gas across primary and secondary reformer tubes. Shaped as multi-hole rings or cylinders to maximise geometric surface area while holding tube pressure drop down, they are supplied on alumina and calcium-aluminate carriers matched to the thermal and mechanical duty of the tube. Grades cover hydrogen generation units, ammonia plants and direct reduced iron reformers.",
    density: "3.0 – 3.5 g/cm³",
    bulkDensity: "0.90 – 1.15 g/cm³",
    hardness: "Attrition loss < 1.0%",
    waterAbsorption: "Pore volume 0.20 – 0.30 ml/g",
    acidResistance: "Stable in steam / hydrocarbon service",
    alkaliResistance: "Alkali-promoted grades available",
    crushStrength: "≥ 250 N per piece",
    maxTemp: "800 – 950 °C operating",
    voidage: "Surface area 10 – 25 m²/g",
    sizes: "4-hole & 7-hole rings, 16 – 19 mm",
    standard: "Steam reforming service",
    color: "#E0D2B8",
    colorName: "Reformer Sandal",
    chemicalComposition: [
      { element: "NiO", value: "12 – 20%" },
      { element: "Al₂O₃ / CaAl₂O₄", value: "Balance (carrier)" },
      { element: "K₂O", value: "Promoted grades only" }
    ],
    applications: [
      "Hydrogen generation units (HGU)",
      "Ammonia plant primary & secondary reformers",
      "Methanol synthesis gas production",
      "Direct reduced iron (DRI) reformers",
      "Ammonia decomposition units"
    ],
    highlights: [
      "Multi-hole geometry maximises active surface",
      "Low tube pressure drop protects reformer life",
      "Alkali-promoted grades resist carbon laydown",
      "Carrier matched to tube skin temperature"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "chloride-guard-adsorbent",
    image: "products/chloride-guard-adsorbent.jpg",
    name: "Chloride Guard Adsorbents",
    category: "catalysts",
    grade: "Promoted Alumina",
    material: "Alkali-Promoted Activated Alumina",
    materialType: "CL-GD",
    shortDesc: "High-capacity chloride scavengers protecting downstream catalyst and equipment from HCl attack.",
    description: "Chloride guards capture HCl and organic chlorides carried out of catalytic reforming and isomerisation units, where breakthrough causes ammonium chloride salting, exchanger fouling and stress corrosion cracking of downstream metallurgy. The promoted alumina body chemisorbs chloride irreversibly at high capacity, operating dry across a wide temperature band without regeneration.",
    density: "3.2 – 3.4 g/cm³",
    bulkDensity: "0.75 – 0.90 g/cm³",
    hardness: "Attrition loss < 0.5%",
    waterAbsorption: "Chloride capacity 18 – 25 wt%",
    acidResistance: "Purpose-built for HCl service",
    alkaliResistance: "Alkali-promoted body",
    crushStrength: "≥ 130 N per ball",
    maxTemp: "40 – 400 °C operating",
    voidage: "Surface area 200 – 300 m²/g",
    sizes: "3 – 5 mm spheres; 3.2 mm extrudates",
    standard: "Refinery guard bed service",
    color: "#F7F2E8",
    colorName: "Guard White",
    chemicalComposition: [
      { element: "Al₂O₃", value: "≥ 90%" },
      { element: "Na₂O / promoter", value: "5 – 10%" },
      { element: "SiO₂", value: "≤ 0.3%" }
    ],
    applications: [
      "Catalytic reformer net gas & liquid guards",
      "Isomerisation unit chloride removal",
      "CCR platformer downstream protection",
      "Hydrogen recycle stream purification",
      "Ammonium chloride salting prevention"
    ],
    highlights: [
      "Chloride capacity 18 – 25 wt%",
      "Irreversible chemisorption — no breakthrough creep",
      "Prevents exchanger salting and fouling",
      "Available in vapour and liquid phase grades"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },
  {
    id: "sulphur-guard-adsorbent",
    image: "products/sulphur-guard-adsorbent.jpg",
    name: "Sulphur Guard Adsorbents",
    category: "catalysts",
    grade: "ZnO / Cu-promoted",
    material: "Zinc Oxide & Copper Based",
    materialType: "S-GD",
    shortDesc: "Zinc oxide and copper guards removing trace H₂S and mercaptans that poison downstream catalyst.",
    description: "Sulphur guards protect sulphur-sensitive catalysts — reforming, methanation, methanol and ammonia synthesis — by removing trace H₂S, COS and mercaptans down to sub-ppm levels. Zinc oxide grades chemisorb H₂S to zinc sulphide at high capacity in hot service; copper-promoted grades extend removal to ambient and low-temperature duty where ZnO kinetics fall away.",
    density: "4.8 – 5.2 g/cm³",
    bulkDensity: "1.10 – 1.35 g/cm³",
    hardness: "Attrition loss < 1.0%",
    waterAbsorption: "Sulphur capacity 25 – 35 wt%",
    acidResistance: "Purpose-built for H₂S service",
    alkaliResistance: "Not applicable",
    crushStrength: "≥ 60 N per piece",
    maxTemp: "200 – 400 °C (ZnO) / ambient – 200 °C (Cu)",
    voidage: "Surface area 30 – 60 m²/g",
    sizes: "3.2, 4.0 mm extrudates; 4 – 6 mm spheres",
    standard: "Guard bed service",
    color: "#CBB48E",
    colorName: "Zinc Oxide Tan",
    chemicalComposition: [
      { element: "ZnO", value: "≥ 90% (ZnO grade)" },
      { element: "CuO", value: "40 – 55% (Cu grade)" },
      { element: "Al₂O₃", value: "Balance (binder)" }
    ],
    applications: [
      "Feed desulphurisation ahead of reformers",
      "Ammonia & methanol synthesis gas polishing",
      "Natural gas trace sulphur removal",
      "Hydrogen plant guard beds",
      "Protection of noble-metal catalyst charges"
    ],
    highlights: [
      "Sulphur pickup capacity 25 – 35 wt%",
      "Reduces H₂S to sub-ppm outlet levels",
      "ZnO for hot duty, Cu-promoted for cold duty",
      "Protects high-value downstream catalyst charges"
    ],
    featured: false,
    is3DModel: "sphere-gloss-white"
  },

  // ---------------------------------------------------------------------------
  // HIGH PERFORMANCE GRADES — specs from HPCBSM SPEC.pdf and the
  // "High Performance Inert Ceramic Ball" specification document.
  // ---------------------------------------------------------------------------
  {
    id: "high-performance-catalyst-bed-support-media",
    image: "products/high-performance-catalyst-bed-support-media.jpg",
    name: "High Performance Catalyst Bed Support Media",
    category: "bed-support",
    grade: "20 – 26% Al₂O₃",
    material: "Alumina-Silicate Bed Support Body",
    materialType: "HPCBSM",
    shortDesc: "Engineered bed support media for moderate-temperature reactors, held to low leachable iron for clean service.",
    description: "High Performance Catalyst Bed Support Media is formed from a controlled alumina-silicate body and fired to a closed-pore structure with apparent porosity below 1% and water absorption held to 0.4% maximum. Leachable iron is held below 0.1%, which keeps the support layer from contributing iron to the process stream in service. Working temperature is 1000°C with a thermal expansion coefficient of 4.7 × 10⁻⁶/K, giving stable dimensional behaviour through reactor thermal cycling. Supplied graded for even flow distribution and low bed pressure drop.",
    density: "2.3 g/cm³",
    bulkDensity: "1.35 Kg/L",
    hardness: "≥ 7.0 Mohs",
    waterAbsorption: "0.4% Max",
    acidResistance: "≥ 96%",
    crushStrength: "25 kg (3mm) → 430 kg (19mm)",
    maxTemp: "1000 °C",
    voidage: "40 – 42%",
    sizes: "3, 6, 12, 19 mm",
    standard: "Platinaa HPCBSM specification",
    color: "#E8E2D4",
    colorName: "Alumina Buff",
    chemicalComposition: [
      { element: "Al₂O₃", value: "20 – 26%" },
      { element: "SiO₂", value: "65 – 72%" },
      { element: "Leachable Fe", value: "< 0.1%" }
    ],
    applications: [
      "Catalyst bed support in moderate-temperature reactors",
      "Tower packing support grids",
      "Gas treatment and drying vessels",
      "Hydrocarbon processing guard layers"
    ],
    highlights: [
      "Leachable iron held below 0.1%",
      "Water absorption 0.4% maximum — closed pore body",
      "Apparent porosity below 1%",
      "Roundness dₘₐₓ/dₘᵢₙ under 1.25 for even packing"
    ],
    featured: false,
    is3DModel: "sphere-buff"
  },
  {
    id: "high-performance-inert-ceramic-ball",
    image: "products/high-performance-inert-ceramic-ball.jpg",
    name: "High Performance Inert Ceramic Ball",
    category: "inert-balls",
    grade: "17 – 35% Al₂O₃",
    material: "Inert Alumina-Silicate Ceramic",
    materialType: "HPICB",
    shortDesc: "Standard-duty inert ceramic ball for tower packing and bed support at moderate temperature, with high acid resistance.",
    description: "High Performance Inert Ceramic Ball is the standard-duty grade of the Platinaa range, formed from an alumina-silicate body carrying 17–35% Al₂O₃ with Al₂O₃ + SiO₂ at or above 92%. Acid resistance exceeds 98% and alkali resistance exceeds 80%, making it suitable for the majority of tower packing and bed support duties where the process does not demand a high-purity corundum body. Operating temperature exceeds 980°C with spalling resistance above 300°C, and compressive strength exceeds 2.5 kN per pellet.",
    density: "2.3 – 2.4 g/cm³",
    bulkDensity: "1.30 – 1.40 Kg/L",
    hardness: "6.5 Mohs",
    waterAbsorption: "> 3%",
    acidResistance: "> 98%",
    alkaliResistance: "> 80%",
    crushStrength: "> 2.5 kN / pellet",
    maxTemp: "> 980 °C",
    voidage: "40 – 42%",
    sizes: "3, 6, 13, 19, 25, 38, 50 mm",
    standard: "Platinaa HPICB specification",
    color: "#DCCFB8",
    colorName: "Standard Buff",
    chemicalComposition: [
      { element: "Al₂O₃", value: "17 – 35%" },
      { element: "Al₂O₃ + SiO₂", value: "≥ 92%" },
      { element: "Fe₂O₃", value: "< 1%" }
    ],
    applications: [
      "Tower packing support layers",
      "Catalyst bed covering and topping",
      "Drying and absorption towers",
      "General bed support in refining and petrochemical service"
    ],
    highlights: [
      "Acid resistance above 98%",
      "Spalling resistance above 300°C",
      "Compressive strength above 2.5 kN per pellet",
      "Economical fill for large-volume bed duties"
    ],
    featured: false,
    is3DModel: "sphere-buff"
  }
];
