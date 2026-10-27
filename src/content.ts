export type IconName =
  | 'palette'
  | 'brush'
  | 'stack'
  | 'film'
  | 'book'
  | 'code'
  | 'pencil'
  | 'github'
  | 'journal'
  | 'award'
  | 'search'
  | 'images'
  | 'notebook'
  | 'document'
  | 'farm'
  | 'city'
  | 'map'

export interface CardLink {
  label: string
  href: string
  logo?: string
  logoAlt?: string
  internal?: boolean
}

export interface LinkCard {
  id: string
  title: string
  icon: IconName
  links: CardLink[]
  description?: string
  tags?: string[]
  flair?: { src: string; width: number; height: number; alt: string; title: string }
}

export interface CardGroup {
  id: string
  eyebrow: string
  heading: string
  intro: string
  cards: LinkCard[]
}

export interface Paper {
  label: string
  title: string
  href: string
  venue: string
  series: string
  publisher: string
  year: number
}

export interface Social {
  label: string
  href: string
  icon: 'linkedin' | 'instagram' | 'youtube' | 'github' | 'x' | 'pinterest'
}

export interface Painting {
  id: string
  src: string
  full: string
  original: string
  width: number
  height: number
  alt: string
}

export interface FrameStyle {
  id: 'none' | 'modern' | 'classic' | 'gold' | 'neon'
  name: string
  description: string
}

export const site = {
  title: 'Aman Anand Rai',
  brand: 'Aman',
}

export const nav = [
  { id: 'section_1', label: 'Home' },
  { id: 'section_2', label: 'About' },
  { id: 'tech', label: 'Tech' },
  { id: 'projects', label: 'Projects' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'section_3', label: 'Contact' },
] as const

export const hero = {
  eyebrow: "I'm Aman Anand Rai",
  greeting: 'Hello friend!',
  sides: [
    { id: 'tech', label: 'Code · Research · Writing', href: '#tech' },
    { id: 'hobbies', label: 'Painting · AI Art · Books · Movies', href: '#hobbies' },
  ] as const,
  cta: { label: "Let's begin", href: '#section_2' },
  portrait: '/images/aman_profile-removebg.webp',
  portraitAlt: 'Portrait of Aman Anand Rai',
}

export const about = {
  heading: 'About Me',
  subheading: 'Two sides, one curious mind',
  paragraph:
    "I'm a developer and researcher who writes about machine learning, builds things with generative AI, and solves problems on competitive coding sites. Away from the keyboard I paint, make AI art, and keep up with books and films. This site brings both sides together.",
  highlights: ['machine learning', 'generative AI', 'competitive coding', 'paint', 'AI art', 'books and films'],
}

const logo = (file: string) => `/images/logos/webp/${file.replace(/\.(png|jpe?g)$/i, '.webp')}`

