/**
 * SEO Constants and Utilities
 */

export const SITE_CONFIG = {
  name: 'Mobile Config Generator',
  description:
    'Free online tool to generate Apple mobileconfig configuration profiles for iOS and macOS devices. Supports Wi-Fi, VPN, DNS, Web Content Filter, Email settings and more. No signup required.',
  url: 'https://mobileconfig.pages.dev',
  author: 'Mobile Config Generator',
  keywords: [
    'mobileconfig',
    'Apple',
    'iOS',
    'macOS',
    'configuration profile',
    'MDM',
    'device management',
    'Wi-Fi',
    'VPN',
    'DNS',
    'web content filter',
    'email settings',
  ],
} as const;

export const PAGE_CONFIG = {
  home: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    path: '/',
  },
  builder: {
    title: `Profile Builder - ${SITE_CONFIG.name}`,
    description:
      'Interactive profile builder for Apple mobileconfig files. Configure Wi-Fi, VPN, DNS, Web Content Filter, and Email settings with detailed payload options. Generate iOS and macOS profiles instantly.',
    keywords: [
      'mobileconfig builder',
      'Apple profile creator',
      'iOS configuration',
      'macOS settings',
      'Wi-Fi profile',
      'VPN profile',
      'DNS settings',
    ],
    path: '/builder',
  },
  presets: {
    title: `Configuration Presets - ${SITE_CONFIG.name}`,
    description:
      'Download pre-configured Apple mobileconfig profiles for common use cases. Ready-to-use templates for Wi-Fi, VPN, DNS, and security settings. No configuration required.',
    keywords: [
      'mobileconfig templates',
      'Apple profile presets',
      'ready-made profiles',
      'configuration templates',
      'Wi-Fi templates',
      'VPN templates',
    ],
    path: '/presets',
  },
  docs: {
    title: `Documentation - ${SITE_CONFIG.name}`,
    description:
      'Complete documentation for Apple mobileconfig configuration profiles. API reference, payload types, supported settings, and implementation examples for iOS and macOS devices.',
    keywords: [
      'mobileconfig documentation',
      'Apple profile API',
      'payload types',
      'configuration reference',
      'iOS settings',
      'macOS configuration',
    ],
    path: '/docs',
  },
} as const;

export interface MetaTagsOptions {
  title: string;
  description: string;
  keywords?: readonly string[];
  path: string;
  noIndex?: boolean;
}

export function generateMetaTags({
  title,
  description,
  keywords = [] as readonly string[],
  path,
  noIndex = false,
}: MetaTagsOptions) {
  const fullUrl = `${SITE_CONFIG.url}${path}`;
  const keywordString = [...SITE_CONFIG.keywords, ...keywords].join(', ');

  return [
    { title },
    { name: 'title', content: SITE_CONFIG.name },
    { name: 'description', content: description },
    { name: 'keywords', content: keywordString },
    { name: 'author', content: SITE_CONFIG.author },
    {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    },

    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: fullUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_CONFIG.name },
    { property: 'og:locale', content: 'en_US' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },

    // Additional SEO
    { name: 'application-name', content: SITE_CONFIG.name },
  ];
}

export function generateStructuredData(
  pageType: 'home' | 'builder' | 'presets' | 'docs' = 'home',
) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    creator: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    featureList: [
      'Wi-Fi configuration profiles',
      'VPN configuration profiles',
      'DNS configuration profiles',
      'Web Content Filter profiles',
      'Email configuration profiles',
      'Interactive payload editor',
      'Pre-configured templates',
    ],
  };

  // Add page-specific structured data
  switch (pageType) {
    case 'builder':
      return {
        ...baseData,
        '@type': 'WebApplication',
        applicationSubCategory: 'Configuration Tool',
        description: PAGE_CONFIG.builder.description,
      };
    case 'presets':
      return {
        ...baseData,
        '@type': 'ItemList',
        name: 'Apple Configuration Profile Templates',
        description: PAGE_CONFIG.presets.description,
        numberOfItems: 5, // Update based on actual presets
      };
    case 'docs':
      return {
        ...baseData,
        '@type': 'TechArticle',
        name: PAGE_CONFIG.docs.title,
        description: PAGE_CONFIG.docs.description,
        genre: 'Documentation',
      };
    default:
      return baseData;
  }
}
