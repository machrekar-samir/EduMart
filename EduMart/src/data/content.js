export const NAV_LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/ai-tools', label: 'AI Tools' },
  { to: '/trust', label: 'Trust' },
  { to: '/vision', label: 'Vision' },
]

export const FEATURES = [
  {
    icon: '📚',
    bg: '#e0f2fe',
    title: 'Academic Marketplace',
    desc: 'Buy, sell, and monetize educational content with AI-powered quality insights.',
    items: [
      'Study notes, assignments & project reports',
      'Previous year question papers & e-books',
      'Upload and monetize high-quality content',
      'AI note quality analysis & pricing suggestions',
    ],
  },
  {
    icon: '🛍️',
    bg: '#d1fae5',
    title: 'Physical Product Marketplace',
    desc: 'Secure student-to-student transactions with local college listings.',
    items: [
      'Used textbooks, calculators & laptops',
      'Lab equipment & hostel furniture',
      'Secure peer-to-peer transactions',
      'College-based listings for faster exchanges',
    ],
  },
  {
    icon: '💻',
    bg: '#fef3c7',
    title: 'Freelance Services Hub',
    desc: 'Turn your skills into income with campus-friendly freelance gigs.',
    services: [
      'Website Development',
      'Graphic Design',
      'Video Editing',
      'Resume Writing',
      'Coding Assistance',
      'Presentation Design',
      'Digital Marketing',
    ],
  },
  {
    icon: '🎨',
    bg: '#fce7f3',
    title: 'Digital Products Store',
    desc: 'Sell templates, assets, and resources students actually need.',
    services: [
      'Resume & Portfolio Templates',
      'Website & PPT Templates',
      'AI Prompt Packs',
      'Coding Resources',
      'Design Assets',
    ],
  },
  {
    icon: '👥',
    bg: '#e0e7ff',
    title: 'Student Community',
    desc: 'Collaborate, discuss, and grow together on campus.',
    items: [
      'Discussion forums & Q&A sections',
      'Study groups',
      'Peer-to-peer collaboration',
    ],
  },
  {
    icon: '🚀',
    bg: '#ede9fe',
    title: 'Internship & Career Center',
    desc: 'Launch your career with opportunities built for students.',
    items: [
      'Internship opportunities & job listings',
      'Career guidance resources',
      'Skill development recommendations',
    ],
  },
]

export const AI_FEATURES = [
  {
    icon: '🤖',
    title: 'AI Notes Quality Checker',
    desc: 'Automatically analyzes uploaded notes and provides actionable scores.',
    metrics: ['Quality Score', 'Readability Score', 'Completeness Score'],
  },
  {
    icon: '💰',
    title: 'AI Price Recommendation',
    desc: 'Suggests optimal selling price based on market intelligence.',
    metrics: ['Category', 'Demand', 'Content Quality', 'Market Trends'],
  },
  {
    icon: '🎯',
    title: 'Smart Recommendation Engine',
    desc: 'Personalized discovery based on your academic profile.',
    metrics: ['College', 'Branch', 'Academic Year', 'Interests'],
  },
]

export const REVENUE = [
  {
    icon: '💳',
    title: 'Commission on Sales',
    desc: 'Small percentage charged on every successful transaction.',
  },
  {
    icon: '⭐',
    title: 'Featured Listings',
    desc: 'Sellers can promote products for better visibility.',
  },
  {
    icon: '👑',
    title: 'Premium Seller Membership',
    desc: 'Unlock premium benefits for power sellers.',
    premium: true,
    items: ['Verified Badge', 'Advanced Analytics', 'Priority Support', 'Unlimited Listings'],
  },
  {
    icon: '📢',
    title: 'Educational Advertisements',
    desc: 'Partner with courses, platforms, and student services.',
    items: ['Online Courses', 'Learning Platforms', 'Student Services', 'Educational Tools'],
  },
]

export const TAGLINES = [
  'Learn. Earn. Grow.',
  'The Marketplace Built for Students.',
  'Turn Your Knowledge Into Income.',
  'Buy Smarter. Sell Faster. Learn Better.',
  'Where Students Create Opportunities.',
]

export const AUDIENCE = [
  'College Students',
  'University Students',
  'Freelancers',
  'Fresh Graduates',
  'Campus Entrepreneurs',
]

export const GET_STARTED_STEPS = [
  {
    title: 'Welcome to EduMartX',
    subtitle: 'Your campus marketplace in three quick steps.',
    body: 'Join thousands of students buying, selling, and growing together. Tell us how you want to use the platform.',
    options: ['Buy & learn', 'Sell & earn', 'Both'],
  },
  {
    title: 'Your campus profile',
    subtitle: 'We personalize listings for your college.',
    body: 'Add your college and branch so we can show relevant notes, gigs, and opportunities near you.',
    fields: ['College name', 'Branch / major', 'Year of study'],
  },
  {
    title: 'What interests you?',
    subtitle: 'Pick topics to power smart recommendations.',
    body: 'Select categories you care about. You can change these anytime in settings.',
    options: ['Notes & books', 'Freelance', 'Digital products', 'Internships', 'Community'],
  },
  {
    title: "You're all set!",
    subtitle: 'Your EduMartX account is ready.',
    body: 'Explore the marketplace, list your first item, or browse AI-powered recommendations tailored for you.',
  },
]
