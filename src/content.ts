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

export interface CardLink {
  label: string
  href: string
  logo: string
  logoAlt: string
  internal?: boolean
}

export interface LinkCard {
  id: string
  title: string
  icon: IconName
  links: CardLink[]
  flair?: { src: string; width: number; height: number; alt: string; title: string }
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
  title: "Aman Anand Rai's Portfolio",
  brand: 'Aman',
}

export const nav = [
  { id: 'section_1', label: 'Home' },
  { id: 'section_2', label: 'About' },
  { id: 'section_3', label: 'Contact' },
] as const

export const hero = {
  greeting: 'Hello friend!',
  tagline: "Let's build something great together.",
  cta: { label: "Let's begin", href: '#section_2' },
  portrait: '/images/aman_profile-removebg.png',
  portraitAlt: 'Portrait of Aman Anand Rai',
  introClip: { webm: '/media/hero-intro.webm', mp4: '/media/hero-intro.mp4', poster: '/media/hero-intro-poster.webp' },
}

export const about = {
  heading: 'About Me',
  subheading: 'Blending Creativity with Technology',
  paragraphs: [
    "Hello and welcome to my portfolio! I'm someone who thrives on blending creativity with technology, transforming ideas into solutions that make an impact. My passions include exploring AI art, diving deep into data analytics, unraveling machine learning mysteries, innovating with generative AI, and honing my skills in competitive coding. Alongside this, I blog about my journey in machine learning and computer science, sharing insights, challenges, and breakthroughs with like-minded enthusiasts.",
    "What drives me is a genuine curiosity to understand and create. From decoding complex algorithms to crafting intelligent models and experimenting with the artistic potential of AI, I find joy in every discovery and every challenge overcome. My blog reflects this spirit—a place where I demystify technical concepts, share projects I'm working on, and spark engaging conversations about the future of computer science.",
    "This portfolio is not just a showcase of skills and projects but a testament to my journey, my growth, and my aspirations. I hope you'll enjoy exploring my work as much as I've enjoyed creating it.",
  ],
  highlights: ['AI art', 'data analytics', 'machine learning', 'generative AI', 'competitive coding'],
}

const logo = (file: string) => `/images/logos/${file}`

export const creativity: { heading: string; cards: LinkCard[] } = {
  heading: 'Creativity',
  cards: [
    {
      id: 'ai-art',
      title: 'AI Art',
      icon: 'palette',
      links: [
        { label: 'NightCafe', href: 'https://creator.nightcafe.studio/u/Aman_Anand', logo: logo('nightcafe.png'), logoAlt: 'NightCafe Logo' },
        { label: 'AI Image Gallery', href: 'https://ai-album.vercel.app/', logo: logo('ai_image_gallery.jpg'), logoAlt: 'AI Image Gallery Logo' },
      ],
    },
    {
      id: 'painting',
      title: 'Painting',
      icon: 'brush',
      links: [{ label: 'Gallery', href: '/gallery/', logo: logo('gallery.jpg'), logoAlt: 'Gallery Logo', internal: true }],
    },
    {
      id: 'stack-exchange',
      title: 'Stack Exchange',
      icon: 'stack',
      links: [
        { label: 'Stack Exchange', href: 'https://stackexchange.com/users/7329417/codeczar', logo: logo('stackexchange.png'), logoAlt: 'Stack Exchange Logo' },
      ],
      flair: {
        src: 'https://stackexchange.com/users/flair/7329417.png',
        width: 208,
        height: 58,
        alt: 'profile for codeczar on Stack Exchange, a network of free, community-driven Q&A sites',
        title: 'profile for codeczar on Stack Exchange, a network of free, community-driven Q&A sites',
      },
    },
    {
      id: 'movies',
      title: 'Movies',
      icon: 'film',
      links: [{ label: 'Letterboxd', href: 'https://letterboxd.com/aman_anand/', logo: logo('letterboxd.png'), logoAlt: 'Letterboxd Logo' }],
    },
    {
      id: 'books',
      title: 'Books',
      icon: 'book',
      links: [
        { label: 'Goodreads', href: 'https://www.goodreads.com/user/show/191410906-aman-anand', logo: logo('goodreads.jpg'), logoAlt: 'Goodreads Logo' },
      ],
    },
  ],
}

