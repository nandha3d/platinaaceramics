export const companyInfo = {
  name: "Platinaa Ceramics",
  legalName: "PLATINAA INDUSTRIAL CERAMICS PVT LTD",
  shortName: "Platinaa",
  tagline: "Inert Alumina Ceramic Balls & Catalyst Bed Support Media",
  subTagline: "High-Purity Inert Alumina Ceramic Balls, Catalyst Bed Support Balls, Ceramic Tower Packing, Adsorbents & Guard Beds for Refining, Petrochemical, Fertilizer and Gas Processing",
  foundedLocation: "Erode, Tamil Nadu, India",
  phone: "+91 424 351 0101",
  mobile: "+91 93603 40963",
  email: "info@platinaaceramics.com",
  whatsapp: "+919360340963",
  website: "https://platinaaceramics.com/",
  address: {
    street: "3/2, Kumalankuttai Road, Opp GHS School",
    locality: "Kumalankuttai",
    city: "Erode",
    state: "Tamil Nadu",
    pincode: "638011",
    country: "India",
    full: "PLATINAA INDUSTRIAL CERAMICS PVT LTD, 3/2, Kumalankuttai Road, Opp GHS School, Kumalankuttai, Erode Dist. - 638011, Tamil Nadu, India"
  },
  certifications: [
    {
      title: "ISO 9001 Certified",
      subtitle: "Quality Management System",
      description: "Quality control at every stage — raw alumina selection, forming, sintering and final inspection of every batch of inert ceramic balls and bed support media against HG/T 3683.1-2014.",
      policy: "Platinaa Industrial Ceramics is committed to supplying inert ceramic media of consistent chemistry, sphericity and crush strength, with full batch traceability and certification on every consignment."
    }
  ],
  /*
   * Home-page introduction, supplied by the client.
   *
   * Kept close to the original wording. Only unambiguous errors were corrected —
   * "northen" -> "northern", "our self" -> "ourselves", "paint& printing" ->
   * "paint & printing" — plus unbalanced quotation marks that opened and never
   * closed. Nothing about the company's claims or positioning was changed.
   *
   * NOTE: the source copy names the company three ways — "M/S Platinum
   * Ceramics", "Platinum enterprises", and the heading "Platinaa Industrial
   * Ceramics" — while the ISO certificate reads "PLATINAA INDUSTRIAL CERAMICS
   * PRIVATE LIMITED" and the rest of this site uses "Platinaa Ceramics". Left as
   * written because it is the client's own copy, but it needs a decision.
   */
  homeIntro: [
    "It gives us immense pleasure to introduce ourselves, M/S Platinum Ceramics. As an organization, we are based in the northern part of Tamil Nadu — Namakkal & Erode. Platinum Ceramics diversified its operations into the field of industrial ceramics. The company, with assertive objectives and inclination, is set on becoming a milestone company in the industrial ceramic industry.",
    "In a short span of time since its inception, Platinum enterprises with its commitment has earned itself the respect and title to be well known in the paint & printing ink industry as a responsible and reputable organization with international business standards and excellent marketing strategy. This very spirit of innovation & up-gradation has enabled us to improve our aesthetic appeal and the affordability of our products, sales and of course our increase in market shares.",
    "We look forward to reaching more consumers across the country. We are firmly committed to introducing new products and to achieving excellence in industrial standards.",
    "We have a team of highly qualified sales professionals. This team ensures promotion of each & every product. Our journey continues with greater confidence — it is our mission to reach."
  ],

  /*
   * Scanned credentials shown on the home page. `src` paths are under
   * public/certificates/. The carousel degrades to a labelled placeholder if a
   * file is missing, so a failed or pending upload never breaks the page.
   */
  credentials: [
    {
      id: 'quality-policy',
      src: 'certificates/quality-policy.jpg',
      title: 'Quality Policy',
      issuer: 'Platinaa Industrial Ceramics Pvt Ltd',
      meta: 'Signed by the Director · 13-11-2020',
      note: 'Total customer satisfaction through understanding every requirement accurately, and continual improvement of the quality management system.'
    },
    {
      id: 'iso-9001',
      src: 'certificates/iso-9001-2015.jpg',
      title: 'ISO 9001:2015',
      issuer: 'Otabu Certification Pvt Ltd · Cert. 1127Q96720',
      meta: 'Certified 27 November 2020 · IAF / EGAC accredited',
      note: 'Manufacture of ceramic grinding, deburring and polishing media (steatite, alumina, zirconium), lining bricks and inert balls of various sizes.'
    }
  ],

  /*
   * Client logos, carried over from the company's existing site, which listed
   * these two. Add more here and the marquee picks them up with no code change.
   * Only name real customers — a fabricated client list is a legal problem, not
   * a design one.
   */
  clients: [
    { name: 'Berger Paints', logo: 'clients/berger-paints.png' },
    { name: 'Shalimar Paints', logo: 'clients/shalimar-paints.png' }
  ],

  aboutText: [
    "Platinaa Industrial Ceramics manufactures inert alumina ceramic balls and catalyst bed support media for the refining, petrochemical, fertilizer and gas processing industries. Our works at Erode, Tamil Nadu produce the full alumina range, from the 17–23% Al₂O₃ standard grade through to high-purity 99% α-alumina.",
    "Bed support is a mechanical and hydraulic duty, not a chemical one. Our media carries the compressive load of the catalyst charge, distributes feed evenly across the reactor cross-section, prevents catalyst migration into outlet collectors, and does all of it without contributing iron, silica or alkali contamination to the process stream.",
    "Every consignment is manufactured to HG/T 3683.1-2014 and supplied with batch certification covering chemistry, bulk density, water absorption, acid resistance and crush strength. Layer-by-layer grading schedules are prepared against your reactor drawing and operating conditions."
  ],
  stats: [
    { label: "Alumina Range", value: "17% – 99% Al₂O₃" },
    { label: "Ball Size Range", value: "3 mm – 75 mm" },
    { label: "Max Service Temperature", value: "1650 °C" },
    { label: "Manufacturing Standard", value: "HG/T 3683.1-2014" }
  ]
};
