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
  details: '[Event dates] · [Venue] · [Stand number]',
  strip: 'Windergy India 2026 — [Event dates] · [Venue] · [Stand number]',
}

// NOTE: STATS and SIX_REASONS are defined further down, after COUNTRIES, so
// they can derive the country count instead of repeating a literal.

export const EXPERIENCE = [
  {
    title: 'OEM & Manufacturing Experience',
    body: 'Vestas · TPI Composites · Nordex · Suzlon · WinWind',
  },
  {
    title: 'Independent Engineering Experience',
    body: 'DNV GL — Blade Engineering, Inspection & Manufacturing Audits',
  },
  {
    title: 'IPP (Owner-Side) Experience',
    body: 'TotalEnergies — Technical Due Diligence, Manufacturing Surveillance, Process Audits & Blade Inspection',
  },
]

export const WHAT_WE_DO = [
  {
    title: 'Blade Engineering & Consulting',
    body: 'Blade design review, structural assessment, repair and failure analysis, and independent advice on complex blade issues.',
  },
  {
    title: 'Quality, Inspection & Assurance',
    body: 'Manufacturing quality, process audits, surveillance, and visual & NDT blade inspection with clear defect assessment.',
  },
  {
    title: 'Technical Due Diligence & Advisory',
    body: 'Blade condition and risk assessment, documentation and repair history review, and independent recommendations for wind assets.',
  },
]


