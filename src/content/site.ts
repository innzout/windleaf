export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Technology', to: '/ai-automation-robotics' },
  { label: 'How We Work', to: '/how-we-work' },
  { label: 'Contact', to: '/contact' },
]

/**
 * Background video for the home hero, served from `public/`.
 *
 * Drop the file in as `public/hero.mp4` (H.264/AAC, muted, ~10-20s seamless
 * loop, 1920x1080 or 1280x720). Until it exists the hero falls back to the
 * still photograph underneath, so nothing breaks. Set to `null` to force the
 * still image.
 */
export const HERO_VIDEO: string | null = '/hero.mp4'

/**
 * The founder, written once.
 *
 * Name, role and the one-line credential appear on `/about`, in the footer, in
 * the contact aside and in the Organization JSON-LD. They used to be typed out
 * at each site, which is how `/about` ended up carrying a different form of the
 * name from everywhere else.
 */
export const FOUNDER = {
  name: 'Muruga Ganesh Kasi Rajan',
  role: 'Founder & CEO',
  // Held apart from `role` rather than joined with a pipe. At the weight the
  // designation renders, "|" reads as a capital I — "Founder & CEO I
  // Independent Wind Turbine Blade Engineering" — and the two halves are
  // different things anyway: one is a job title, one is a field of practice.
  specialism: 'Independent Wind Turbine Blade Engineering & Consulting',
  photo: '/founder-k-muruga-ganesh.png',
  years: 17,
  linkedin: 'https://www.linkedin.com/in/muruga-ganesh-kasirajan-b4aa9715/',
}

/** Flattened form, for alt text and structured data — not for display. */
export const FOUNDER_TITLE = `${FOUNDER.role} — ${FOUNDER.specialism}`

/**
 * Contact details, written once.
 *
 * `phoneHref` is kept beside `phone` rather than derived at each call site —
 * every consumer was stripping whitespace with its own regex. The address is
 * held as parts because JSON-LD needs `PostalAddress` fields, the footer needs
 * line breaks, and the contact page needs one flat string.
 */
export const CONTACT = {
  email: 'mg@windleafenergy.com',
  phone: '+91 7904724895',
  phoneHref: '+917904724895',
  address: {
    lines: ['No. 308, 13th Cross Street', 'Casagrand Arena, Vallakottai'],
    locality: 'Oragadam, Chennai',
    region: 'Tamil Nadu',
    postalCode: '602105',
    country: 'IN',
  },
}

export const CONTACT_ADDRESS_TEXT = [
  ...CONTACT.address.lines,
  `${CONTACT.address.locality} – ${CONTACT.address.postalCode}`,
].join(', ')

/**
 * Blade manufacturers behind the founder's manufacturing experience.
 *
 * **Not a client list** — `OEM_DISCLAIMER` must travel with this wherever the
 * full roll is shown. One array rather than a sentence retyped per page: it was
 * spelled out by hand in three places and two of them had already gone stale,
 * missing SANY and WinWind.
 */
export const OEMS = [
  'Suzlon',
  'Vestas',
  'SANY',
  'WinWind',
  'Nordex',
  'Goldwind',
  'GE',
  'Siemens Gamesa',
  'RE Technologies',
  'Envision',
]

export const OEM_LIST_TEXT = OEMS.join(' · ')

export const OEM_DISCLAIMER =
  'These companies reflect our professional experience, not a client list.'

// Events moved to `lib/events.ts`, configured by the NEXT_PUBLIC_EVENTS
// environment variable. They have a shelf life and the rest of this file does
// not, so taking a finished show down should not need a code change.

// NOTE: STATS and SIX_REASONS are defined further down, after COUNTRIES, so
// they can derive the country count instead of repeating a literal.

export const EXPERIENCE = [
  {
    title: 'OEM & Manufacturing Experience',
    body: OEM_LIST_TEXT,
  },
  {
    title: 'Independent Engineering Experience',
    body: 'DNV GL — Blade Engineering and quality, Inspection & Manufacturing Audits',
  },
  {
    title: 'IPP Experience',
    body: 'TotalEnergies acts as a massive Independent Power Producer (IPP), though it is officially classified as a global integrated multi-energy company',
  },
]

export const WHAT_WE_DO = [
  {
    title: 'Blade Engineering',
    body: 'comprehensive control of materials, manufacturing processes, composite laminates, bonding, dimensions, visual condition, NDT, repairs, documentation, traceability, and final inspection to ensure every component consistently meets specified quality, safety, reliability, and customer requirements.',
  },
  {
    title: 'Quality, Inspection & Assurance',
    body: 'Quality, Inspection & Assurance encompasses comprehensive control of materials, manufacturing processes, composite laminates, bonding, dimensions, visual condition, NDT, repairs, documentation, traceability, and final inspection to ensure every component consistently meets specified quality, safety, reliability, and customer requirements.',
  },
  {
    title: 'Technical Due Diligence & Advisory',
    body: 'Technical Due Diligence (TDD) provides an independent assessment of wind turbine blades, covering design, condition, defects, repairs, structural integrity, performance, remaining life, and technical risks to support informed investment and asset-management decisions.',
  },
]