export const technologies: { heading: string; cards: LinkCard[] } = {
  heading: 'Technologies & Activities',
  cards: [
    {
      id: 'competitive-coding',
      title: 'Competitive Coding',
      icon: 'code',
      links: [
        { label: 'Hackerrank', href: 'https://www.hackerrank.com/aman_rai', logo: logo('hackerrank.png'), logoAlt: 'Hackerrank Logo' },
        { label: 'HackerEarth', href: 'https://www.hackerearth.com/@amananandrai', logo: logo('hackerearth.png'), logoAlt: 'HackerEarth Logo' },
        { label: 'Spoj', href: 'https://www.spoj.com/users/amananandrai', logo: logo('spoj.png'), logoAlt: 'Spoj Logo' },
        { label: 'Leetcode', href: 'https://leetcode.com/u/aman_rai/', logo: logo('leetcode.png'), logoAlt: 'Leetcode Logo' },
        { label: 'Codechef', href: 'https://www.codechef.com/users/sangadak', logo: logo('codechef.png'), logoAlt: 'Codechef Logo' },
      ],
    },
    {
      id: 'blogging',
      title: 'Blogging',
      icon: 'pencil',
      links: [
        { label: 'Dev.to', href: 'https://dev.to/amananandrai', logo: logo('devto.png'), logoAlt: 'Dev.to Logo' },
        { label: 'Hashnode', href: 'https://amananandrai.hashnode.dev/', logo: logo('hashnode.png'), logoAlt: 'Hashnode Logo' },
      ],
    },
    {
      id: 'programming',
      title: 'Programming',
      icon: 'github',
      links: [
        { label: 'Github', href: 'https://github.com/amananandrai', logo: logo('github.png'), logoAlt: 'Github Logo' },
        { label: 'Kaggle', href: 'https://www.kaggle.com/amananandrai', logo: logo('kaggle.png'), logoAlt: 'Kaggle Logo' },
      ],
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: 'award',
      links: [
        { label: 'Credly', href: 'https://www.credly.com/users/aman-anand-rai/', logo: logo('credly.png'), logoAlt: 'Credly Logo' },
        { label: 'Accredible', href: 'https://www.credential.net/profile/amananandrai53325/wallet', logo: logo('accredible.jpg'), logoAlt: 'Accredible Logo' },
      ],
    },
    {
      id: 'research',
      title: 'Research',
      icon: 'search',
      links: [
        { label: 'ResearchGate', href: 'https://www.researchgate.net/profile/Aman-Rai-9?ev=prf_overview', logo: logo('researchgate.png'), logoAlt: 'ResearchGate Logo' },
        { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=khuuiBIAAAAJ&hl=en', logo: logo('googlescholar.png'), logoAlt: 'Google Scholar Logo' },
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
  backLink: 'Back to portfolio',
  defaultFrame: 'modern' as FrameStyle['id'],
  frames: [
    { id: 'none', name: 'None', description: 'Standard clean edges' },
    { id: 'modern', name: 'Modern', description: 'Studio white with drop shadow' },
    { id: 'classic', name: 'Mahogany', description: 'Dark polished wood' },
    { id: 'gold', name: 'Gilded Gold', description: 'Regal metallic finish' },
    { id: 'neon', name: 'Neon Glow', description: 'Vibrant pink illumination' },
  ] satisfies FrameStyle[],
  paintings: [
    { id: 'p1', src: '/img/optimized/tm-img-01-1200.webp', full: '/img/optimized/tm-img-01-2400.webp', original: '/img/tm-img-01.jpg', width: 4000, height: 3000, alt: 'Image 1' },
    { id: 'p2', src: '/img/optimized/tm-img-02-1200.webp', full: '/img/optimized/tm-img-02-2400.webp', original: '/img/tm-img-02.jpg', width: 4000, height: 2966, alt: 'Image 2' },
    { id: 'p3', src: '/img/optimized/tm-img-03-1200.webp', full: '/img/optimized/tm-img-03-2400.webp', original: '/img/tm-img-03.jpg', width: 3049, height: 4377, alt: 'Image 3' },
  ] satisfies Painting[],
}