export const tech: CardGroup = {
  id: 'tech',
  eyebrow: 'The technical side',
  heading: 'Tech',
  intro: 'Writing, code and research.',
  cards: [
    {
      id: 'blogging',
      title: 'Blogging',
      icon: 'pencil',
      links: [
        { label: 'Dev.to', href: 'https://dev.to/amananandrai', logo: logo('devto.png'), logoAlt: 'Dev.to Logo' },
        {
          label: 'Hashnode',
          href: 'https://amananandrai.hashnode.dev/',
          logo: logo('hashnode.png'),
          logoAlt: 'Hashnode Logo',
        },
      ],
    },
    {
      id: 'programming',
      title: 'Programming',
      icon: 'github',
      links: [
        { label: 'Github', href: 'https://github.com/amananandrai', logo: logo('github.png'), logoAlt: 'Github Logo' },
        {
          label: 'Kaggle',
          href: 'https://www.kaggle.com/amananandrai',
          logo: logo('kaggle.png'),
          logoAlt: 'Kaggle Logo',
        },
      ],
    },
    {
      id: 'competitive-coding',
      title: 'Competitive Coding',
      icon: 'code',
      links: [
        {
          label: 'Hackerrank',
          href: 'https://www.hackerrank.com/aman_rai',
          logo: logo('hackerrank.png'),
          logoAlt: 'Hackerrank Logo',
        },
        {
          label: 'HackerEarth',
          href: 'https://www.hackerearth.com/@amananandrai',
          logo: logo('hackerearth.png'),
          logoAlt: 'HackerEarth Logo',
        },
        {
          label: 'Spoj',
          href: 'https://www.spoj.com/users/amananandrai',
          logo: logo('spoj.png'),
          logoAlt: 'Spoj Logo',
        },
        {
          label: 'Leetcode',
          href: 'https://leetcode.com/u/aman_rai/',
          logo: logo('leetcode.png'),
          logoAlt: 'Leetcode Logo',
        },
        {
          label: 'Codechef',
          href: 'https://www.codechef.com/users/sangadak',
          logo: logo('codechef.png'),
          logoAlt: 'Codechef Logo',
        },
      ],
    },
    {
      id: 'research',
      title: 'Research',
      icon: 'search',
      links: [
        {
          label: 'ResearchGate',
          href: 'https://www.researchgate.net/profile/Aman-Rai-9?ev=prf_overview',
          logo: logo('researchgate.png'),
          logoAlt: 'ResearchGate Logo',
        },
        {
          label: 'Google Scholar',
          href: 'https://scholar.google.com/citations?user=khuuiBIAAAAJ&hl=en',
          logo: logo('googlescholar.png'),
          logoAlt: 'Google Scholar Logo',
        },
      ],
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: 'award',
      links: [
        {
          label: 'Credly',
          href: 'https://www.credly.com/users/aman-anand-rai/',
          logo: logo('credly.png'),
          logoAlt: 'Credly Logo',
        },
        {
          label: 'Accredible',
          href: 'https://www.credential.net/profile/amananandrai53325/wallet',
          logo: logo('accredible.jpg'),
          logoAlt: 'Accredible Logo',
        },
      ],
    },
    {
      id: 'stack-exchange',
      title: 'Stack Exchange',
      icon: 'stack',
      links: [
        {
          label: 'Stack Exchange',
          href: 'https://stackexchange.com/users/7329417/codeczar',
          logo: logo('stackexchange.png'),
          logoAlt: 'Stack Exchange Logo',
        },
      ],
      flair: {
        src: 'https://stackexchange.com/users/flair/7329417.png',
        width: 208,
        height: 58,
        alt: 'profile for codeczar on Stack Exchange, a network of free, community-driven Q&A sites',
        title: 'profile for codeczar on Stack Exchange, a network of free, community-driven Q&A sites',
      },
    },
  ],
}

export const projects: CardGroup = {
  id: 'projects',
  eyebrow: 'Built for the browser',
  heading: 'Projects',
  intro: 'Small apps and games I have built. Each one runs right in the browser.',
  cards: [
    {
      id: 'notebooklm',
      description: 'A NotebookLM-style app for asking questions about your own documents.',
      tags: ['Generative AI', 'Web app'],
      title: 'NotebookLM',
      icon: 'notebook',
      links: [{ label: 'NotebookLM', href: 'https://notebooklm-dusky.vercel.app/' }],
    },
    {
      id: 'document-editor',
      description: 'A rich-text document editor built with React and Tiptap.',
      tags: ['React', 'Tiptap'],
      title: 'Document Editor',
      icon: 'document',
      links: [{ label: 'Document Editor', href: 'https://document-editor-react-tiptap.vercel.app/' }],
    },
    {
      id: 'ai-image-gallery',
      description: 'An online album of AI-generated artwork.',
      tags: ['AI art', 'Web app'],
      title: 'AI Image Gallery',
      icon: 'images',
      links: [
        {
          label: 'AI Image Gallery',
          href: 'https://ai-album.vercel.app/',
          logo: logo('ai_image_gallery.jpg'),
          logoAlt: 'AI Image Gallery Logo',
        },
      ],
    },
    {
      id: 'farm-simulator',
      description: 'A farming simulation game that runs in the browser.',
      tags: ['Game', 'Simulation'],
      title: 'Farm Simulator',
      icon: 'farm',
      links: [{ label: 'Farm Simulator', href: 'https://farm-simulator-2.vercel.app/' }],
    },
    {
      id: 'city-builder',
      description: 'A city-building game that runs in the browser.',
      tags: ['Game', 'Strategy'],
      title: 'City Builder',
      icon: 'city',
      links: [{ label: 'City Builder', href: 'https://city-builder-omega.vercel.app/' }],
    },
    {
      id: 'sim-city',
      description: 'A SimCity-style city simulation in the browser.',
      tags: ['Game', 'Simulation'],
      title: 'Sim City',
      icon: 'map',
      links: [{ label: 'Sim City', href: 'https://sim-city-seven.vercel.app/' }],
    },
  ],
}