export const TECH_FLOW = [
  {
    num: '01',
    title: 'Wind Turbine Blade',
    body: 'Operational wind assets & manufacturing lifecycle',
    kind: 'capture' as const,
  },
  {
    num: '02',
    title: 'Inspection & Data',
    body: 'Visual • NDT • Robotics ( Lukan Wind Robotics, DK ) • Field Data',
    kind: 'capture' as const,
  },
  {
    num: '03',
    title: 'Engineering Analysis',
    body: 'Structutal ( Design Engineering by Apex Wind ApS Denmark FEA)',
    kind: 'capture' as const,
  },
  {
    num: '04',
    title: 'Technical Assessment',
    body: 'Risk • Root Cause • Integrity • Performance',
    kind: 'capture' as const,
  },
  {
    num: '05',
    title: 'Windleaf Engineering',
    body: 'Independent Engineering Judgement',
    kind: 'verify' as const,
  },
  {
    num: '06',
    title: 'Engineering Solution',
    body: 'Repair • Corrective Action • Life Extension • Recommendation',
    kind: 'verify' as const,
  },
]

/**
 * European technology and engineering collaborations.
 *
 * Two separate companies with two separate remits. They used to be one reason
 * card whose body ran "…validation and FEA.\nLUKAN WIND ROBOTICS — Denmark\n
 * Robotic Blade Inspection & AI Analysis" — the newlines collapse in HTML, so
 * it rendered as a single paragraph in which the second company's name read as
 * part of the first one's sentence.
 *
 * Declared above COUNTRIES because the Denmark entry reads from it: these are
 * current collaborations, distinct from the historic Vestas work that fills the
 * rest of that card, and the partner names must not be typed out twice.
 */
export const ALLIANCES = [
  {
    name: 'APEX WIND ApS',
    country: 'Denmark',
    iso: 'DK',
    focus: 'European Design Collaboration',
    detail: ['Design support', 'Technical Review', 'Validation', 'FEA'],
  },
  {
    name: 'LUKAN WIND ROBOTICS',
    country: 'Denmark',
    iso: 'DK',
    focus: 'Robotic Inside-Blade Inspection',
    detail: ['Robotic inspection', 'Advanced imaging', 'AI-assisted analysis'],
  },
]

export type Region = 'Asia-Pacific' | 'Europe' | 'Americas' | 'Middle East & Africa'

export type Country = {
  name: string

  /** Real-world geographic coordinates, used to place markers on the 3D globe. */
  lat: number
  lon: number

  flag: string
  region: Region

  isHq?: boolean
  isAlliance?: boolean
  hubType?: string
  card: string[]
  capabilities: {
    title: string
    detail: string
  }[]
}