export const TECH_FLOW = [
  {
    num: '01',
    title: 'Blade',
    body: 'At any stage, from manufacturing to the wind farm',
    kind: 'capture' as const,
  },
  {
    num: '02',
    title: 'Camera / Robot',
    body: 'Advanced cameras and robotics capture images and inspection data',
    kind: 'capture' as const,
  },
  {
    num: '03',
    title: 'Data',
    body: 'Images, inspection and manufacturing data organised for review',
    kind: 'capture' as const,
  },
  {
    num: '04',
    title: 'AI',
    body: 'AI-assisted analysis flags potential defects, anomalies and patterns',
    kind: 'capture' as const,
  },
  {
    num: '05',
    title: 'Windleaf Engineer',
    body: 'Engineers verify every finding against requirements and evidence',
    kind: 'verify' as const,
  },
  {
    num: '06',
    title: 'Engineering Solution',
    body: 'Practical recommendations and solutions you can act on',
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
    name: 'Singapore',
    lat: 1.3521,
    lon: 103.8198,
    flag: '🇸🇬',
    region: 'Asia-Pacific',
    isHq: true,
    hubType: 'Global Headquarters',
    services: ['Vendor Development', 'Materials'],
    detail:
      'Global headquarters — vendor development, materials engineering and the technical strategy directing blade consultancy across APAC and worldwide.',
  },
  {
    name: 'Denmark',
    lat: 56.2639,
    lon: 9.5018,
    flag: '🇩🇰',
    region: 'Europe',
    isAlliance: true,
    hubType: 'Engineering Alliance',
    services: ['Global Engineering', 'Training'],
    detail:
      'Global blade engineering and technical training through our dedicated alliance with Apex Wind Denmark, covering aerodynamic design and structural verification.',
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
    name: 'Turkey',
    lat: 38.9637,
    lon: 35.2433,
    flag: '🇹🇷',
    region: 'Europe',
    services: ['Quality', 'Training', 'Launch'],
    detail:
      'Quality engineering, team training and new-product launch support at major blade manufacturing and sub-component facilities.',
  },
  {
    name: 'Kazakhstan',
    lat: 48.0196,
    lon: 66.9237,
    flag: '🇰🇿',
    region: 'Asia-Pacific',
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
    name: 'South Africa',
    lat: -30.5595,
    lon: 22.9375,
    flag: '🇿🇦',
    region: 'Middle East & Africa',
    services: ['Project Support'],
    detail:
      'Blade project support for IPPs and utility-scale developments, including post-transportation inspection and pre-commissioning verification.',
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
  { num: '01', title: 'Understand', body: 'We start by understanding your blade challenge and objectives.' },
  {
    num: '02',
    title: 'Review',
    body: 'We review available drawings, reports, inspection data, photographs and technical records.',
  },
  { num: '03', title: 'Assess', body: 'We apply specialist blade engineering expertise and technical analysis.' },
  {
    num: '04',
    title: 'Verify',
    body: 'We validate findings through evidence, engineering requirements and stakeholder discussions.',
  },
  { num: '05', title: 'Recommend', body: 'We deliver clear findings, conclusions and recommendations.' },
  { num: '06', title: 'Solutions', body: 'We turn those findings into practical engineering solutions you can act on.' },
]

export const WAYS_TO_WORK = [
  { title: 'Single Assignment', body: 'For a specific technical question or blade issue.' },
  { title: 'Project Support', body: 'Specialist blade expertise throughout a defined project.' },
  {
    title: 'Long-Term Technical Partnership',
    body: 'Ongoing blade engineering support for owners, IPPs, OEMs and engineering organisations.',
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
    sub: 'Specialist blade engineering, strengthened through our collaboration with Apex Wind Denmark.',
    text: 'Windleaf provides specialist blade engineering expertise, complemented by design and advanced engineering capabilities through our collaboration with Apex Wind Denmark.',
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
      'Blade engineering experience with DNV GL, plus design and advanced engineering capabilities through Apex Wind Denmark.',
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
      'Blade manufacturing experience with Vestas, TPI Composites, Nordex, Suzlon and WinWind; manufacturing audits with DNV GL; manufacturing surveillance and process audits with TotalEnergies.',
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

// Services gallery — captions from SEO image descriptions, imagery from Unsplash
export const GALLERY = [
  {
    caption: 'Blade manufacturing & process engineering',
    img: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=900&h=650&fit=crop&auto=format',
    alt: 'Blade manufacturing and process engineering — Windleaf project work',
  },
  {
    caption: 'Manufacturing audits & surveillance',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&h=650&fit=crop&auto=format',
    alt: 'Manufacturing audits and surveillance — Windleaf project work',
  },
  {
    caption: 'Blade inspection & defect assessment',
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&h=650&fit=crop&auto=format',
    alt: 'Blade inspection and defect assessment — Windleaf project work',
  },
  {
    caption: 'Repair & failure analysis',
    img: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900&h=650&fit=crop&auto=format',
    alt: 'Repair and failure analysis — Windleaf project work',
  },
  {
    caption: 'Technical due diligence',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=650&fit=crop&auto=format',
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

export type Capability = {
  title: string
  status: 'Current capability' | 'Current & developing' | 'In development'
  body: string
}

export const CAPABILITIES: Capability[] = [
  {
    title: 'Camera & Robotic Inspection Support',
    status: 'Current capability',
    body: 'Visual and NDT blade inspection supported by robotic and advanced camera technologies, giving our engineers clear images and inspection data to work with.',
  },
  {
    title: 'AI & Inspection Data Analytics',
    status: 'Current & developing',
    body: 'AI-assisted analytics process inspection images and technical data, identify patterns and potential anomalies, and support faster, more consistent blade assessments.',
  },
  {
    title: 'Robotic Internal Blade Inspection & Bonding Assessment',
    status: 'In development',
    body: 'We are advancing robotic inspection solutions to access internal blade areas and assess bonding effectiveness — helping identify potential structural issues that may not be visible through conventional inspection.',
  },
  {
    title: 'AI-Based Early Structural Defect Detection',
    status: 'In development',
    body: 'We are developing AI-assisted solutions to identify potential structural issues in wind turbine blades at an early stage — enabling earlier intervention and helping reduce the risk of costly failures.',
  },
]

export const INNOVATION_LIST = [
  'AI-based structural defect detection',
  'Robotic internal blade inspection',
  'Bonding effectiveness assessment',
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
      'Founded by K. Muruga Ganesh, Windleaf brings 17+ years of wind-energy experience across OEM, IPP and independent engineering, including DNV GL.',
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
  { value: '17+', label: 'Years of global wind-energy experience' },
  { value: String(COUNTRY_COUNT), label: 'Countries of project experience' },
  { value: String(SERVICES.length), label: 'Specialist blade services' },
]

export const SIX_REASONS = [
  {
    title: 'Proven Blade Engineering Expertise',
    body: 'Hands-on expertise across blade engineering, manufacturing, quality, inspection, defects and repair.',
  },
  {
    title: '17+ Years of Global Wind-Energy Experience',
    body: `Wind project experience across ${COUNTRY_COUNT} countries.`,
  },
  {
    title: 'OEM + IPP Perspective',
    body: 'Experience with blade manufacturers — Vestas, TPI Composites, Nordex, Suzlon and WinWind — and on the owner side with TotalEnergies. We understand both sides of a blade decision.',
  },
  {
    title: 'Independent Technical Judgement',
    body: "Independent engineering experience with DNV GL, and objective advice focused on your interests — not the manufacturer's.",
  },
  {
    title: 'Global Experience & Technical Collaboration',
    body: 'International project exposure, with design and advanced engineering capabilities through our collaboration with Apex Wind Denmark.',
  },
  {
    title: 'Technology-Enabled Solutions',
    body: 'Camera, robotic and AI-assisted tools — with every finding verified by a Windleaf engineer.',
  },
]

export const FORM_COUNTRIES  = [
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