export const hobbies: CardGroup = {
  id: 'hobbies',
  eyebrow: 'The hobby side',
  heading: 'Hobbies',
  intro: 'Painting, AI art, books and films.',
  cards: [
    {
      id: 'painting',
      title: 'Painting',
      icon: 'brush',
      links: [
        { label: 'Gallery', href: '/gallery/', logo: logo('gallery.jpg'), logoAlt: 'Gallery Logo', internal: true },
      ],
    },
    {
      id: 'ai-art',
      title: 'AI Art',
      icon: 'palette',
      links: [
        {
          label: 'NightCafe',
          href: 'https://creator.nightcafe.studio/u/Aman_Anand',
          logo: logo('nightcafe.png'),
          logoAlt: 'NightCafe Logo',
        },
      ],
    },
    {
      id: 'books',
      title: 'Books',
      icon: 'book',
      links: [
        {
          label: 'Goodreads',
          href: 'https://www.goodreads.com/user/show/191410906-aman-anand',
          logo: logo('goodreads.jpg'),
          logoAlt: 'Goodreads Logo',
        },
      ],
    },
    {
      id: 'movies',
      title: 'Movies',
      icon: 'film',
      links: [
        {
          label: 'Letterboxd',
          href: 'https://letterboxd.com/aman_anand/',
          logo: logo('letterboxd.png'),
          logoAlt: 'Letterboxd Logo',
        },
      ],
    },
  ],
}

export const publications: { heading: string; papers: Paper[] } = {
  heading: 'Publications',
  papers: [
    {
      label: 'Paper 1',
      title: 'Cognitive Load Classification During Arithmetic Task Using Single Convolution Layer-Based 2D-CNN Model',
      href: 'https://link.springer.com/chapter/10.1007/978-981-19-5868-7_16',
      venue: 'Machine Learning, Image Processing, Network Security and Data Sciences',
      series: 'Lecture Notes in Electrical Engineering',
      publisher: 'Springer',
      year: 2023,
    },
    {
      label: 'Paper 2',
      title: 'Electroencephalogram-based Cognitive Load Classification During Mental Arithmetic Task',
      href: 'https://link.springer.com/chapter/10.1007/978-981-19-0019-8_36',
      venue: 'Edge Analytics',
      series: 'Lecture Notes in Electrical Engineering',
      publisher: 'Springer',
      year: 2022,
    },
  ],
}

export const contact = {
  banner: 'Say Hi',
  heading: 'Contact Info',
  email: 'amananandrai@gmail.com',
  followHeading: 'Follow Me',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aman-anand-1b7823178/', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com/ai_man_and_art/', icon: 'instagram' },
    { label: 'YouTube', href: 'https://www.youtube.com/@Ai_man_0822', icon: 'youtube' },
    { label: 'GitHub', href: 'https://github.com/amananandrai', icon: 'github' },
    { label: 'X', href: 'https://x.com/amananandrai', icon: 'x' },
    { label: 'Pinterest', href: 'https://in.pinterest.com/aiman25842/', icon: 'pinterest' },
  ] satisfies Social[],
}

export const footer = {
  copyright: (year: number) => `Copyright © ${year}. All rights reserved.`,
}

export const gallery = {
  pageTitle: 'My Art Gallery',
  heading: 'My Gallery',
  intro: 'Choose a frame style for the Gallery.',
  button: 'Change Frame Style',
  modalTitle: 'Select Frame',
  backLink: 'Back home',
  defaultFrame: 'modern' as FrameStyle['id'],
  frames: [
    { id: 'none', name: 'None', description: 'Standard clean edges' },
    { id: 'modern', name: 'Modern', description: 'Studio white with drop shadow' },
    { id: 'classic', name: 'Mahogany', description: 'Dark polished wood' },
    { id: 'gold', name: 'Gilded Gold', description: 'Regal metallic finish' },
    { id: 'neon', name: 'Neon Glow', description: 'Vibrant pink illumination' },
  ] satisfies FrameStyle[],
  paintings: [
    {
      id: 'p1',
      src: '/img/optimized/tm-img-01-1200.webp',
      full: '/img/optimized/tm-img-01-2400.webp',
      original: '/img/tm-img-01.jpg',
      width: 4000,
      height: 3000,
      alt: 'Image 1',
    },
    {
      id: 'p2',
      src: '/img/optimized/tm-img-02-1200.webp',
      full: '/img/optimized/tm-img-02-2400.webp',
      original: '/img/tm-img-02.jpg',
      width: 4000,
      height: 2966,
      alt: 'Image 2',
    },
    {
      id: 'p3',
      src: '/img/optimized/tm-img-03-1200.webp',
      full: '/img/optimized/tm-img-03-2400.webp',
      original: '/img/tm-img-03.jpg',
      width: 3049,
      height: 4377,
      alt: 'Image 3',
    },
  ] satisfies Painting[],
}