export const COUNTRIES: Country[] = [
  {
    name: 'India',
    lat: 13.0827,
    lon: 80.2707,
    isHq: true,
    flag: 'IN',
    region: 'Asia-Pacific',
    hubType: 'Global Headquarters',
    card: [
      'OEM & Manufacturing',
      'Independent Engineering',
      'Quality & New Product Introduction',
      'Major Blade Programmes',
      'Owner / IPP Support',
    ],
    capabilities: [
      {
        title: 'OEM & Manufacturing',
        detail:
          'Blade engineering, process optimisation, quality and manufacturing support across major OEM programmes.',
      },
      {
        title: 'Independent Engineering',
        detail:
          'Blade inspection, manufacturing audits, material assessment and technical reporting through DNV GL.',
      },
      {
        title: 'Quality & New Product Introduction',
        detail:
          'APQP 4 Wind, RCA, FMEA, process qualification and blade launch support.',
      },
      {
        title: 'Major Programmes',
        detail:
          'Suzlon SB54, Vestas V110/V126/V136/V150 and Nordex N155/AW125.',
      },
      {
        title: 'Owner / IPP Projects',
        detail:
          'TotalEnergies — Nordex blade inspection for the Horse project, alongside technical assessment and project support.',
      },
    ],
  },

  {
    name: 'China',
    lat: 35.8617,
    lon: 104.1954,
    flag: 'CN',
    region: 'Asia-Pacific',
    card: [
      'Blade Manufacturing Support',
      'Technology Transfer',
      'Manufacturing Surveillance',
      'Factory Qualification',
      'Project Technical Support',
    ],
    capabilities: [
      {
        title: 'Vestas V136',
        detail:
          'Blade assembly and first-blade production support during the China launch programme.',
      },
      {
        title: 'SANY & Envision — Mirny 1 GW',
        detail:
          'Blade-factory TDD, qualification, risk assessment and mitigation supporting manufacturing readiness for the Kazakhstan project.',
      },
      {
        title: 'Goldwind–Sinoma',
        detail:
          'Manufacturing surveillance and final blade inspection for the SASOL / South Africa project.',
      },
      {
        title: 'Aeolon — Siemens Gamesa',
        detail:
          'Process and product audit and manufacturing assessment at the blade factory, supporting the Rembecourt, France project.',
      },
      {
        title: 'IPP / Wind-Farm Technical Support',
        detail:
          'Final blade inspection, manufacturing surveillance, quality-system audits, process audits and wind-farm visits across multiple international projects.',
      },
    ],
  },

  {
    name: 'Singapore',
    lat: 1.3521,
    lon: 103.8198,
    flag: 'SG',
    region: 'Asia-Pacific',
    card: [
      'Vendor Development',
      'Material Technology',
      'Process Engineering',
      'Supplier Support',
    ],
    capabilities: [
      {
        title: 'Vendor Development',
        detail:
          'Technical meetings with material manufacturers and suppliers supporting blade manufacturing.',
      },
      {
        title: 'Material Technology',
        detail:
          'Explored and evaluated new materials and process materials for blade manufacturing applications.',
      },
      {
        title: 'Process Engineering',
        detail:
          'Supported supplier and material development activities from a blade process-engineering perspective.',
      },
    ],
  },

  {
    name: 'Australia',
    lat: -25.2744,
    lon: 133.7751,
    flag: 'AU',
    region: 'Asia-Pacific',
    card: [
      'Third-Party Inspection',
      'Blade Quality Verification',
      'Independent Engineering',
      'Audit & Technical Reporting',
    ],
    capabilities: [
      {
        title: 'DNV GL — Third-Party Inspection',
        detail:
          'Supported blade inspection and quality verification for RE Power-related projects involving Australia.',
      },
      {
        title: 'Independent Engineering',
        detail:
          'Inspection, audit and technical reporting to support client and project requirements.',
      },
    ],
  },
  {
    name: 'Denmark',
    lat: 56.2639,
    lon: 9.5018,
    flag: 'DK',
    region: 'Europe',
    isAlliance: true,
    hubType: 'European Design & Robotics Collaboration',
    card: [
      'European Design Collaboration',
      'Global Blade Engineering',
      'Technology & Process Development',
      'OEM Technical Collaboration',
      'Engineering Training',
    ],
    capabilities: [
      // Current collaborations first — the Vestas entries below are career
      // history, and leading a card with history buried the live partnerships.
      ...ALLIANCES.map((ally) => ({
        title: `${ally.focus} — ${ally.name}`,
        detail: ally.detail.join(' • ') + '.',
      })),
      {
        title: 'Vestas Global Blade Engineering',
        detail:
          'Started in 2016 with technical training covering webs, blade assembly and multiple blade models.',
      },
      {
        title: 'Prototype & New Product Introduction',
        detail:
          'Supported V136, V116 and V120 at prototype and early-production stages through process-engineering activities.',
      },
      {
        title: 'Blade Launch & Technology Transfer',
        detail:
          'Worked within the global blade launch team, transferring manufacturing technology and process knowledge to production teams.',
      },
      {
        title: 'Process & Quality Engineering',
        detail:
          'Supported PFMEA updates, ECO / ECN implementation, process changes and manufacturing readiness.',
      },
      {
        title: 'Global Engineering Collaboration',
        detail:
          'Worked with Denmark-based engineering and validation teams supporting blade production and launch across international factories.',
      },
    ],
  },

  {
    name: 'Germany',
    lat: 51.1657,
    lon: 10.4515,
    flag: 'DE',
    region: 'Europe',
    card: [
      'Blade Inspection',
      'Third-Party Engineering',
      'Quality Assessment',
      'Technical Reporting',
    ],
    capabilities: [
      {
        title: 'Vestas V136',
        detail:
          'Supported blade production and process engineering activities during the V136 programme.',
      },
      {
        title: 'Process Engineering Support',
        detail:
          'Worked with Vestas teams in Germany on process implementation and technical support for multiple blade models.',
      },
      {
        title: 'Manufacturing Improvement',
        detail:
          'Supported a shell de-bagging process cost-reduction project, translating process observations into practical improvements.',
      },
      {
        title: 'Global NPI / Change Implementation',
        detail:
          'Supported ECN / ECO changes, process updates and manufacturing readiness in collaboration with global engineering teams.',
      },
      {
        title: 'Technology & Knowledge Transfer',
        detail:
          'Connected prototype and launch engineering with production-floor implementation across the Vestas global manufacturing network.',
      },
    ],
  },

  {
    name: 'United Kingdom',
    lat: 55.3781,
    lon: -3.436,
    flag: 'GB',
    region: 'Europe',
    card: [
      'Blade Engineering',
      'Manufacturing Process',
      'Quality Engineering',
      'Technology & Training',
    ],
    capabilities: [
      {
        title: 'Isle of Wight — Blade Repair',
        detail:
          'Technical training and development of blade repair instructions.',
      },
      {
        title: 'Technical Documentation',
        detail:
          'Worked on blade-related technical documentation and process information.',
      },
      {
        title: 'Blade Testing',
        detail:
          'Exposure to blade testing activities and technical evaluation.',
      },
      {
        title: 'Prototype Stage',
        detail:
          'Visited prototype-stage blade processes to understand manufacturing and development activities.',
      },
      {
        title: 'Engineering Knowledge Transfer',
        detail:
          'Combined repair, testing, documentation and prototype-process exposure within the wider blade engineering programme.',
      },
    ],
  },

  {
    name: 'Spain',
    lat: 40.4637,
    lon: -3.7492,
    flag: 'ES',
    region: 'Europe',
    card: [
      'Vestas V150',
      'Process Engineering',
      'Manufacturing Readiness',
      'Technology Transfer',
    ],
    capabilities: [
      {
        title: 'Vestas V150',
        detail:
          'Developed technical manufacturing documentation covering the blade process from webs through final post-moulding stages.',
      },
      {
        title: 'Technology Transfer',
        detail:
          'During the Türkiye V150 launch, assigned a team member to Spain for hands-on process learning and knowledge transfer.',
      },
      {
        title: 'Manufacturing Readiness',
        detail:
          'Translated the learning into technical documentation and process support for V150 production.',
      },
    ],
  },

  {
    name: 'France',
    lat: 46.2276,
    lon: 2.2137,
    flag: 'FR',
    region: 'Europe',
    card: [
      'Siemens Gamesa',
      'Process & Product Audit',
      'Manufacturing Assessment',
      'Project Delivery Readiness',
    ],
    capabilities: [
      {
        title: 'Rembecourt Wind Project',
        detail:
          'Process and product audit at Aeolon’s blade manufacturing facility in China for the France wind-farm project.',
      },
      {
        title: 'Siemens Gamesa — Rembecourt',
        detail:
          'Manufacturing assurance through assessment of blade manufacturing processes and product quality to support project requirements and delivery readiness.',
      },
      {
        title: 'TotalEnergies IPP Support',
        detail:
          'Provided independent blade engineering and technical support for TotalEnergies projects during 2025–2026.',
      },
      {
        title: 'Blade Expert & SME',
        detail:
          'Supported blade quality, inspection, repair assessment and technical decision-making from the IPP / end-customer perspective.',
      },
    ],
  },

  {
    name: 'Türkiye',
    lat: 38.9637,
    lon: 35.2433,
    flag: 'TR',
    region: 'Europe',
    card: [
      'Vestas V150',
      'Process Knowledge Transfer',
      'Manufacturing Quality',
      'Engineering Training',
    ],
    capabilities: [
      {
        title: 'Vestas V150 — New Model Launch',
        detail:
          'Led technical support and Quality Assurance team training for the V150 blade programme.',
      },
      {
        title: 'Quality Team Establishment',
        detail:
          'Built and developed the quality team to support production of the new blade model.',
      },
      {
        title: 'Technical Training',
        detail:
          'Delivered training covering blade quality, repair practices and material quality assessment.',
      },
      {
        title: 'APQP 4 Wind',
        detail:
          'Established the quality system and supported production implementation against customer requirements.',
      },
      {
        title: 'RCCA & Process Engineering',
        detail:
          'Led root-cause and corrective-action activities together with the process-engineering team during the V150 launch.',
      },
    ],
  },

  {
    name: 'Canada',
    lat: 56.1304,
    lon: -106.3468,
    isHq: false,
    flag: 'CA',
    region: 'Americas',
    hubType: 'Regional Operations',
    card: [
      'Nordex N155 / 77.5m Blade Programme',
      'Retrofit Quality',
      'Defect Prevention',
      'Customer Requirements',
    ],
    capabilities: [
      {
        title: 'Nordex N155 — Bekavar Retrofit Project',
        detail:
          'Led quality and engineering support for the Bekavar blade retrofit project involving the 77.5 m Nordex N155 blade.',
      },
      {
        title: 'Quality Leadership',
        detail:
          'Led the project to prevent recurrence of manufacturing defects and ensure the complete blade programme met end-customer quality requirements.',
      },
    ],
  },

  {
    name: 'USA',
    lat: 37.0902,
    lon: -95.7129,
    flag: 'US',
    region: 'Americas',
    card: [
      'Technology Transfer',
      'Blade Launch & Execution',
      'Process Optimisation',
      'Manufacturing Readiness',
    ],
    capabilities: [
      {
        title: 'Vestas V110 / V116 / V120',
        detail:
          'Supported global technology transfer and process engineering activities for blade manufacturing.',
      },
      {
        title: 'V120 Blade Launch',
        detail:
          'Supported blade launch and execution, working with the USA manufacturing team.',
      },
      {
        title: 'ECN / ECO Implementation',
        detail:
          'Supported engineering-change implementation and manufacturing-process updates.',
      },
      {
        title: 'PFMEA & Process Engineering',
        detail:
          'Supported PFMEA updates, process optimisation and manufacturing readiness.',
      },
      {
        title: 'Global Technology Transfer',
        detail:
          'Connected USA factory execution with Vestas’ global blade-launch and engineering teams.',
      },
    ],
  },

  {
    name: 'Mexico',
    lat: 23.6345,
    lon: -102.5528,
    flag: 'MX',
    region: 'Americas',
    card: [
      'Vestas V150',
      'Technology Transfer',
      'Quality & NDT',
      'Manufacturing Process',
    ],
    capabilities: [
      {
        title: 'Vestas V150 — Technology Transfer',
        detail:
          'Knowledge transfer from incoming inspection through post-moulding, including shell manufacturing good practices and defect reduction.',
      },
      {
        title: 'Quality & Assembly',
        detail:
          'Hands-on learning covering final assembly and NDT processes for the V150 blade.',
      },
      {
        title: 'India Quality Setup',
        detail:
          'Transferred the manufacturing and quality practices to support establishment of the V150 Quality Department in India.',
      },
    ],
  },

  {
    name: 'Oman',
    lat: 21.4735,
    lon: 55.9754,
    flag: 'OM',
    region: 'Middle East & Africa',
    card: [
      'Blade Inspection',
      'Repair Analysis',
      'Technical Assessment',
      'Pre-Commissioning Support',
    ],
    capabilities: [
      {
        title: 'Riyah Wind Project',
        detail:
          'Wind-farm blade inspection and technical assessment before commissioning.',
      },
      {
        title: 'Repair Engineering',
        detail:
          'Structural repair analysis, evaluation of blade defects and technical approval of repair solutions.',
      },
      {
        title: 'Pre-Commissioning Assurance',
        detail:
          'Verified blade quality, repair condition and readiness before commissioning to support reliable project handover.',
      },
    ],
  },

  {
    name: 'South Africa',
    lat: -30.5595,
    lon: 22.9375,
    flag: 'ZA',
    region: 'Middle East & Africa',
    card: [
      'SASOL Project',
      'Manufacturing Surveillance',
      'Final Blade Inspection',
      'Quality Assessment',
    ],
    capabilities: [
      {
        title: 'Wind Farm Blade Inspection',
        detail:
          'Inspected blades at site to verify condition and quality before project commissioning.',
      },
      {
        title: 'Structural Repair Assessment',
        detail:
          'Evaluated blade defects, performed repair analysis and technical assessment, and supported repair approval.',
      },
      {
        title: 'Pre-Commissioning Assurance',
        detail:
          'Verified blade quality and repair status before the blades entered operation, supporting IPP project readiness.',
      },
    ],
  },
]

