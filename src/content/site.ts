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

export const EVENT = {
  heading: 'Meet Windleaf at Windergy India 2026',
  text: 'Visit us to discuss blade engineering, inspection and our technology initiatives.',
  details: 'October 7–9, 2026 · Chennai Trade centre, Nandambakkam · Hall 2, S3',
  strip: 'Windergy India 2026 — October 7–9, 2026 · Chennai Trade centre, Nandambakkam · Hall 2, S3',
}

// NOTE: STATS and SIX_REASONS are defined further down, after COUNTRIES, so
// they can derive the country count instead of repeating a literal.

export const EXPERIENCE = [
  {
    title: 'OEM & Manufacturing Experience',
    body: 'Suzlon · Vestas · Nordex · Goldwind · GE · Siemens Gamesa · RE Technologies · Envision',
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
    body: 'Visual • NDT • Robotics • Field Data',
    kind: 'capture' as const,
  },
  {
    num: '03',
    title: 'Engineering Analysis',
    body: 'Structural • Manufacturing • Quality • Defects',
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
  services: string[]
  detail: string
}

export const COUNTRIES: Country[] = [
  {
    name: 'India',
    lat: 13.0827,
    lon: 80.2707,
    isHq: true,
    flag: '🇮🇳',
    region: 'Asia-Pacific',
    hubType: 'Global Headquarters',
    services: ['TDD', 'Factory Qualification'],
    detail:
      'Technical due diligence and blade factory qualification for utility-scale wind development, including manufacturing readiness and supply-chain capability.',
  },
  {
    name: 'China',
    lat: 35.8617,
    lon: 104.1954,
    flag: '🇨🇳',
    region: 'Asia-Pacific',
    services: ['Factory Qualification', 'Manufacturing Surveillance', 'NPI'],
    detail:
      'Factory qualification, on-site manufacturing surveillance and new product introduction at tier-1 OEM export facilities.',
  },
  {
    name: 'Singapore',
    lat: 1.3521,
    lon: 103.8198,
    flag: '🇸🇬',
    region: 'Asia-Pacific',
    services: ['Vendor Development', 'Materials'],
    detail:
      'Global headquarters — vendor development, materials engineering and the technical strategy directing blade consultancy across APAC and worldwide.',
  },
  {
    name: 'Australia',
    lat: -25.2744,
    lon: 133.7751,
    flag: '🇦🇺',
    region: 'Asia-Pacific',
    services: ['Blade Project', 'Quality Assurance'],
    detail:
      'Blade project delivery and quality assurance for wind farms across Australian sites, from receipt inspection to pre-commissioning.',
  },
  {
    name: 'Denmark',
    lat: 56.2639,
    lon: 9.5018,
    flag: '🇩🇰',
    region: 'Europe',
    services: ['Global Engineering', 'Training'],
    detail:
      'Global blade engineering and technical training through our dedicated alliance with European Designers, covering aerodynamic design and structural verification.',
  },
  {
    name: 'UK',
    lat: 55.3781,
    lon: -3.436,
    flag: '🇬🇧',
    region: 'Europe',
    services: ['Blade Repair', 'Technical Training'],
    detail:
      'Composite blade repair engineering and technical training for offshore and onshore operators across the UK fleet.',
  },
  {
    name: 'Germany',
    lat: 51.1657,
    lon: 10.4515,
    flag: '🇩🇪',
    region: 'Europe',
    services: ['OEM', 'Inspection', 'Engineering'],
    detail:
      'OEM-side engineering, blade inspection and process support at primary European blade production sites.',
  },

  {
    name: 'Spain',
    lat: 40.4637,
    lon: -3.7492,
    flag: '🇪🇸',
    region: 'Europe',
    services: ['Engineering', 'Process & Quality'],
    detail:
      'Blade engineering support alongside manufacturing process and quality improvement at Spanish production facilities.',
  },
  {
    name: 'France',
    lat: 46.2276,
    lon: 2.2137,
    flag: '🇫🇷',
    region: 'Europe',
    services: ['Process & Product Audit'],
    detail:
      'Independent process and product audits of blade manufacturing lines and finished product against technical specification.',
  },
  {
    name: 'Türkiye',
    lat: 38.9637,
    lon: 35.2433,
    flag: '🇹🇷',
    region: 'Europe',
    services: ['Quality', 'Training', 'Launch'],
    detail:
      'Quality engineering, team training and new-product launch support at major blade manufacturing and sub-component facilities.',
  },
  {
    name: 'Canada',
    lat: 56.1304,
    lon: -106.3468,
    isHq: false,
    flag: '🇨🇦',
    region: 'Americas',
    hubType: 'Regional Operations',
    services: ['TDD', 'Factory Qualification'],
    detail:
      'Technical due diligence and blade factory qualification for utility-scale wind development, including manufacturing readiness and supply-chain capability.',
  },
  {
    name: 'USA',
    lat: 37.0902,
    lon: -95.7129,
    flag: '🇺🇸',
    region: 'Americas',
    services: ['Engineering', 'Manufacturing', 'Inspection'],
    detail:
      'Blade engineering, manufacturing support and structural inspection across US wind fleets and production lines.',
  },
  {
    name: 'Mexico',
    lat: 23.6345,
    lon: -102.5528,
    flag: '🇲🇽',
    region: 'Americas',
    services: ['Quality', 'Training', 'Launch'],
    detail:
      'Quality engineering, workforce training and product launch support for North American export blade manufacturing lines.',
  },

  {
    name: 'Oman',
    lat: 21.4735,
    lon: 55.9754,
    flag: '🇴🇲',
    region: 'Middle East & Africa',
    services: ['WTG Project Support'],
    detail:
      'Wind turbine generator project support in extreme desert conditions, covering blade inspection, erosion analysis and repair engineering.',
  },
  {
    name: 'South Africa',
    lat: -30.5595,
    lon: 22.9375,
    flag: '🇿🇦',
    region: 'Middle East & Africa',
    services: ['Project Support'],
    detail:
      'Blade project support for IPPs and utility-scale developments, including post-transportation inspection and pre-commissioning verification.',
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
  { title: 'Expertise', body: 'Specialist, hands-on blade engineering knowledge.' },
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
  { num: '03', title: 'Assess', body: 'We apply specialist blade engineering expertise to assess the condition, defect, process or technical issue.' },
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
  { title: 'Project Support', body: 'Specialist blade engineering support throughout a defined project.' },
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
    sub: 'Specialist blade engineering, strengthened through our collaboration with European Designers.',
    text: 'Windleaf provides specialist blade engineering expertise, complemented by design and advanced engineering capabilities through our collaboration with European Designers.',
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
      'Blade manufacturing experience with Vestas,  Nordex, Suzlon and WinWind; manufacturing audits with DNV GL; manufacturing surveillance and process audits with TotalEnergies.',
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
    sub: 'Specialist blade support for operating wind farms.',
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
      'Specialist support for critical blade decisions',
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
    body: 'Blade design review, engineering assessment and technical input, backed by our specialist collaboration network.',
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


export type CapabilityPillar = {
  num: string
  title: string
  tagline: string
  accent: string
  capabilities: Capability[]
  deliverable: string
}

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
      'Founded by K. Muruga Ganesh, Windleaf brings 17 years of wind-energy experience across OEM, IPP and independent engineering, including DNV GL.',
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

export const SIX_REASONS = [
  {
    title: 'Decades of Blade Engineering Experience',
    body: 'Hands-on expertise across blade engineering, manufacturing, quality, inspection, defects and repair.',
  },
  {
    title: '17 Years of Global Wind-Energy Experience',
    body: `Wind project experience across ${COUNTRY_COUNT} countries.`,
  },
  {
    title: 'OEM & IPP Perspective',
    body: 'Experience with blade manufacturers — Suzlon · Vestas · Nordex · Goldwind · GE · Siemens Gamesa · RE Technologies · Envision — and on the owner side with TotalEnergies. We understand both sides of a blade decision.',
  },
  {
    title: 'Independent Technical Judgement',
    body: "Independent engineering experience with DNV GL, and objective advice focused on your interests — not the manufacturer's.",
  },
  {
    title: 'Global Experience & Technical Collaboration',
    body: 'International project exposure, with design and advanced engineering capabilities through our collaboration with European Designers.',
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
