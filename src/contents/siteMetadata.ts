export const siteMetadata = {
  siteUrl: 'https://chopwood.me',
  siteLogo: '/images/logo.jpg',
  siteShortTitle: 'chopwd', // Used as logo text in header, footer, and splash screen
  siteTitle: 'Full stack web developer',
  siteScreenshot: '',
  siteDescription:
    'I build AI-powered mobile apps (Flutter) with FastAPI backends — chat, RAG, agents, image/audio features, and production deployment.',
  author: 'chopwood',
  fullName: 'chopwood',
  location: 'China',
  timeZone: 'Asia/Shanghai',
  locationIcon: '🇨🇳',
  //  locationIcon: 'flag-china',
  position: 'Full Stack Web Developer',
  company: '',
  companySite: '',
  locale: 'en-US',
  image: '/images/logo.jpg',
  socialBanner: '/images/logo.jpg',
  profileCover: 'https://static.chopwood.me/images/bg/wew.png',
  analytics: {
    // plausibleDataDomain: '',
    // simpleAnalytics: false, // true | false
    analyticsURL: '',
    umamiScriptSrc: '',
    umamiSiteId: '',
    // googleAnalyticsId: '', // e.g. UA-000000-2 or G-XXXXXXX
  },

  postPageSize: 9,
};

/**
 * Select a provider and use the environment variables associated to it
 * https://vercel.com/docs/environment-variables
 * --
 *
 * Visit each provider's documentation link and follow the instructions, then add the environment variable to your project.
 */
export const commentConfig = {
  enable: false,
  provider: 'giscus',
  // https://giscus.app/
  giscusConfig: {
    gitUsername: '',
    repo: '', // process.env.GISCUS_REPO
    repositoryId: '', // process.env.GISCUS_REPOSITORY_ID
    category: '', // process.env.GISCUS_CATEGORY
    categoryId: '', // process.env.GISCUS_CATEGORY_ID
    mapping: 'title',
    reactions: true,
    metadata: '0',
    lightTheme: 'light',
    darkTheme: 'transparent_dark',
    themeURL: '',
    lang: 'en',
  },
};

export const socialAccounts = {
  x: 'https://x.com/shaoliang8',
  instagram: '',
  email: 'hello@chopwood.me',
  github: 'https://github.com/shaoliang123456',
  facebook: '',
  youtube: '',
  linkedin: '',
};

export const author = {
  name: 'chopwood',
  location: 'China',
  timeZone: 'Asia/Shanghai',
  locationIcon: '🇨🇳',
  position: 'AI App Engineer | Flutter · FastAPI | LLM · RAG · Agents',
  greetings: 'Build AI apps people actually use.',
  calMeetingUrl: '',
  status: 'Working remotely around the world',
  workingOn: `I assist brands, companies, institutions, and startups in creating
  exceptional digital experiences for their businesses through strategic
  development services.`,
  workTogether: `I'm open for freelance projects, feel free to email me to see how can we collaborate.`,
};

export const featureSwitch = {
  // chatGPT
  ai: false,
  contactForm: true,
  meeting: false,
  guestbook: false,
  spotify: false,
  topBanner: true,
};

export const docSearch = {
  apiKey: 'd291a440fb755a9b202844a68064d4e9', // search only key
  indexName: 'BrianStyle',
  appId: 'A4M5OCLKX8',
};