/**
 * Derived from the data, never hand-written — the old hard-coded "11" was
 * repeated across eight files and went stale the moment a country was added.
 */
export const COUNTRY_COUNT = COUNTRIES.length
export const REGION_COUNT = new Set(COUNTRIES.map((c) => c.region)).size

export const COUNTRY_LIST_TEXT = COUNTRIES.map((c) => c.name).join(' · ')

export const COUNTRY_LIST =
  'Singapore · UK · Denmark · USA · Germany · China · Spain · Turkey · Mexico · South Africa · Oman'

export const VALUES = [
  { title: 'Integrity', body: 'Honest, transparent technical findings.' },
  { title: 'Independence', body: "Advice focused on the client's interests." },
  { title: 'Expertise', body: 'Expert, hands-on blade engineering knowledge.' },
  {
    title: 'Innovation',
    body: 'Advanced inspection, robotics and AI to improve blade assessment.',
  },
]

export const PROCESS = [
  { num: '01', title: 'Understand', body: 'We understand your blade, project context, technical challenge and objectives.' },
  {
    num: '02',
    title: 'Review',
    body: 'We review drawings, specifications, reports, inspection data, photographs and available technical records.',
  },
  { num: '03', title: 'Assess', body: 'We apply expert blade engineering expertise to assess the condition, defect, process or technical issue.' },
  {
    num: '04',
    title: 'Investigate',
    body: 'We examine evidence, technical requirements and relevant engineering criteria to establish the underlying issue and risk.',
  },
  { num: '05', title: 'Verify', body: 'We validate findings through technical evidence, engineering analysis and stakeholder discussions.' },
  { num: '06', title: 'Deliver', body: 'We provide clear conclusions and practical engineering recommendations that can be implemented.' },
]

