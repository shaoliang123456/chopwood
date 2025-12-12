export const siteMetadata = {
  siteUrl: 'https://webjam.cn',
  siteRepo: 'https://github.com/wencaizhang/wencaizhang.github.io/tree/nextjs',
  siteLogo: '/images/logo.jpg',
  siteShortTitle: 'chopwd', // Used as logo text in header, footer, and splash screen
  siteTitle: 'Full stack web developer',
  siteScreenshot: '',
  siteDescription:
    '全栈软件工程师，拥有丰富的设计、构建和部署现代可扩展应用程序的经验，擅长将复杂的问题转化为干净、高效的解决方案——无论是在前端、后端还是两者之间的任何地方。擅长与团队合作构建可扩展和持久的系统。如果你对高质量的工程感兴趣，并着眼于未来，请随时与我联系。',
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
  profileCover: 'https://static.webjam.cn/images/bg/wew.png',
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
    lang: 'zh-CN',
  },
};

export const socialAccounts = {
  x: '',
  instagram: '',
  email: 'chopwood@qq.com',
  github: 'https://github.com/shaoliang123456',
  twitter: '',
  facebook: '',
  youtube: '',
  linkedin: '',
};

export const author = {
  name: 'chopwd',
  location: 'China',
  timeZone: 'Asia/Shanghai',
  locationIcon: '🇨🇳',
  position: 'Full-Stack Software Engineer | AI Enthusiast',
  greetings: '代码雕刻想法，产品回应世界',
  calMeetingUrl: '',
  status: 'Working remotely around the world',
  workingOn: `I assist brands, companies, institutions, and startups in creating
  exceptional digital experiences for their businesses through strategic
  development services.`,
  workTogether: `I'm open for freelance projects, feel free to email me to see how can we collaborate.`,
  wakatime: '',
  github_accounts: [
    {
      username: 'shaoliang123456',
      token: process.env.GITHUB_READ_USER_TOKEN_PERSONAL,
      endpoint: '/api/github?type=personal',
      type: 'personal',
      is_active: true,
    },
  ],
};

export const featureSwich = {
  // chatGPT
  ai: false,
  contactForm: true,
  meeting: false,
  guestbook: false,
  spotify: false,
  dashboard_wakatime: false,
  dashboard_github: true,
  topBanner: true,
};

export const docSearch = {
  apiKey: 'd291a440fb755a9b202844a68064d4e9', // search only key
  indexName: 'BrianStyle',
  appId: 'A4M5OCLKX8',
};