export const WAYS_TO_WORK = [
  { title: 'Technical Assignment', body: 'Specific blade engineering question, assessment or technical issue.' },
  { title: 'Project Support', body: 'Expert blade engineering support throughout a defined project.' },
  {
    title: 'Long-Term Technical Partnership',
    body: 'Ongoing independent blade engineering support for Owners, IPPs, OEMs and engineering organisations.',
  },
]

// Services page — 8 services
export type Service = {
  id: string
  n: string
  title: string
  sub: string
  text: string
  list: string[]
  experience: string
  cta: string
}

export const SERVICES: Service[] = [
  {
    id: 'design-engineering',
    n: 'Service 1',
    title: 'Design & Engineering',
    sub: 'Expert blade engineering, strengthened through our collaboration with European Designers.',
    text: 'Windleaf provides Expert blade engineering expertise, complemented by design and advanced engineering capabilities through our collaboration with European Designers.',
    list: [
      'New blade design and development',
      'Blade design review and optimisation',
      'Structural analysis and assessment',
      'Aero-structural engineering support',
      'Material and laminate engineering',
      'Design-for-manufacturing review',
      'Prototype and product development support',
      'Engineering evaluation of existing blade designs',
    ],
    experience:
      'Blade engineering experience with DNV GL, plus design and advanced engineering capabilities through European Designers.',
    cta: 'Discuss a Design Project',
  },
  {
    id: 'manufacturing-quality',
    n: 'Service 2',
    title: 'Manufacturing & Quality',
    sub: 'Stronger processes, consistent quality and fewer defects on the production floor.',
    text: 'We help manufacturers and asset owners strengthen blade manufacturing processes, prepare for new products and keep quality under control.',
    list: [
      'Blade manufacturing process engineering',
      'Manufacturing readiness and new product introduction',
      'Quality assurance and process improvement',
      'Process and product audits',
      'Supplier quality and material characterisation',
      'Root cause analysis and defect reduction',
      'Manufacturing surveillance',
    ],
    experience:
      `Blade manufacturing experience with ${OEM_LIST_TEXT}; manufacturing audits with DNV GL; manufacturing surveillance and process audits with TotalEnergies.`,
    cta: 'Discuss Your Requirement',
  },
  {
    id: 'inspection-defect-assessment',
    n: 'Service 3',
    title: 'Inspection & Defect Assessment',
    sub: 'A clear, independent view of blade condition.',
    text: 'We turn inspection data into categorised findings and clear next steps, supported by visual, NDT, robotic and advanced camera technologies.',
    list: [
      'Blade inspection',
      'Defect identification and assessment',
      'Inspection data and image review',
      'Defect categorisation',
      'Technical evaluation of blade condition',
      'Independent inspection review',
      'Recommendations for further action',
    ],
    experience: 'Blade inspection experience with DNV GL and TotalEnergies.',
    cta: 'Discuss Your Requirement',
  },
  {
    id: 'technical-due-diligence',
    n: 'Service 4',
    title: 'Technical Due Diligence',
    sub: 'Understand blade risk before you commit.',
    text: 'Independent, blade-focused due diligence that helps owners, investors and IPPs identify technical risks and information gaps in wind assets.',
    list: [
      'Blade technical due diligence for wind assets',
      'Blade condition and risk assessment',
      'Manufacturing and quality documentation review',
      'Defect and repair history review',
      'Technical data and inspection evidence review',
      'Identification of technical risks and information gaps',
      'Independent engineering recommendations',
    ],
    experience: 'Technical due diligence experience with TotalEnergies.',
    cta: 'Discuss Your Requirement',
  },
  {
    id: 'repair-failure-analysis',
    n: 'Service 5',
    title: 'Repair & Failure Analysis',
    sub: 'Find the root cause. Confirm the repair is right.',
    text: 'We investigate blade damage and failures, and review whether repair methods and quality meet technical requirements.',
    list: [
      'Blade damage and failure investigation',
      'Root cause analysis',
      'Structural defect assessment',
      'Repair methodology review',
      'Repair quality and technical compliance review',
      'Engineering assessment of recurring defects',
      'Technical recommendations for corrective action',
    ],
    experience: 'Defect assessment, repair analysis and structural analysis on international wind projects.',
    cta: 'Discuss Your Requirement',
  },
  {
    id: 'wind-farm-support',
    n: 'Service 6',
    title: 'Wind Farm Technical Support',
    sub: 'Expert blade support for operating wind farms.',
    text: 'From reviewing inspection findings to coordinating with OEMs and contractors, we help wind farm teams manage blade issues with confidence.',
    list: [
      'Blade technical support for wind farms',
      'Review of inspection and operational findings',
      'Blade damage assessment',
      'Repair and maintenance technical support',
      'OEM and contractor technical coordination',
      'Recurring defect investigation',
      'Independent engineering recommendations',
    ],
    experience:
      'Owner-side (IPP) experience with TotalEnergies, combined with OEM manufacturing experience.',
    cta: 'Discuss Your Requirement',
  },
  {
    id: 'independent-consulting',
    n: 'Service 7',
    title: 'Independent Blade Consulting',
    sub: 'Expert advice when a blade decision matters most.',
    text: 'Technical advisory and engineering opinions for complex blade issues, with support across the owner, IPP and OEM interface.',
    list: [
      'Technical advisory for complex blade issues',
      'Engineering review and technical opinions',
      'Blade lifecycle advisory',
      'OEM, owner and IPP technical interface support',
      'Technical documentation and reporting',
      'Expert support for critical blade decisions',
    ],
    experience:
      'Independent engineering experience with DNV GL, and both OEM and IPP perspectives.',
    cta: 'Discuss Your Requirement',
  },
  {
    id: 'training',
    n: 'Service 8',
    title: 'Technical Training & Knowledge Transfer',
    sub: "Build your team's blade knowledge and capability.",
    text: 'Practical training that shares hands-on blade experience with manufacturing, quality, inspection and repair teams.',
    list: [
      'Blade manufacturing and process training',
      'Blade quality and defect awareness',
      'Inspection and repair training',
      'Technical documentation and best practices',
      'Team training and knowledge transfer',
    ],
    experience: 'Blade manufacturing training and technical knowledge transfer on global wind-energy projects.',
    cta: 'Enquire About Training',
  },
]

export const DESIGN_BOXES = [
  {
    title: 'What we support',
    body: 'Blade design review, engineering assessment and technical input, backed by our Expert collaboration network.',
  },
  {
    title: 'Where we add value',
    body: 'Independent review of design assumptions, materials, manufacturing feasibility, defects, structural considerations and repair implications.',
  },
  {
    title: 'What you get',
    body: 'Clear technical findings, engineering recommendations and practical support for design and project decisions.',
  },
]

// Services gallery — field experience images
export const GALLERY = [
  {
    caption: 'Blade manufacturing & process engineering',
    img: '/work-blade-manufacturing.jpg',
    alt: 'Blade manufacturing and process engineering — Windleaf project work',
  },
  {
    caption: 'Manufacturing audits & surveillance',
    img: '/work-manufacturing-audits.jpg',
    alt: 'Manufacturing audits and surveillance — Windleaf project work',
  },
  {
    caption: 'Blade inspection & defect assessment',
    img: '/work-blade-inspection.jpg',
    alt: 'Blade inspection and defect assessment — Windleaf project work',
  },
  {
    caption: 'Repair & failure analysis',
    img: '/work-repair-failure-analysis.jpg',
    alt: 'Repair and failure analysis — Windleaf project work',
  },
  {
    caption: 'Technical due diligence',
    img: '/work-technical-due-diligence.jpg',
    alt: 'Technical due diligence — Windleaf project work',
  },
  {
    caption: 'Technical training & knowledge transfer',
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=650&fit=crop&auto=format',
    alt: 'Technical training and knowledge transfer — Windleaf project work',
  },
]

export const SERVICE_QUICKLINKS = [
  { label: 'Our Work in Practice', id: 'work' },
  ...SERVICES.map((s) => ({ label: s.title, id: s.id })),
]

// Technology page
export const WHY_IT_MATTERS = [
  { title: 'Earlier detection', body: 'Helps detect potential structural and manufacturing issues earlier.' },
  {
    title: 'Beyond conventional inspection',
    body: 'Robotic access to internal blade areas can reveal issues that may not be visible through conventional inspection.',
  },
  {
    title: 'Faster, more consistent assessments',
    body: 'AI-assisted analytics help process inspection images and technical data.',
  },
  { title: 'Lower risk of costly failures', body: 'Earlier intervention helps reduce the risk of costly failures.' },
  {
    title: 'Engineer-verified',
    body: 'Every finding is checked by a Windleaf engineer before it becomes a recommendation.',
  },
]

export type CapabilityStatus =
  | 'Current capability'
  | 'Current & developing'
  | 'In development'
  | 'Core capability'

export type Capability = {
  title: string
  status: 'Current capability' | 'Current & developing' | 'In development' | 'Core capability'
  body: string
}

export type CapabilityPillar = {
  num: string
  title: string
  tagline: string
  accent: 'teal' | 'leaf' | 'navy'
  capabilities: Capability[]
  deliverable: string
}



export const INNOVATION_LIST = [
  'AI-based structural defect detection & pattern screening',
  'Robotic internal crawler inspection for confined blade cavities',
  'Ultrasonic & non-destructive bonding effectiveness assessment',
]


export const CAPABILITY_PILLARS: CapabilityPillar[] = [
  {
    num: '01',
    title: 'Technology Captures',
    tagline: 'Sub-millimeter optical capture, robotic mobility and non-destructive testing.',
    accent: 'teal',
    capabilities: [
      {
        title: 'Camera & Drone Inspection Support',
        status: 'Current capability',
        body: 'High-resolution visual and NDT blade inspection supported by robotic cameras and drones, providing complete surface defect records.',
      },
      {
        title: 'Robotic Internal Crawlers & Bondline Assessment',
        status: 'In development',
        body: 'Advancing crawling robotic solutions to access internal blade cavities, evaluate shear-web bonding integrity, and detect concealed defects.',
      },
    ],
    deliverable: 'High-fidelity structural records & multi-spectral defect imagery',
  },
  {
    num: '02',
    title: 'Engineering Interprets',
    tagline: 'AI-assisted data triage paired with rigorous independent engineering analysis.',
    accent: 'leaf',
    capabilities: [
      {
        title: 'AI & Inspection Data Analytics',
        status: 'Current & developing',
        body: 'Intelligent computer-vision algorithms to rapidly process thousands of inspection images, identifying defect clusters and erosion trends.',
      },
      {
        title: 'Root Cause & Structural Integrity Assessment',
        status: 'Core capability',
        body: 'Senior blade engineers evaluate laminate stress, manufacturing variances, and defect severity against international design standards.',
      },
    ],
    deliverable: 'Independent root-cause analysis & engineering risk classifications',
  },
  {
    num: '03',
    title: 'Windleaf Delivers',
    tagline: 'Definitive engineering recommendations and practical lifecycle solutions.',
    accent: 'navy',
    capabilities: [
      {
        title: 'Engineered Repair Procedures & Quality Assurance',
        status: 'Core capability',
        body: 'Custom laminate repair specifications, composite patch designs, and third-party manufacturing surveillance to ensure flawless execution.',
      },
      {
        title: 'Life Extension Advisory & Technical Due Diligence',
        status: 'Core capability',
        body: 'Actionable remnant-life assessments, fleet-wide risk mitigation, and objective technical recommendations for asset owners and IPPs.',
      },
    ],
    deliverable: 'Executable repair schemes, technical due diligence & extended asset life',
  },
]

export const FORM_FIELDS = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Your full name',
    type: 'text',
    required: true,
  },
  {
    name: 'company',
    label: 'Company / Organisation',
    placeholder: 'Company name',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: 'Business Email',
    placeholder: 'name@company.com',
    type: 'email',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone / WhatsApp',
    placeholder: 'Phone number',
    type: 'tel',
    required: true,
  },
  {
    name: 'country',
    label: 'Country',
    placeholder: 'Select your country',
    type: 'select',
    required: true,
  },
  {
    name: 'location',
    label: 'Wind Farm / Project Location',
    placeholder: 'Site or project location',
    type: 'text',
    required: false,
  },
  {
    name: 'turbine',
    label: 'Turbine & Blade Details',
    placeholder: 'Turbine model, blade type or length, if known',
    type: 'text',
    required: false,
  },
  {
    name: 'area',
    label: 'Area of Interest',
    placeholder: 'Select a service',
    type: 'select',
    required: false,
  },
  {
    name: 'requirement',
    label: 'Tell Us About Your Requirement',
    placeholder: 'Briefly describe your blade challenge or the support you need',
    type: 'textarea',
    required: true,
  },
] as const

export const AREA_OF_INTEREST = [
  'Design & Engineering',
  'Manufacturing & Quality',
  'Inspection & Defect Assessment',
  'Technical Due Diligence',
  'Repair & Failure Analysis',
  'Wind Farm Technical Support',
  'Independent Blade Consulting',
  'Technical Training & Knowledge Transfer',
  'AI, Automation & Robotics',
  'Other',
]

export const SEO = {
  home: {
    title: 'Wind Turbine Blade Engineering & Consulting | Windleaf',
    description:
      'Independent wind turbine blade engineering: technical due diligence, quality engineering, manufacturing surveillance, repair analysis and NDT inspection.',
  },
  about: {
    title: 'About Windleaf | Independent Wind Blade Engineering Expertise',
    description:
      'Founded by K. Muruga Ganesh Kasi Rajan, Windleaf brings 17 years of wind-energy experience across OEM, IPP and independent engineering, including DNV GL.',
  },
  services: {
    title: 'Wind Turbine Blade Engineering Services | Windleaf',
    description:
      'Blade design and engineering, manufacturing quality, inspection, technical due diligence, repair and failure analysis, wind farm support and training.',
  },
  tech: {
    title: 'AI & Robotic Wind Turbine Blade Inspection | Windleaf',
    description:
      'From blade to engineering solution: cameras, robotics and AI-assisted analysis, with every finding verified by a Windleaf engineer.',
  },
  work: {
    title: 'How We Work | Windleaf Blade Engineering Consulting',
    description:
      'A clear six-step process for blade challenges, with flexible engagement options — from single assignments to long-term technical partnerships.',
  },
  contact: {
    title: 'Contact Windleaf | Wind Turbine Blade Engineering Enquiries',
    description:
      'Tell us about your wind-energy challenge. Contact Windleaf for blade engineering expertise, technical assessment, inspection support and practical solutions.',
  },
}

export const STATS = [
  { value: '17', label: 'Years of global wind-energy experience' },
  { value: String(COUNTRY_COUNT), label: 'Countries of project experience' },
  { value: '10', label: 'Globally Delivered: 3 IPP & 7 OEM' },
]

type Reason = {
  title: string
  body: string
  /** Rendered as a partner table instead of the plain body where present. */
  alliances?: typeof ALLIANCES
}

export const SIX_REASONS: Reason[] = [
  {
    title: 'Decades of Blade Engineering Experience',
    body: 'Hands-on expertise across blade engineering, manufacturing, quality, inspection, defects and repair.',
  },
  {
    title: 'Global Experience & Technical Collaboration',
    body: 'Windleaf works with specialised European technology and engineering partners to strengthen design engineering and advanced blade inspection capabilities.',
  },
  {
    title: 'OEM & IPP Perspective',
    body: `Experience with blade manufacturers — ${OEM_LIST_TEXT} — and on the owner side with TotalEnergies. We understand both sides of a blade decision.`,
  },
  {
    title: 'Independent Technical Judgement',
    body: "Independent engineering experience with DNV GL, and objective advice focused on your interests — not the manufacturer's.",
  },
  {
    title: 'European Design & Robotics Alliances',
    // The body is the fallback for surfaces that render the reason as prose —
    // /how-we-work shows titles only, so the title has to stand alone too.
    body: 'Design engineering with APEX WIND ApS and robotic inside-blade inspection with LUKAN WIND ROBOTICS, both based in Denmark.',
    alliances: ALLIANCES,
  },
  {
    title: 'Technology-Enabled Solutions',
    body: 'Camera, robotic and AI-assisted tools — with every finding verified by a Windleaf engineer.',
  },
]

export const FORM_COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Guatemala',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lithuania',
  'Luxembourg',
  'Malaysia',
  'Maldives',
  'Malta',
  'Mauritius',
  'Mexico',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Tanzania',
  'Thailand',
  'Tunisia',
  'Turkey',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Venezuela',
  'Vietnam',
  'Zambia',
  'Zimbabwe',
] as const
